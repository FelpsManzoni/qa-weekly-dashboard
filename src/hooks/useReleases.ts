import { useCallback } from 'react';
import { fetchReleases } from '../api/releases';
import { useAsyncData } from './useAsyncData';
import type { ReleaseVersion } from '../types';

export function useReleases(weekId: string | null, projectId: string | null) {
  const loader = useCallback(async () => {
    if (!weekId || !projectId) {
      return [] as ReleaseVersion[];
    }

    const response = await fetchReleases(weekId, projectId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, weekId]);

  return useAsyncData(loader, [] as ReleaseVersion[], Boolean(weekId && projectId));
}
