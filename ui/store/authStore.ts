import { create } from "zustand";
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
} from "../utils/authStorage";
import {
  signIn,
  signUp,
  SignInRequest,
  SignUpRequest,
} from "../../api/auth"; // fixed path — adjust to match your real structure

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

function decodeUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

const storedAuth = getStoredAuth();

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: storedAuth.accessToken,
  userId: storedAuth.userId,
  isAuthenticated: !!storedAuth.accessToken,
  isLoading: false,
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
    clearStoredAuth();
    set({
      accessToken: null,
      userId: null,
      isAuthenticated: false,
    });
  },

  clearError: () => set({ error: null }),
}));