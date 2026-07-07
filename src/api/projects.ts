import { listRows, upsertRow, updateRow } from './client';
import type { Project, ApiItemResponse, ApiListResponse } from '../types';

export function fetchProjects(): Promise<ApiListResponse<Project>> {
  return listRows<Project>('projects', (builder) => builder.order('display_order', { ascending: true }));
}

export function saveProject(payload: Partial<Project>): Promise<ApiItemResponse<Project>> {
  if (payload.id) {
    return updateRow<Project>('projects', payload.id, payload);
  }

  return upsertRow<Project>('projects', payload as Project);
}
