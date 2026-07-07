import { listRows, upsertRow, updateRow } from './client';
import type { ApiItemResponse, ApiListResponse, PriorityNote } from '../types';

export function fetchNotes(weekId: string, projectId: string): Promise<ApiListResponse<PriorityNote>> {
  return listRows<PriorityNote>('notes', (builder) =>
    builder.eq('week_id', weekId).eq('project_id', projectId).order('priority', { ascending: true })
  );
}

export function saveNote(payload: Partial<PriorityNote>): Promise<ApiItemResponse<PriorityNote>> {
  if (payload.id) {
    return updateRow<PriorityNote>('notes', payload.id, payload);
  }

  return upsertRow<PriorityNote>('notes', payload as PriorityNote);
}
