import { create } from "zustand";
import { createConversation, getConversations } from "../api/conversation";
import { getMessages, StreamError, streamMessage } from "../api/message";
import { deleteConversation as deleteConversationApi } from "../api/conversation.ts";
import type { Conversation } from "../api/conversation";
import type { Message, MeloActivity, WebSource } from "../api/message";
import { updateConversation } from "../api/conversation.ts";
import { createTypewriter } from "../utils/typewriter";

interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isGenerating: boolean;
  activity: MeloActivity;
  isThinking: boolean;
  error: string | null;
  currentAbortController: AbortController | null;

  deleteConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, options?: { webSearch?: boolean }) => Promise<void>;
  createNewConversation: () => Promise<string>;
  togglePin: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  stopGeneration: () => void;
  restartConversation: () => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,
  isLoadingConversations: false,
  isLoadingMessages: false,
  isGenerating: false,
  isThinking: false,
  error: null,
  activity: "idle",
  currentAbortController: null,

  createNewConversation: async () => {
    try {
      set({ error: null });
      const conversation = await createConversation();
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
        messages: [],
      }));
      return conversation.id;
    } catch {
      set({ error: "Failed to create a new conversation." });
      throw new Error("Failed to create conversation");
    }
  },

  togglePin: async (conversationId) => {
    const conversation = get().conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    try {
      const updated = await updateConversation(conversationId, {
        is_pinned: !conversation.is_pinned,
      });

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? updated : c
        ),
      }));
    } catch (err) {
      set({ error: "Failed to update pin status." });
      throw err;
    }
  },

  loadConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const conversations = await getConversations();
      set({ conversations, isLoadingConversations: false });
    } catch {
      set({ isLoadingConversations: false, error: "Failed to load conversations." });
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      await deleteConversationApi(conversationId);

      set((state) => {
        const wasActive = state.activeConversationId === conversationId;
        return {
          conversations: state.conversations.filter((c) => c.id !== conversationId),
          ...(wasActive ? { activeConversationId: null, messages: [] } : {}),
        };
      });
    } catch (err) {
      set({ error: "Failed to delete conversation." });
      throw err;
    }
  },

  loadMessages: async (conversationId) => {
    set({ isLoadingMessages: true, error: null, activeConversationId: conversationId });
    try {
      const messages = await getMessages(conversationId);
      set({ messages, isLoadingMessages: false });
    } catch {
      set({ isLoadingMessages: false, error: "Failed to load messages." });
    }
  },

  sendMessage: async (content, options) => {
    const conversationId = get().activeConversationId;
    if (!conversationId) {
      set({ error: "No active conversation." });
      return;
    }

    const tempUserId = crypto.randomUUID();
    const tempAssistantId = crypto.randomUUID();

    const userMsg: Message = {
      id: tempUserId,
      conversation_id: conversationId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    const assistantMsg: Message = {
      id: tempAssistantId,
      clientId: tempAssistantId,
      conversation_id: conversationId,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString(),
    };

    const abortController = new AbortController();
    let finalMessageId: string | null = null;
    
    set((state) => ({
      messages: [...state.messages, userMsg, assistantMsg],
      isThinking: true,
      isGenerating: true,
      error: null,
      currentAbortController: abortController,
    }));
    
    const typewriter = createTypewriter(
      (revealedText) => {
        set((state) => ({
          isThinking: false,
          messages: state.messages.map((msg) =>
            msg.id === tempAssistantId
              ? { ...msg, content: revealedText }
              : msg
          ),
        }));
      },
      () => {
        // fully revealed: swap in the real id and finish
        set((state) => ({
          isThinking: false,
          isGenerating: false,
          activity: "idle",
          currentAbortController: null,
          messages: state.messages.map((msg) =>
            msg.id === tempAssistantId && finalMessageId
              ? { ...msg, id: finalMessageId }
              : msg
          ),
        }));
      },
    );

    try {
      await streamMessage(
        conversationId,
        content,
        (chunk) => typewriter.push(chunk),
        (id) => {
          finalMessageId = id;
          typewriter.finish();
        },
        abortController.signal,
        options?.webSearch ?? false,
        (activity) => set({ activity }),
        (sources: WebSource[]) =>
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.clientId === tempAssistantId ? { ...msg, sources } : msg
            ),
          })),
      );
      typewriter.finish(); // covers a stream that ends without a "done" event
    } catch (err) {
      typewriter.stop();
      const wasAborted =
        err instanceof DOMException && err.name === "AbortError";
    
      set((state) => ({
        isThinking: false,
        isGenerating: false,
        activity: "idle",
        currentAbortController: null,
        error: wasAborted
          ? null
          : err instanceof StreamError
            ? err.message
            : "Failed to send message.",
        messages: state.messages.map((msg) =>
          msg.id === tempAssistantId
            ? { ...msg, stopped: wasAborted }
            : msg
        ),
      }));
    }
  },
  
  stopGeneration: () => {
    get().currentAbortController?.abort();
    set({ activity: "idle" });
  },

  restartConversation: async () => {
    set({ messages: [],
      activity: "idle", isThinking: false, isGenerating: false, error: null });
  },

  clearError: () => set({ error: null }),
}));