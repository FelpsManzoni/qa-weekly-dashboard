import { apiGet, apiPost, apiPut } from './client';
import type { Project, ApiItemResponse, ApiListResponse } from '../types';

export async function fetchProjects(): Promise<ApiListResponse<Project>> {
  const { data, error } = await apiGet<Project[]>('/projects');
  return { data: data ?? [], error };
}

export async function saveProject(payload: Partial<Project>): Promise<ApiItemResponse<Project>> {
  const { data, error } = payload.id
    ? await apiPut<Project>(`/projects/${payload.id}`, payload)
    : await apiPost<Project>('/projects', payload);
  return { data, error };
}
