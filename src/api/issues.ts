import { apiGet, apiPost, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, IssueMetric } from '../types';

// History for a project, ordered by week number server-side. When aroundWeekId is
// provided the backend scopes the result to a window of weeks around that week.
export async function fetchIssueHistory(
  projectId: string,
  aroundWeekId?: string | null
): Promise<ApiListResponse<IssueMetric>> {
  const qs = queryString({ project_id: projectId, around_week_id: aroundWeekId });
  const { data, error } = await apiGet<IssueMetric[]>(`/issue-metrics${qs}`);
  return { data: data ?? [], error };
}

export async function fetchIssueMetric(weekId: string, projectId: string): Promise<ApiListResponse<IssueMetric>> {
  const qs = queryString({ project_id: projectId, week_id: weekId });
  const { data, error } = await apiGet<IssueMetric[]>(`/issue-metrics${qs}`);
  return { data: data ?? [], error };
}

export async function saveIssueMetric(
  payload: IssueMetric | Omit<IssueMetric, 'id'>
): Promise<ApiItemResponse<IssueMetric>> {
  const { data, error } = await apiPost<IssueMetric>('/issue-metrics', payload);
  return { data, error };
}
