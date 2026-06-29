import { FileCategory } from '@/types';

const CATEGORY_MAP: Record<string, FileCategory> = {
  pdf: 'document', doc: 'document', docx: 'document', txt: 'document',
  xls: 'document', xlsx: 'document', ppt: 'document', pptx: 'document', csv: 'document',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp4: 'video', mov: 'video', avi: 'video', mkv: 'video', webm: 'video',
  mp3: 'audio', wav: 'audio', m4a: 'audio', aac: 'audio', flac: 'audio',
  zip: 'archive', rar: 'archive', tar: 'archive', gz: 'archive', '7z': 'archive',
};

export function getCategory(extension: string): FileCategory {
  return CATEGORY_MAP[extension.toLowerCase()] ?? 'other';
}

export function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9가-힣._\-\s]/g, '_').trim();
}

export function generateStorageName(originalName: string): string {
  const ext = getExtension(originalName);
  const uuid = crypto.randomUUID();
  return ext ? `${uuid}.${ext}` : uuid;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function isPreviewable(mime: string): boolean {
  return (
    mime.startsWith('image/') ||
    mime.startsWith('video/') ||
    mime.startsWith('audio/') ||
    mime === 'application/pdf' ||
    mime.startsWith('text/')
  );
}

export function getCategoryLabel(category: FileCategory): string {
  const labels: Record<FileCategory, string> = {
    all: '전체 보기', document: '문서', image: '이미지',
    video: '동영상', audio: '오디오', archive: '압축파일', other: '기타',
  };
  return labels[category];
}
