import { useCallback, useMemo } from 'react';
import { fetchWeeks } from '../api/weeks';
import { useAsyncData } from './useAsyncData';
import type { Week } from '../types';

export function useWeeks(projectId?: string | null) {
  // Memoize the loader so useAsyncData's refresh identity stays stable across renders.
  const loader = useCallback(async () => {
    const response = await fetchWeeks(projectId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [projectId]);

  const state = useAsyncData(loader, [] as Week[]);

  const activeWeeks = useMemo(() => state.data, [state.data]);

  return {
    ...state,
    activeWeeks
  };
}
