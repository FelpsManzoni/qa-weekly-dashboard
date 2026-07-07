import { listRows, upsertRow, updateRow } from './client';
import type { ApiItemResponse, ApiListResponse, ReleaseVersion } from '../types';

export function fetchReleases(weekId: string, projectId: string): Promise<ApiListResponse<ReleaseVersion>> {
  return listRows<ReleaseVersion>('release_versions', (builder) =>
    builder.eq('week_id', weekId).eq('project_id', projectId).order('date', { ascending: false })
  );
}

export function saveRelease(payload: Partial<ReleaseVersion>): Promise<ApiItemResponse<ReleaseVersion>> {
  if (payload.id) {
    return updateRow<ReleaseVersion>('release_versions', payload.id, payload);
  }

  return upsertRow<ReleaseVersion>('release_versions', payload as ReleaseVersion);
}
