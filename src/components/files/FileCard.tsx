'use client';
import { useState } from 'react';
import { Download, Trash2, MoreVertical, Pencil } from 'lucide-react';
import { FileRecord } from '@/types';
import { formatBytes, formatDate } from '@/utils/fileUtils';
import FileIcon from './FileIcon';

interface Props {
  file: FileRecord;
  selected: boolean;
  onSelect: (id: string) => void;
  onClick: (file: FileRecord) => void;
  onDownload: (file: FileRecord) => void;
  onDelete: (file: FileRecord) => void;
  onRename: (file: FileRecord) => void;
  imageUrl?: string;
}

export default function FileCard({ file, selected, onSelect, onClick, onDownload, onDelete, onRename, imageUrl }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try { await onDownload(file); } finally { setDownloading(false); }
  };

  return (
    <div
      onClick={() => onClick(file)}
      className={`group relative bg-white rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Checkbox */}
      <div
        className="absolute top-2 left-2 z-10"
        onClick={e => { e.stopPropagation(); onSelect(file.id); }}
      >
        <input
          type="checkbox"
          checked={selected}
          readOnly
          className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
        />
      </div>

      {/* Preview / Icon */}
      <div className="aspect-[4/3] rounded-t-xl overflow-hidden bg-gray-50 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={file.original_name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <FileIcon category={file.category} size="lg" />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate" title={file.original_name}>
          {file.original_name}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{formatBytes(file.size)}</span>
          <span className="text-xs text-gray-400">{formatDate(file.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div
        className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          title="다운로드"
          className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            title="더보기"
            className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-20">
              <button
                onClick={() => { setMenuOpen(false); onRename(file); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil className="w-3.5 h-3.5" /> 이름 변경
              </button>
              <button
                onClick={() => { setMenuOpen(false); onDelete(file); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
