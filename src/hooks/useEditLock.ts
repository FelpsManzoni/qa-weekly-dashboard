import { useCallback, useEffect, useRef, useState } from 'react';
import { acquireLock, extendLock, releaseLock } from '../api/locks';
import { copy } from '../utils/copy';
import { usePreferences } from './usePreferences';
import type { EditLock } from '../types';

// Heartbeat cadence: extend the lock well before the 15-minute server expiry so an
// actively-editing user is never silently overridden (improvements #2).
const HEARTBEAT_MS = 5 * 60 * 1000;
const ACTIVITY_THROTTLE_MS = 30 * 1000;

export function useEditLock(resourceType: string, resourceId: string | null, enabled = true) {
  const { t } = usePreferences();
  const [lock, setLock] = useState<EditLock | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lockRef = useRef<EditLock | null>(null);
  const lastBeatRef = useRef(0);

  const setActiveLock = (value: EditLock | null) => {
    lockRef.current = value;
    setLock(value);
  };

  const release = useCallback(async () => {
    const current = lockRef.current;
    if (current?.id) {
      await releaseLock(current.id);
      setActiveLock(null);
    }
  }, []);

  const acquire = useCallback(async () => {
    if (!resourceId || !enabled) {
      return;
    }

    const response = await acquireLock(resourceType, resourceId);

    if (response.error) {
      setError(`${t(copy.lockActive)}`);
      return;
    }

    setActiveLock(response.data);
    setError(null);
  }, [enabled, resourceId, resourceType]);

  const beat = useCallback(async () => {
    const current = lockRef.current;
    if (current?.id) {
      lastBeatRef.current = Date.now();
      const response = await extendLock(current.id);
      if (!response.error && response.data) {
        setActiveLock(response.data);
      }
    }
  }, []);

  useEffect(() => {
    void acquire();

    return () => {
      void release();
    };
  }, [acquire, release]);

  // Periodic heartbeat plus a throttled heartbeat on user activity.
  useEffect(() => {
    if (!enabled || !resourceId) {
      return;
    }

    const interval = setInterval(() => void beat(), HEARTBEAT_MS);

    const onActivity = () => {
      if (Date.now() - lastBeatRef.current > ACTIVITY_THROTTLE_MS) {
        void beat();
      }
    };

    window.addEventListener('keydown', onActivity);
    window.addEventListener('mousemove', onActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('mousemove', onActivity);
    };
  }, [beat, enabled, resourceId]);

  return {
    lock,
    error,
    acquire,
    release
  };
}
