import { useCallback } from 'react';
import { fetchIssueHistory } from '../api/issues';
import { useAsyncData } from './useAsyncData';
import type { IssueMetric } from '../types';

// Passing the selected week scopes the history to a window around it (improvements #7/#10).
export function useIssueHistory(projectId: string | null, selectedWeekId: string | null = null) {
  const loader = useCallback(async () => {
    if (!projectId) {
      return [] as IssueMetric[];
    }

    const response = await fetchIssueHistory(projectId, selectedWeekId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, selectedWeekId]);

  return useAsyncData(loader, [] as IssueMetric[], Boolean(projectId));
}
