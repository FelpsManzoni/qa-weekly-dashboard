import { deleteRow, listRows, upsertRow } from './client';
import { futureTimestamp, isLockExpired } from '../utils/dates';
import type { ApiItemResponse, ApiListResponse, EditLock } from '../types';

export async function fetchLock(resourceType: string, resourceId: string): Promise<ApiListResponse<EditLock>> {
  const response = await listRows<EditLock>('edit_locks', (builder) =>
    builder.eq('resource_type', resourceType).eq('resource_id', resourceId)
  );

  if (response.data.length && isLockExpired(response.data[0].expires_at)) {
    await releaseLock(response.data[0].id);
    return { data: [], error: null };
  }

  return response;
}

export async function acquireLock(resourceType: string, resourceId: string, ownerId: string): Promise<ApiItemResponse<EditLock>> {
  const existing = await fetchLock(resourceType, resourceId);

  if (existing.data[0] && existing.data[0].owner_id !== ownerId) {
    return {
      data: null,
      error: { message: 'Record locked by another editor.', code: 'LOCKED' }
    };
  }

  return upsertRow<EditLock>(
    'edit_locks',
    {
      resource_type: resourceType,
      resource_id: resourceId,
      owner_id: ownerId,
      expires_at: futureTimestamp(15)
    } as EditLock,
    'resource_type,resource_id'
  );
}

export function releaseLock(lockId: string): Promise<ApiItemResponse<null>> {
  return deleteRow('edit_locks', lockId);
}
