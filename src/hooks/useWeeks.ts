import { useCallback, useMemo } from 'react';
import { fetchWeeks } from '../api/weeks';
import { useAsyncData } from './useAsyncData';
import type { Week } from '../types';

export function useWeeks() {
  // Memoize the loader so useAsyncData's refresh identity stays stable across renders.
  const loader = useCallback(async () => {
    const response = await fetchWeeks();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, []);

  const state = useAsyncData(loader, [] as Week[]);

  const activeWeeks = useMemo(() => state.data.filter((week) => week.is_active), [state.data]);

  return {
    ...state,
    activeWeeks
  };
}
