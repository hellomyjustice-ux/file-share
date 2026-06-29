'use client';
import { useState } from 'react';
import { Download, Trash2, Pencil, MoreVertical } from 'lucide-react';
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
}

export default function FileRow({ file, selected, onSelect, onClick, onDownload, onDelete, onRename }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try { await onDownload(file); } finally { setDownloading(false); }
  };

  return (
    <tr
      onClick={() => onClick(file)}
      className={`group cursor-pointer transition-colors hover:bg-gray-50 ${selected ? 'bg-blue-50' : ''}`}
    >
      <td className="px-4 py-3 w-8" onClick={e => { e.stopPropagation(); onSelect(file.id); }}>
        <input type="checkbox" checked={selected} readOnly className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileIcon category={file.category} size="sm" />
          <span className="text-sm font-medium text-gray-800 truncate max-w-xs" title={file.original_name}>
            {file.original_name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
        <span className="uppercase">{file.extension || '-'}</span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{formatBytes(file.size)}</td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{formatDate(file.created_at)}</td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">{file.download_count}</td>
      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleDownload}
            disabled={downloading}
            title="다운로드"
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-20">
                <button onClick={() => { setMenuOpen(false); onRename(file); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Pencil className="w-3.5 h-3.5" /> 이름 변경
                </button>
                <button onClick={() => { setMenuOpen(false); onDelete(file); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> 삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
