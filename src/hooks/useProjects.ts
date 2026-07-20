import { useCallback, useMemo } from 'react';
import { fetchProjects } from '../api/projects';
import { useAsyncData } from './useAsyncData';
import type { Project } from '../types';

export function useProjects() {
  // Memoize the loader so useAsyncData's refresh identity stays stable across renders.
  const loader = useCallback(async () => {
    const response = await fetchProjects();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, []);

  const state = useAsyncData(loader, [] as Project[]);

  const activeProjects = useMemo(() => state.data.filter((project) => project.is_active), [state.data]);

  return {
    ...state,
    activeProjects
  };
}
