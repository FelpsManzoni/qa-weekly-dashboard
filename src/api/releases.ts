import { apiGet, apiPost, apiPut, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, ReleaseVersion } from '../types';

export type FetchReleasesRequest = {
  week_id?: string | null;
  project_id: string;
  released_before?: string | null;
  limit?: number | null;
};

export async function fetchReleases(request: FetchReleasesRequest): Promise<ApiListResponse<ReleaseVersion>> {
  const qs = queryString(request);
  const { data, error } = await apiGet<ReleaseVersion[]>(`/releases${qs}`);
  return { data: data ?? [], error };
}

export async function saveRelease(payload: Partial<ReleaseVersion>): Promise<ApiItemResponse<ReleaseVersion>> {
  const { data, error } = payload.id
    ? await apiPut<ReleaseVersion>(`/releases/${payload.id}`, payload)
    : await apiPost<ReleaseVersion>('/releases', payload);
  return { data, error };
}
