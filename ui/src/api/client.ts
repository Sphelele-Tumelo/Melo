

import axios from "axios";
import { AuthStore } from ".../store/authStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current access token to every outgoing request automatically —
// no need to manually pass Authorization headers on each API call.
apiClient.interceptors.request.use((config) => {
  const token = AuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// If a request comes back 401 (expired/invalid token), log the user out
// client-side so the app doesn't sit in a broken "looks logged in but
// every request fails" state.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthStore.getState().logout();
      // Optional: redirect to login here too, e.g. window.location.href = "/login"
      // Leaving that out for now since it depends on your router setup.
    }

    return Promise.reject(error);
  }
);

export default apiClient;