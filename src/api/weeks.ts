import { listRows, upsertRow, updateRow } from './client';
import type { Week, ApiItemResponse, ApiListResponse } from '../types';

export function fetchWeeks(): Promise<ApiListResponse<Week>> {
  return listRows<Week>('weeks', (builder) => builder.order('week_number', { ascending: false }));
}

export function saveWeek(payload: Partial<Week>): Promise<ApiItemResponse<Week>> {
  if (payload.id) {
    return updateRow<Week>('weeks', payload.id, payload);
  }

  return upsertRow<Week>('weeks', payload as Week);
}
