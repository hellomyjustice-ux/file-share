export type FileCategory = 'all' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
export type SortOption = 'newest' | 'oldest' | 'name' | 'size' | 'downloads';
export type ViewMode = 'grid' | 'list';

export interface FileRecord {
  id: string;
  original_name: string;
  storage_name: string;
  storage_path: string;
  extension: string;
  mime_type: string;
  category: FileCategory;
  size: number;
  folder_id: string | null;
  download_count: number;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FolderRecord {
  id: string;
  name: string;
  parent_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface FilesFilter {
  category: FileCategory;
  search: string;
  sort: SortOption;
  folderId: string | null;
}
