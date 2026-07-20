import { apiGet, apiPost } from './client';
import type { ApiItemResponse, AuthUser } from '../types';

export type AuthResponse = { token: string; user: AuthUser };

export async function register(input: {
  username: string;
  email: string;
  password: string;
  display_name?: string;
}): Promise<ApiItemResponse<AuthResponse>> {
  const { data, error } = await apiPost<AuthResponse>('/auth/register', input);
  return { data, error };
}

export async function login(input: {
  username: string;
  password: string;
}): Promise<ApiItemResponse<AuthResponse>> {
  const { data, error } = await apiPost<AuthResponse>('/auth/login', input);
  return { data, error };
}

export async function fetchCurrentUser(): Promise<ApiItemResponse<AuthUser>> {
  const { data, error } = await apiGet<{ user: AuthUser }>('/auth/me');
  return { data: data?.user ?? null, error };
}
