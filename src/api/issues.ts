import { listRows, upsertRow } from './client';
import type { ApiItemResponse, ApiListResponse, IssueMetric } from '../types';

export function fetchIssueHistory(projectId: string): Promise<ApiListResponse<IssueMetric>> {
  return listRows<IssueMetric>('issue_metrics', (builder) => builder.eq('project_id', projectId).order('created_at', { ascending: true }));
}

export function fetchIssueMetric(weekId: string, projectId: string): Promise<ApiListResponse<IssueMetric>> {
  return listRows<IssueMetric>('issue_metrics', (builder) => builder.eq('week_id', weekId).eq('project_id', projectId));
}

export function saveIssueMetric(payload: IssueMetric | Omit<IssueMetric, 'id'>): Promise<ApiItemResponse<IssueMetric>> {
  return upsertRow<IssueMetric>('issue_metrics', payload as IssueMetric, 'week_id,project_id');
}
