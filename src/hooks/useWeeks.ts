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

    return { forProjectId: projectId ?? null, weeks: response.data };
  }, [projectId]);

  const state = useAsyncData(loader, { forProjectId: null, weeks: [] as Week[] });

  // While a request for a *different* project is in flight, useAsyncData still holds the
  // previous project's weeks. Suppress that stale list so consumers only ever see weeks that
  // belong to the currently selected project — week ids are shared across projects, so a stale
  // list would otherwise keep an older week selected after switching back to a project.
  const isCurrent = state.data.forProjectId === (projectId ?? null);
  const data = useMemo(() => (isCurrent ? state.data.weeks : []), [isCurrent, state.data.weeks]);
  const activeWeeks = data;

  return {
    ...state,
    data,
    activeWeeks
  };
}
