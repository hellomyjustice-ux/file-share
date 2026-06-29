'use client';
import { LayoutGrid, List } from 'lucide-react';
import { ViewMode } from '@/types';

interface Props {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

export default function ViewModeToggle({ value, onChange }: Props) {
  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
      {(['grid', 'list'] as ViewMode[]).map(mode => {
        const Icon = mode === 'grid' ? LayoutGrid : List;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            title={mode === 'grid' ? '카드 보기' : '목록 보기'}
            className={`p-2 transition-colors ${
              value === mode ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
