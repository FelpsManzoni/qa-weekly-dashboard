import { useCallback } from 'react';
import { fetchUsers } from '../api/users';
import { useAsyncData } from './useAsyncData';
import type { AuthUser } from '../types';

export function useUsers() {
  const loader = useCallback(async () => {
    const response = await fetchUsers();
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data;
  }, []);

  return useAsyncData(loader, [] as AuthUser[]);
}
