import { apiPost, apiPut, apiDelete } from './client';
import type { ApiItemResponse, EditLock } from '../types';

// Lock ownership is derived from the authenticated user on the server, so the client
// only needs to identify the resource. A 409 (code LOCKED) means another editor holds it.
export async function acquireLock(resourceType: string, resourceId: string): Promise<ApiItemResponse<EditLock>> {
  const { data, error } = await apiPost<EditLock>('/locks', {
    resource_type: resourceType,
    resource_id: resourceId
  });
  return { data, error };
}

/** Heartbeat — extends the lock's expiry while the user is active. */
export async function extendLock(lockId: string): Promise<ApiItemResponse<EditLock>> {
  const { data, error } = await apiPut<EditLock>(`/locks/${lockId}`, {});
  return { data, error };
}

export async function releaseLock(lockId: string): Promise<ApiItemResponse<null>> {
  const { error } = await apiDelete(`/locks/${lockId}`);
  return { data: null, error };
}
