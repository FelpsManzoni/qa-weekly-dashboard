import { apiGet, apiPost, apiPut } from './client';
import type { Week, ApiItemResponse, ApiListResponse } from '../types';

export async function fetchWeeks(): Promise<ApiListResponse<Week>> {
  const { data, error } = await apiGet<Week[]>('/weeks');
  return { data: data ?? [], error };
}

export async function saveWeek(payload: Partial<Week>): Promise<ApiItemResponse<Week>> {
  const { data, error } = payload.id
    ? await apiPut<Week>(`/weeks/${payload.id}`, payload)
    : await apiPost<Week>('/weeks', payload);
  return { data, error };
}
