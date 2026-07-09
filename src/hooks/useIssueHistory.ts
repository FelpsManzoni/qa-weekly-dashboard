import { useCallback } from 'react';
import { fetchIssueHistory } from '../api/issues';
import { useAsyncData } from './useAsyncData';
import type { IssueMetric } from '../types';

export function useIssueHistory(
  projectId: string | null,
  selectedWeekId: string | null = null,
  rangeWeeks: 5 | 10 = 5
) {
  const loader = useCallback(async () => {
    if (!projectId) {
      return [] as IssueMetric[];
    }

    const response = await fetchIssueHistory(projectId, selectedWeekId, rangeWeeks);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, rangeWeeks, selectedWeekId]);

  return useAsyncData(loader, [] as IssueMetric[], Boolean(projectId));
}
