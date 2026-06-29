'use client';
import { FileCategory } from '@/types';
import { getCategoryLabel } from '@/utils/fileUtils';

const CATEGORIES: FileCategory[] = ['all', 'document', 'image', 'video', 'audio', 'archive', 'other'];

/**
 * CategoryTabs 컴포넌트
 *
 * Props:
 * @param {FileCategory} active - 현재 선택된 카테고리 [Required]
 * @param {function} onChange - 카테고리 변경 핸들러 [Required]
 * @param {boolean} isVertical - 세로 배치 여부 [Optional, 기본값: false]
 */
interface Props {
  active: FileCategory;
  onChange: (c: FileCategory) => void;
  isVertical?: boolean;
}

export default function CategoryTabs({ active, onChange, isVertical = false }: Props) {
  if (isVertical) {
    return (
      <nav className="flex flex-col gap-0.5">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              active === cat
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
            active === cat
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {getCategoryLabel(cat)}
        </button>
      ))}
    </div>
  );
}
