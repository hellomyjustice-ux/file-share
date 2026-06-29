import { Upload, FolderOpen } from 'lucide-react';

interface Props {
  isSearch?: boolean;
  onUpload?: () => void;
}

export default function EmptyState({ isSearch, onUpload }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {isSearch ? <FolderOpen className="w-8 h-8 text-gray-400" /> : <Upload className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">
        {isSearch ? '검색 결과가 없습니다' : '업로드된 파일이 없습니다'}
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        {isSearch ? '다른 검색어나 필터를 시도해 보세요' : '파일을 업로드해서 공유를 시작하세요'}
      </p>
      {!isSearch && onUpload && (
        <button
          onClick={onUpload}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          파일 업로드
        </button>
      )}
    </div>
  );
}
