import { apiGet } from './client';
import type { ApiItemResponse, ProjectDataPayload } from '../types';

export async function fetchProjectData(
  weekId: string,
  projectId: string
): Promise<ApiItemResponse<ProjectDataPayload>> {
  const qs = `?week_id=${encodeURIComponent(weekId)}&project_id=${encodeURIComponent(projectId)}`;
  const { data, error } = await apiGet<ProjectDataPayload>(`/project-data${qs}`);
  return { data, error };
}
