import type { ApiError } from '../types';

export const TOKEN_STORAGE_KEY = 'qa-dashboard-token';

const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

let authToken: string | null =
  typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
  if (typeof localStorage === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

/** Registers a callback invoked when the API returns 401 (e.g. to force logout). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function mapError(error: unknown, code = 'UNKNOWN_ERROR'): ApiError {
  if (error instanceof Error) {
    return { message: error.message, code };
  }
  return { message: 'Unexpected error', code };
}

type Envelope<T> = { data: T | null; error: ApiError | null };

async function request<T>(method: string, path: string, body?: unknown): Promise<Envelope<T>> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (response.status === 401) {
      unauthorizedHandler?.();
    }

    if (response.status === 204) {
      return { data: null, error: null };
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const error: ApiError = payload?.error ?? { message: 'Request failed', code: 'REQUEST_FAILED' };
      return { data: null, error };
    }

    return { data: payload as T, error: null };
  } catch (error) {
    return { data: null, error: mapError(error) };
  }
}

export function apiGet<T>(path: string): Promise<Envelope<T>> {
  return request<T>('GET', path);
}

export function apiPost<T>(path: string, body: unknown): Promise<Envelope<T>> {
  return request<T>('POST', path, body);
}

export function apiPut<T>(path: string, body: unknown): Promise<Envelope<T>> {
  return request<T>('PUT', path, body);
}

export function apiDelete<T = null>(path: string): Promise<Envelope<T>> {
  return request<T>('DELETE', path);
}

/** Builds a query string from defined params only. */
export function queryString(params: Record<string, string | null | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return '';
  const search = new URLSearchParams(entries as [string, string][]);
  return `?${search.toString()}`;
}
