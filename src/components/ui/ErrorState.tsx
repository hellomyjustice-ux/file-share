import { WifiOff } from 'lucide-react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = '데이터를 불러오지 못했습니다', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{message}</h3>
      <p className="text-sm text-gray-400 mb-6">네트워크 연결을 확인하고 다시 시도해 주세요</p>
      {onRetry && (
        <button onClick={onRetry} className="px-5 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors">
          다시 시도
        </button>
      )}
    </div>
  );
}
