'use client';
import { useState } from 'react';
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { FolderRecord } from '@/types';
import { formatDate } from '@/utils/fileUtils';

interface Props {
  folder: FolderRecord;
  onClick: (folder: FolderRecord) => void;
  onRename: (folder: FolderRecord) => void;
  onDelete: (folder: FolderRecord) => void;
}

export default function FolderCard({ folder, onClick, onRename, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={() => onClick(folder)}
      className="group relative bg-white rounded-xl border-2 border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all cursor-pointer p-4"
    >
      <div className="flex items-center gap-3">
        <Folder className="w-8 h-8 text-yellow-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{folder.name}</p>
          <p className="text-xs text-gray-400">{formatDate(folder.created_at)}</p>
        </div>
      </div>

      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-20">
              <button onClick={() => { setMenuOpen(false); onRename(folder); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                <Pencil className="w-3.5 h-3.5" /> 이름 변경
              </button>
              <button onClick={() => { setMenuOpen(false); onDelete(folder); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
