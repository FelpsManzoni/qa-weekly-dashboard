import { apiGet, queryString } from './client';
import type { ApiItemResponse, ProjectDataPayload, ProjectDataRequest } from '../types';

export async function fetchProjectData(
  request: ProjectDataRequest
): Promise<ApiItemResponse<ProjectDataPayload>> {
  const qs = queryString(request);
  const { data, error } = await apiGet<ProjectDataPayload>(`/project-data${qs}`);
  return { data, error };
}
