import { useMemo } from 'react';
import { fetchProjects } from '../api/projects';
import { useAsyncData } from './useAsyncData';
import type { Project } from '../types';

export function useProjects() {
  const state = useAsyncData(async () => {
    const response = await fetchProjects();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  }, [] as Project[]);

  const activeProjects = useMemo(() => state.data.filter((project) => project.is_active), [state.data]);

  return {
    ...state,
    activeProjects
  };
}
