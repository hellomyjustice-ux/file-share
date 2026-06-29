'use client';
import { ChevronRight, Home } from 'lucide-react';
import { FolderRecord } from '@/types';

interface Props {
  path: FolderRecord[];
  onNavigate: (folderId: string | null) => void;
}

export default function Breadcrumb({ path, onNavigate }: Props) {
  if (path.length === 0) return null;
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4 flex-wrap">
      <button onClick={() => onNavigate(null)} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
        <Home className="w-4 h-4" />
        <span>홈</span>
      </button>
      {path.map((folder, i) => (
        <span key={folder.id} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          {i === path.length - 1 ? (
            <span className="text-gray-900 font-medium">{folder.name}</span>
          ) : (
            <button onClick={() => onNavigate(folder.id)} className="hover:text-blue-600 transition-colors">
              {folder.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
