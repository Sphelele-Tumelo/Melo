// api/message.ts

import { AuthStore } from "../../store/AuthStore";

export interface StreamChunk {
  content?: string;
  done?: boolean;
  message_id?: string;
  error?: string;
}

interface SendMessageStreamParams {
  conversationId: string;
  content: string;
  onChunk: (chunk: StreamChunk) => void;
  signal?: AbortSignal;
}

/**
 * Sends a message and streams the assistant's reply back via SSE.
 * Uses native fetch instead of apiClient/axios, since axios doesn't
 * support reading a streaming response body incrementally.
 */
export async function sendMessageStream({
  conversationId,
  content,
  onChunk,
  signal,
}: SendMessageStreamParams): Promise<void> {
  const token = AuthStore.getState().accessToken;
  const baseURL = import.meta.env.VITE_API_URL;

  const response = await fetch(
    `${baseURL}/chat/${conversationId}/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
      signal,
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      AuthStore.getState().logout();
    }
    throw new Error(`Stream request failed: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body to stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data:")) continue;

      const jsonStr = line.slice("data:".length).trim();

      try {
        const parsed: StreamChunk = JSON.parse(jsonStr);
        onChunk(parsed);
      } catch {
        continue;
      }
    }
  }
}