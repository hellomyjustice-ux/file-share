'use client';
import { useEffect, useState } from 'react';
import { X, Download, Trash2, Calendar, HardDrive, Tag, Download as DownloadIcon } from 'lucide-react';
import { FileRecord } from '@/types';
import { formatBytes, formatDate, isPreviewable } from '@/utils/fileUtils';
import { getPublicUrl } from '@/lib/files';
import FileIcon from './FileIcon';

interface Props {
  file: FileRecord | null;
  onClose: () => void;
  onDownload: (file: FileRecord) => void;
  onDelete: (file: FileRecord) => void;
}

export default function FileDetailModal({ file, onClose, onDownload, onDelete }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    if (isPreviewable(file.mime_type)) {
      getPublicUrl(file.storage_path).then(setPreviewUrl).catch(() => setPreviewUrl(null));
    }
  }, [file]);

  if (!file) return null;

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try { await onDownload(file); } finally { setDownloading(false); }
  };

  const renderPreview = () => {
    if (!previewUrl) return null;
    if (file.mime_type.startsWith('image/')) {
      return <img src={previewUrl} alt={file.original_name} className="max-w-full max-h-80 object-contain rounded-lg mx-auto" />;
    }
    if (file.mime_type.startsWith('video/')) {
      return <video src={previewUrl} controls className="w-full rounded-lg max-h-72" />;
    }
    if (file.mime_type.startsWith('audio/')) {
      return <audio src={previewUrl} controls className="w-full" />;
    }
    if (file.mime_type === 'application/pdf') {
      return <iframe src={previewUrl} className="w-full h-80 rounded-lg border border-gray-200" />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 truncate pr-4">{file.original_name}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {/* Preview */}
          {isPreviewable(file.mime_type) ? (
            <div className="mb-5 bg-gray-50 rounded-xl p-4 flex items-center justify-center min-h-32">
              {previewUrl ? renderPreview() : <div className="animate-pulse w-full h-32 bg-gray-200 rounded-lg" />}
            </div>
          ) : (
            <div className="mb-5 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center">
              <FileIcon category={file.category} size="lg" />
              <p className="mt-2 text-sm text-gray-400">미리보기를 지원하지 않는 파일입니다</p>
            </div>
          )}

          {/* Meta */}
          <div className="space-y-3">
            {[
              { Icon: Tag, label: '파일 형식', value: `${file.extension.toUpperCase()} · ${file.mime_type}` },
              { Icon: HardDrive, label: '파일 크기', value: formatBytes(file.size) },
              { Icon: Calendar, label: '업로드 날짜', value: formatDate(file.created_at) },
              { Icon: DownloadIcon, label: '다운로드 수', value: `${file.download_count}회` },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-500 w-24 flex-shrink-0">{label}</span>
                <span className="text-sm text-gray-800 truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => { onDelete(file); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> 삭제
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? '다운로드 중...' : '다운로드'}
          </button>
        </div>
      </div>
    </div>
  );
}
