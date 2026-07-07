import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from '../types';

export function useAsyncData<T>(loader: () => Promise<T>, initialData: T, enabled = true) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: enabled,
    error: null
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await loader();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: initialData,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unexpected error'
      });
    }
  }, [initialData, loader]);

  useEffect(() => {
    if (enabled) {
      void refresh();
    }
  }, [enabled, refresh]);

  return {
    ...state,
    refresh
  };
}
