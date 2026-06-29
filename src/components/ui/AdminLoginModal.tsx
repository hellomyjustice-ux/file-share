'use client';
import { useState } from 'react';
import { Lock, X } from 'lucide-react';

/**
 * AdminLoginModal 컴포넌트
 *
 * Props:
 * @param {function} onSuccess - 로그인 성공 핸들러 [Required]
 * @param {function} onClose - 모달 닫기 핸들러 [Required]
 */
interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminLoginModal({ onSuccess, onClose }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (adminPw && password === adminPw) {
      onSuccess();
    } else {
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
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">관리자 로그인</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="관리자 비밀번호를 입력하세요"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
