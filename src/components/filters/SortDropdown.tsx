'use client';
import { SortOption } from '@/types';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',    label: '최신 업로드순' },
  { value: 'oldest',    label: '오래된 업로드순' },
  { value: 'name',      label: '파일명순' },
  { value: 'size',      label: '파일 크기순' },
  { value: 'downloads', label: '다운로드 많은 순' },
];

interface Props {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as SortOption)}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    >
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
