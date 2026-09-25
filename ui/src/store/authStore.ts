import { create } from "zustand";
import axios, { type AxiosError } from "axios";
import apiClient from "../api/client";
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
} from "../utils/authStorage";
import {
  signIn,
  signUp,
  type SignInRequest,
  type SignUpRequest,
} from "../api/auth";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  displayName: string | null;
  fetchCurrentUser: () => Promise<void>;

  login: (data: SignInRequest) => Promise<void>;
  register: (data: SignUpRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

function decodeUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

// Safely pulls a backend error message out of an unknown caught error,
// falling back to a generic message if the shape doesn't match what we expect.
function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ detail?: string }>;
    return axiosErr.response?.data?.detail || fallback;
  }
  return fallback;
}

const storedAuth = getStoredAuth();

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: storedAuth.accessToken,
  userId: storedAuth.userId,
  isAuthenticated: !!storedAuth.accessToken,
  isLoading: false,
  displayName: null,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const response = await signIn(data);
      const userId = decodeUserIdFromToken(response.access_token);

      setStoredAuth(response.access_token, userId);

      set({
        accessToken: response.access_token,
        userId,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        isLoading: false,
        error: extractErrorMessage(err, "Failed to sign in."),
      });
      throw err;
    }
  },

  fetchCurrentUser: async () => {
  try {
    const response = await apiClient.get("/user/me");
    set({ displayName: response.data.display_name });
  } catch {
    // silent fail is fine here — worst case, UI shows the default fallback
  }
},

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await signUp(data);
      set({ isLoading: false });
    } catch (err: unknown) {
      set({
        isLoading: false,
        error: extractErrorMessage(err, "Failed to sign up."),
      });
      throw err;
    }
  },

  logout: () => {
    clearStoredAuth();
    set({
      accessToken: null,
      userId: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));