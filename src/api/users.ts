import { apiGet } from './client';
import type { ApiListResponse, AuthUser } from '../types';

export async function fetchUsers(): Promise<ApiListResponse<AuthUser>> {
  const { data, error } = await apiGet<AuthUser[]>('/users');
  return { data: data ?? [], error };
}
