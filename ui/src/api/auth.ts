import apiClient from "./client";

export interface SignUpRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpResponse {
  message: string;
  user_id: string;
}

export interface SignInResponse {
  message: string;
  access_token: string;
  token_type: string;
}

export async function signUp(
  data: SignUpRequest
): Promise<SignUpResponse> {
  const response = await apiClient.post<SignUpResponse>(
    "/user/sign_up",
    data
  );

  return response.data;
}

export async function signIn(
  data: SignInRequest
): Promise<SignInResponse> {
  const response = await apiClient.post<SignInResponse>(
    "/user/sign_in",
    data
  );

  return response.data;
}