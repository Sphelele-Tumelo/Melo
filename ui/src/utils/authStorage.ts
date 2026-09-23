//# authStorage.ts

const AUTH_STORAGE_KEY = "melo-auth";

interface StoredAuth {
  accessToken: string | null;
  userId: string | null;
}

export function getStoredAuth(): StoredAuth {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return {
      accessToken: null,
      userId: null,
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      accessToken: null,
      userId: null,
    };
  }
}

export function getAccessToken(): string | null {
  return getStoredAuth().accessToken;
}

export function setStoredAuth(
  accessToken: string,
  userId: string | null
): void {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken,
      userId,
    })
  );
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}