import { listRows, upsertRow } from './client';
import type { ApiItemResponse, ApiListResponse, TestCaseDistribution } from '../types';

export function fetchTestCaseDistribution(
  weekId: string,
  projectId: string
): Promise<ApiListResponse<TestCaseDistribution>> {
  return listRows<TestCaseDistribution>('test_case_distributions', (builder) =>
    builder.eq('week_id', weekId).eq('project_id', projectId)
  );
}

export function saveTestCaseDistribution(
  payload: TestCaseDistribution | Omit<TestCaseDistribution, 'id'>
): Promise<ApiItemResponse<TestCaseDistribution>> {
  return upsertRow<TestCaseDistribution>('test_case_distributions', payload as TestCaseDistribution, 'week_id,project_id');
}
