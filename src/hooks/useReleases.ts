import { useCallback } from 'react';
import { fetchReleases } from '../api/releases';
import { useAsyncData } from './useAsyncData';
import type { ReleaseVersion, Week } from '../types';

export function useReleases(selectedWeek: Pick<Week, 'id' | 'end_date'> | null, projectId: string | null) {
  const loader = useCallback(async () => {
    if (!selectedWeek || !projectId) {
      return [] as ReleaseVersion[];
    }

    const response = await fetchReleases({
      week_id: selectedWeek.id,
      project_id: projectId,
      released_before: selectedWeek.end_date,
      limit: 5
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, selectedWeek]);

  return useAsyncData(loader, [] as ReleaseVersion[], Boolean(selectedWeek && projectId));
}
