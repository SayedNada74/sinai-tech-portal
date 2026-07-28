import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions for live sync
export async function fetchFromSupabase<T>(table: string): Promise<T[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.warn(`Supabase fetch error for ${table}:`, error.message);
      return null;
    }
    return data as T[];
  } catch (e) {
    console.warn(`Supabase error for ${table}:`, e);
    return null;
  }
}

export async function insertToSupabase<T>(table: string, payload: Record<string, any>): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(table).insert([payload]).select().single();
    if (error) {
      console.warn(`Supabase insert error for ${table}:`, error.message);
      return null;
    }
    return data as T;
  } catch (e) {
    console.warn(`Supabase insert catch error for ${table}:`, e);
    return null;
  }
}

export async function updateInSupabase(table: string, id: string, payload: Record<string, any>) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from(table).update(payload).eq("id", id).select();
    if (error) {
      console.warn(`Supabase update error for ${table}:`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn(`Supabase update error for ${table}:`, e);
    return null;
  }
}

export async function deleteFromSupabase(table: string, id: string) {
  if (!supabase) return null;
  try {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      console.warn(`Supabase delete error for ${table}:`, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`Supabase delete error for ${table}:`, e);
    return false;
  }
}
