import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ApiError, ApiItemResponse, ApiListResponse } from '../types';

type Database = any;

let supabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing.');
  }

  supabaseClient = createClient<Database>(url, anonKey);

  return supabaseClient;
}

export function mapError(error: unknown, code = 'UNKNOWN_ERROR'): ApiError {
  if (error instanceof Error) {
    return { message: error.message, code };
  }

  return { message: 'Unexpected error', code };
}

export async function listRows<T>(table: string, query?: (builder: any) => any): Promise<ApiListResponse<T>> {
  try {
    let builder = getSupabaseClient().from(table).select('*');

    if (query) {
      builder = query(builder);
    }

    const { data, error } = await builder;

    if (error) {
      return { data: [], error: mapError(error, error.code) };
    }

    return { data: (data ?? []) as T[], error: null };
  } catch (error) {
    return { data: [], error: mapError(error) };
  }
}

export async function getRow<T>(table: string, id: string): Promise<ApiItemResponse<T>> {
  try {
    const { data, error } = await getSupabaseClient().from(table).select('*').eq('id', id).single();

    if (error) {
      return { data: null, error: mapError(error, error.code) };
    }

    return { data: data as T, error: null };
  } catch (error) {
    return { data: null, error: mapError(error) };
  }
}

export async function upsertRow<T extends Record<string, unknown>>(
  table: string,
  payload: T,
  onConflict?: string
): Promise<ApiItemResponse<T>> {
  try {
    const cleanPayload = { ...payload } as Record<string, unknown>;

    if ('id' in cleanPayload && !cleanPayload.id) {
      delete cleanPayload.id;
    }

    const query = getSupabaseClient()
      .from(table)
      .upsert(cleanPayload, onConflict ? { onConflict } : undefined)
      .select()
      .single();
    const { data, error } = await query;

    if (error) {
      return { data: null, error: mapError(error, error.code) };
    }

    return { data: data as T, error: null };
  } catch (error) {
    return { data: null, error: mapError(error) };
  }
}

export async function updateRow<T extends Record<string, unknown>>(
  table: string,
  id: string,
  payload: Partial<T>
): Promise<ApiItemResponse<T>> {
  try {
    const { data, error } = await getSupabaseClient().from(table).update(payload as any).eq('id', id).select().single();

    if (error) {
      return { data: null, error: mapError(error, error.code) };
    }

    return { data: data as T, error: null };
  } catch (error) {
    return { data: null, error: mapError(error) };
  }
}

export async function deleteRow(table: string, id: string): Promise<ApiItemResponse<null>> {
  try {
    const { error } = await getSupabaseClient().from(table).delete().eq('id', id);

    if (error) {
      return { data: null, error: mapError(error, error.code) };
    }

    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: mapError(error) };
  }
}
