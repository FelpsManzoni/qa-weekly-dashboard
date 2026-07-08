import { useCallback } from 'react';
import { fetchTestCaseDistribution } from '../api/testCases';
import { useAsyncData } from './useAsyncData';
import type { TestCaseDistribution } from '../types';

export function useTestCaseDistribution(weekId: string | null, projectId: string | null) {
  const loader = useCallback(async () => {
    if (!weekId || !projectId) {
      return [] as TestCaseDistribution[];
    }

    const response = await fetchTestCaseDistribution(weekId, projectId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, weekId]);

  return useAsyncData(loader, [] as TestCaseDistribution[], Boolean(weekId && projectId));
}
