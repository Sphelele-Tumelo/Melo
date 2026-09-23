// api/conversation.ts

import apiClient from "./client";

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  is_pinned: boolean;
  updated_at: string;
}

interface UpdateConversationResponse {
  message: string;
  conversation: Conversation;
}

export interface ConversationCreate {
  title?: string;
}

interface CreateConversationResponse {
  message: string;
  conversation_id: string;
}

interface GetConversationsResponse {
  message: string;
  conversations: Conversation[];
}

interface GetConversationResponse {
  message: string;
  conversation: Conversation;
}



export async function updateConversation(
  conversationId: string,
  data: { is_pinned?: boolean; title?: string }
): Promise<Conversation> {
  const response = await apiClient.put<UpdateConversationResponse>(
    `/conversation/update_conversation?conversation_id=${conversationId}`,
    data
  );

  return response.data.conversation;
}

export async function createConversation(
  data: ConversationCreate = {}
): Promise<Conversation> {
  const createRes = await apiClient.post<CreateConversationResponse>(
    "/conversation/create_conversation",
    data
  );

  // Backend only returns the new id on create, not the full object —
  // fetch it once more to get the complete Conversation shape.
  return getConversation(createRes.data.conversation_id);
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiClient.get<GetConversationsResponse>(
    "/conversation/get_conversations"
  );

  return response.data.conversations;
}

export async function getConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await apiClient.get<GetConversationResponse>(
    `/conversation/get_conversation/${conversationId}`
  );

  return response.data.conversation;
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiClient.delete(
    `/conversation/delete_conversation/${conversationId}`
  );
}