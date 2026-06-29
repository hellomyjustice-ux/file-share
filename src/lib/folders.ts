import { supabase } from './supabase';
import { FolderRecord } from '@/types';

export async function fetchFolders(parentId: string | null): Promise<FolderRecord[]> {
  const q = parentId === null
    ? supabase.from('folders').select('*').is('parent_id', null)
    : supabase.from('folders').select('*').eq('parent_id', parentId);
  const { data, error } = await q.order('name', { ascending: true });
  if (error) throw error;
  return data as FolderRecord[];
}

export async function createFolder(name: string, parentId: string | null): Promise<FolderRecord> {
  const { data, error } = await supabase.from('folders')
    .insert({ name: name.trim(), parent_id: parentId })
    .select().single();
  if (error) throw error;
  return data as FolderRecord;
}

export async function renameFolder(id: string, name: string): Promise<void> {
  const { error } = await supabase.from('folders').update({ name: name.trim() }).eq('id', id);
  if (error) throw error;
}

export async function deleteFolder(id: string): Promise<void> {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw error;
}

export async function getFolderPath(folderId: string): Promise<FolderRecord[]> {
  const path: FolderRecord[] = [];
  let currentId: string | null = folderId;
  while (currentId) {
    const result = await supabase.from('folders').select('*').eq('id', currentId).single();
    if (result.error || !result.data) break;
    const folder = result.data as FolderRecord;
    path.unshift(folder);
    currentId = folder.parent_id;
  }
  return path;
}
