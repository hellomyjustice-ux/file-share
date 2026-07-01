'use client';
import { useState } from 'react';
import { Lock, X } from 'lucide-react';

/**
 * PasswordModal 컴포넌트
 *
 * Props:
 * @param {string} title - 모달 제목 [Required]
 * @param {function} onConfirm - 비밀번호 확인 핸들러, 성공 시 true 반환 [Required]
 * @param {function} onClose - 모달 닫기 핸들러 [Required]
 */
interface Props {
  title: string;
  onConfirm: (password: string) => Promise<boolean>;
  onClose: () => void;
}

export default function PasswordModal({ title, onConfirm, onClose }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    const ok = await onConfirm(password);
    setLoading(false);
    if (!ok) {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              작성 시 설정한 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    </div>
  );
}
