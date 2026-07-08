import { apiGet, apiPost, apiPut, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, ReleaseVersion } from '../types';

export async function fetchReleases(weekId: string, projectId: string): Promise<ApiListResponse<ReleaseVersion>> {
  const qs = queryString({ week_id: weekId, project_id: projectId });
  const { data, error } = await apiGet<ReleaseVersion[]>(`/releases${qs}`);
  return { data: data ?? [], error };
}

export async function saveRelease(payload: Partial<ReleaseVersion>): Promise<ApiItemResponse<ReleaseVersion>> {
  const { data, error } = payload.id
    ? await apiPut<ReleaseVersion>(`/releases/${payload.id}`, payload)
    : await apiPost<ReleaseVersion>('/releases', payload);
  return { data, error };
}
