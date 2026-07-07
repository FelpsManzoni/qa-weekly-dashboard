import { useCallback, useEffect, useRef, useState } from 'react';
import { acquireLock, releaseLock } from '../api/locks';
import { copy } from '../utils/copy';
import type { EditLock } from '../types';

export function useEditLock(resourceType: string, resourceId: string | null, enabled = true) {
  const [lock, setLock] = useState<EditLock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ownerIdRef = useRef(`editor-${Math.random().toString(36).slice(2, 10)}`);

  const release = useCallback(async () => {
    if (lock?.id) {
      await releaseLock(lock.id);
      setLock(null);
    }
  }, [lock]);

  const acquire = useCallback(async () => {
    if (!resourceId || !enabled) {
      return;
    }

    const response = await acquireLock(resourceType, resourceId, ownerIdRef.current);

    if (response.error) {
      setError(`${copy.lockActive.en} / ${copy.lockActive.pt}`);
      return;
    }

    setLock(response.data);
    setError(null);
  }, [enabled, resourceId, resourceType]);

  useEffect(() => {
    void acquire();

    return () => {
      void release();
    };
  }, [acquire, release]);

  return {
    lock,
    error,
    acquire,
    release
  };
}
