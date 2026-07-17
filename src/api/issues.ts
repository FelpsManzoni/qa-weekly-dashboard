import { apiGet, apiPost, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, IssueMetric } from '../types';

// History for a project, ordered by week number server-side. When aroundWeekId is
// provided the backend scopes the result to the most recent N weeks ending there.
export async function fetchIssueHistory(
  projectId: string,
  endWeekId?: string | null,
  rangeWeeks: 5 | 10 = 5
): Promise<ApiListResponse<IssueMetric>> {
  const qs = queryString({ project_id: projectId, end_week_id: endWeekId, range_weeks: rangeWeeks });
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
