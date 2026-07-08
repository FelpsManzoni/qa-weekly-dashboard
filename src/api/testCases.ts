import { apiGet, apiPost, queryString } from './client';
import type { ApiItemResponse, ApiListResponse, TestCaseDistribution } from '../types';

export async function fetchTestCaseDistribution(
  weekId: string,
  projectId: string
): Promise<ApiListResponse<TestCaseDistribution>> {
  const qs = queryString({ week_id: weekId, project_id: projectId });
  const { data, error } = await apiGet<TestCaseDistribution[]>(`/test-case-distributions${qs}`);
  return { data: data ?? [], error };
}

export async function saveTestCaseDistribution(
  payload: TestCaseDistribution | Omit<TestCaseDistribution, 'id'>
): Promise<ApiItemResponse<TestCaseDistribution>> {
  const { data, error } = await apiPost<TestCaseDistribution>('/test-case-distributions', payload);
  return { data, error };
}
