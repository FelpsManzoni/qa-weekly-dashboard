import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { login as loginApi, register as registerApi, fetchCurrentUser } from '../api/auth';
import { getAuthToken, setAuthToken, setUnauthorizedHandler } from '../api/client';
import type { ApiError, AuthUser } from '../types';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<ApiError | null>;
  register: (input: { username: string; email: string; password: string; display_name?: string }) => Promise<ApiError | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  // Force logout if any request comes back 401 (expired/invalid token).
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // On mount, if a token is stored, validate it by fetching the current user.
  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!getAuthToken()) {
        setIsLoading(false);
        return;
      }
      const { data, error } = await fetchCurrentUser();
      if (cancelled) return;
      if (error || !data) {
        setAuthToken(null);
        setUser(null);
      } else {
        setUser(data);
      }
      setIsLoading(false);
    }
    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { data, error } = await loginApi({ username, password });
    if (error || !data) {
      return error ?? { message: 'Login failed', code: 'LOGIN_FAILED' };
    }
    setAuthToken(data.token);
    setUser(data.user);
    return null;
  }, []);

  const register = useCallback(
    async (input: { username: string; email: string; password: string; display_name?: string }) => {
      const { data, error } = await registerApi(input);
      if (error || !data) {
        return error ?? { message: 'Registration failed', code: 'REGISTER_FAILED' };
      }
      setAuthToken(data.token);
      setUser(data.user);
      return null;
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
