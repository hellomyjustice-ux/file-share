import { supabase, BUCKET_NAME } from './supabase';
import { FileRecord, FilesFilter, SortOption } from '@/types';
import { generateStorageName, getCategory, getExtension, sanitizeFilename } from '@/utils/fileUtils';

const PAGE_SIZE = 24;

function buildQuery(filter: FilesFilter) {
  let q = supabase.from('files').select('*', { count: 'exact' });

  if (filter.folderId !== undefined) {
    q = filter.folderId === null
      ? q.is('folder_id', null)
      : q.eq('folder_id', filter.folderId);
  }

  if (filter.category !== 'all') q = q.eq('category', filter.category);

  if (filter.search.trim()) {
    q = q.ilike('original_name', `%${filter.search.trim()}%`);
  }

  const sortMap: Record<SortOption, { column: string; ascending: boolean }> = {
    newest:    { column: 'created_at',     ascending: false },
    oldest:    { column: 'created_at',     ascending: true  },
    name:      { column: 'original_name',  ascending: true  },
    size:      { column: 'size',           ascending: false },
    downloads: { column: 'download_count', ascending: false },
  };
  const { column, ascending } = sortMap[filter.sort];
  return q.order(column, { ascending });
}

export async function fetchFiles(filter: FilesFilter, page = 0) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error, count } = await buildQuery(filter).range(from, to);
  if (error) throw error;
  return { data: data as FileRecord[], count: count ?? 0, hasMore: (count ?? 0) > to + 1 };
}

export async function uploadFile(
  file: File,
  folderId: string | null,
  onProgress?: (p: number) => void,
): Promise<FileRecord> {
  const ext = getExtension(file.name);
  const storageName = generateStorageName(file.name);
  const storagePath = folderId ? `${folderId}/${storageName}` : storageName;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;
  onProgress?.(80);

  const { data, error: dbError } = await supabase.from('files').insert({
    original_name: sanitizeFilename(file.name) || file.name,
    storage_name:  storageName,
    storage_path:  storagePath,
    extension:     ext,
    mime_type:     file.type || 'application/octet-stream',
    category:      getCategory(ext),
    size:          file.size,
    folder_id:     folderId,
  }).select().single();

  if (dbError) {
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
    throw dbError;
  }
  onProgress?.(100);
  return data as FileRecord;
}

export async function downloadFile(file: FileRecord): Promise<void> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(file.storage_path, 60);
  if (error) throw error;

  const response = await fetch(data.signedUrl);
  if (!response.ok) throw new Error('Download failed');
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = file.original_name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);

  await supabase.from('files')
    .update({ download_count: file.download_count + 1 })
    .eq('id', file.id);
}

export async function getPublicUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(storagePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFile(file: FileRecord): Promise<void> {
  await supabase.storage.from(BUCKET_NAME).remove([file.storage_path]);
  const { error } = await supabase.from('files').delete().eq('id', file.id);
  if (error) throw error;
}

export async function renameFile(id: string, newName: string): Promise<void> {
  const { error } = await supabase.from('files')
    .update({ original_name: sanitizeFilename(newName) || newName })
    .eq('id', id);
  if (error) throw error;
}

export async function moveFile(id: string, folderId: string | null): Promise<void> {
  const { error } = await supabase.from('files').update({ folder_id: folderId }).eq('id', id);
  if (error) throw error;
}

export async function deleteFiles(files: FileRecord[]): Promise<void> {
  const paths = files.map(f => f.storage_path);
  await supabase.storage.from(BUCKET_NAME).remove(paths);
  const ids = files.map(f => f.id);
  const { error } = await supabase.from('files').delete().in('id', ids);
  if (error) throw error;
}
