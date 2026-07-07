import { useCallback } from 'react';
import { fetchNotes } from '../api/notes';
import { useAsyncData } from './useAsyncData';
import type { PriorityNote } from '../types';

export function useNotes(weekId: string | null, projectId: string | null) {
  const loader = useCallback(async () => {
    if (!weekId || !projectId) {
      return [] as PriorityNote[];
    }

    const response = await fetchNotes(weekId, projectId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId, weekId]);

  return useAsyncData(loader, [] as PriorityNote[], Boolean(weekId && projectId));
}
