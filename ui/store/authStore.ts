// store/useAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signIn, signUp, SignInRequest, SignUpRequest } from "../src/api/auth";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: SignInRequest) => Promise<void>;
  register: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Decodes the JWT payload to pull out the user_id (the 'sub' claim) —
// no need for a separate /me call right after login since it's already
// embedded in the token itself.
function decodeUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export const AuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signIn(data);
          const userId = decodeUserIdFromToken(response.access_token);

          set({
            accessToken: response.access_token,
            userId,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.detail || "Failed to sign in.",
          });
          throw err;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await signUp(data);
          set({ isLoading: false });
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.detail || "Failed to sign up.",
          });
          throw err;
        }
      },

      logout: () => {
        set({
          accessToken: null,
          userId: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "melo-auth", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);