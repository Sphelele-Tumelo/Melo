import apiClient from "./client";

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationCreate {
  title?: string;
}

export async function createConversation(
  data: ConversationCreate = {}
): Promise<Conversation> {
  const response = await apiClient.post<Conversation>(
    "/conversation/create_conversation",
    data
  );

  return response.data;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>(
    "/conversation/get_conversations"
  );

  return response.data;
}

export async function getConversation(
  conversationId: string
): Promise<Conversation> {
  const response = await apiClient.get<Conversation>(
    `/conversation/get_conversation/${conversationId}`
  );

  return response.data;
}

export async function deleteConversation(
  conversationId: string
): Promise<void> {
  await apiClient.delete(
    `/conversation/delete_conversation/${conversationId}`
  );
}