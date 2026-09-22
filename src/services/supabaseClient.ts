import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client using Vite environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/** Generic helper to fetch all rows from a given table */
export const fetchAll = async <T = any>(table: string): Promise<T[]> => {
  const { data, error } = await supabase.from<T>(table).select('*');
  if (error) {
    console.error(`Supabase fetchAll error for ${table}:`, error);
    return [];
  }
  return data;
};

/** Insert a new row into a table */
export const insertRow = async <T = any>(table: string, payload: Partial<T>): Promise<boolean> => {
  const { error } = await supabase.from<T>(table).insert(payload as any);
  if (error) {
    console.error(`Supabase insertRow error for ${table}:`, error);
    return false;
  }
  return true;
};

/** Update an existing row by primary key (assumes column named 'id') */
export const updateRow = async <T = any>(table: string, id: string | number, changes: Partial<T>): Promise<boolean> => {
  const { error } = await supabase.from<T>(table).update(changes as any).eq('id', id);
  if (error) {
    console.error(`Supabase updateRow error for ${table} id=${id}:`, error);
    return false;
  }
  return true;
};

/** Delete a row by primary key */
export const deleteRow = async (table: string, id: string | number): Promise<boolean> => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`Supabase deleteRow error for ${table} id=${id}:`, error);
    return false;
  }
  return true;
};

/** Specific helpers for a "charts" table used by the UI */
export const getCharts = async () => fetchAll('charts');
export const addChart = async (payload: { title: string; type: string; data: any }) => insertRow('charts', payload);
export const updateChart = async (id: string, updates: Partial<{ title: string; type: string; data: any }>) => updateRow('charts', id, updates);
export const deleteChart = async (id: string) => deleteRow('charts', id);
