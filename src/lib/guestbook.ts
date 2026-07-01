import { supabase } from './supabase';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  password_hash: string;
  created_at: string;
  updated_at: string | null;
}

const TABLE = 'guestbook';

async function hashPassword(password: string): Promise<string> {
  const buffer = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function fetchEntries(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addEntry(name: string, message: string, password: string): Promise<GuestbookEntry> {
  const password_hash = await hashPassword(password);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, message, password_hash })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function verifyPassword(entryId: string, password: string): Promise<boolean> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('password_hash')
    .eq('id', entryId)
    .single();
  if (error || !data) return false;
  const hash = await hashPassword(password);
  return hash === data.password_hash;
}

export async function updateEntry(id: string, name: string, message: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({ name, message, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
