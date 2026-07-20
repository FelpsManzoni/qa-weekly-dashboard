import { apiGet, apiPost, apiPut, queryString } from './client';
import type { Week, WeekDraft, ApiItemResponse, ApiListResponse } from '../types';

export async function fetchWeeks(projectId?: string | null): Promise<ApiListResponse<Week>> {
  const qs = projectId ? queryString({ project_id: projectId }) : '';
  const { data, error } = await apiGet<Week[]>(`/weeks${qs}`);
  return { data: data ?? [], error };
}

export async function saveWeek(payload: Partial<Week>): Promise<ApiItemResponse<Week>> {
  const { data, error } = payload.id
    ? await apiPut<Week>(`/weeks/${payload.id}`, payload)
    : await apiPost<Week>('/weeks', payload);
  return { data, error };
}

export async function ensureWeek(payload: Omit<WeekDraft, 'id'>): Promise<ApiItemResponse<Week>> {
  const { data, error } = await apiPost<Week>('/weeks', payload);
  return { data, error };
}
