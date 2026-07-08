import { apiGet, apiPost, apiPut, apiDelete, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, PriorityNote } from '../types';

export async function fetchNotes(weekId: string, projectId: string): Promise<ApiListResponse<PriorityNote>> {
  const qs = queryString({ week_id: weekId, project_id: projectId });
  const { data, error } = await apiGet<PriorityNote[]>(`/notes${qs}`);
  return { data: data ?? [], error };
}

export async function saveNote(payload: Partial<PriorityNote>): Promise<ApiItemResponse<PriorityNote>> {
  const { data, error } = payload.id
    ? await apiPut<PriorityNote>(`/notes/${payload.id}`, payload)
    : await apiPost<PriorityNote>('/notes', payload);
  return { data, error };
}

export async function deleteNote(id: string): Promise<ApiItemResponse<null>> {
  const { error } = await apiDelete(`/notes/${id}`);
  return { data: null, error };
}
