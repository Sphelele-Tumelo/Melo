import apiClient from "./client";
import { getAccessToken } from "../utils/authStorage";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  stopped?: boolean; // client-side only — true if generation was interrupted
}

export interface MessageCreate {
  content: string;
}

export async function streamMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onComplete: (messageId: string) => void,
  signal?: AbortSignal,
  webSearch = false,
): Promise<void> {
  const accessToken = getAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/chat/${conversationId}/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
        body: JSON.stringify({ content, web_search: webSearch }),
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`Streaming request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Streaming response body is unavailable.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";
  let receivedCompletion = false;

  function processEvent(event: string) {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");

    if (!data) {
      return;
    }

    const payload = JSON.parse(data);

    if (payload.error) {
      throw new Error(payload.error);
    }

    if (typeof payload.content === "string") {
      onChunk(payload.content);
    }

    if (payload.done && !receivedCompletion) {
      if (typeof payload.message_id !== "string") {
        throw new Error("Streaming response completed without a message ID.");
      }

      receivedCompletion = true;
      onComplete(payload.message_id);
    }
  }

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      buffer += decoder.decode();
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split(/\r?\n\r?\n/);

    buffer = events.pop() ?? "";

    for (const event of events) {
      processEvent(event);
    }
  }

  if (buffer.trim()) {
    processEvent(buffer);
  }

  if (!receivedCompletion) {
    throw new Error("Streaming response ended before Melo finished replying.");
  }
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const response = await apiClient.get<Message[]>(
    `/chat/${conversationId}`
  );

  return response.data;
}

export async function createMessage(
  conversationId: string,
  data: MessageCreate
): Promise<Message> {
  const response = await apiClient.post<Message>(
    `/chat/create_message?conversation_id=${conversationId}`,
    data
  );

  return response.data;
}