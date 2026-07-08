import { useCallback, useEffect, useRef, useState } from 'react';
import type { AsyncState } from '../types';

export function useAsyncData<T>(loader: () => Promise<T>, initialData: T, enabled = true) {
  // Capture the initial value once. Callers commonly pass a fresh literal (e.g. `[]`)
  // every render; keeping it out of the `refresh` deps prevents an infinite
  // refresh → setState → re-render loop.
  const initialRef = useRef(initialData);

  const [state, setState] = useState<AsyncState<T>>({
    data: initialRef.current,
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
        data: initialRef.current,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unexpected error'
      });
    }
  }, [loader]);

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
