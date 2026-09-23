import apiClient from "./client";
import { getAccessToken } from "../utils/authStorage";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface MessageCreate {
  content: string;
}

export async function streamMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onComplete: (messageId: string) => void,
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
      body: JSON.stringify({
        content,
      }),
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

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const event of events) {
      if (!event.startsWith("data: ")) {
        continue;
      }

      const payload = JSON.parse(event.slice(6));

      if (payload.error) {
        throw new Error(payload.error);
      }

      if (payload.content) {
        onChunk(payload.content);
      }

      if (payload.done) {
        onComplete(payload.message_id);
      }
    }
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