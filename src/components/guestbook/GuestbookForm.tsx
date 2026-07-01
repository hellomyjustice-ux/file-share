'use client';
import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { addEntry, GuestbookEntry } from '@/lib/guestbook';

/**
 * GuestbookForm 컴포넌트
 *
 * Props:
 * @param {function} onAdded - 방명록 등록 완료 핸들러 [Required]
 */
interface Props {
  onAdded: (entry: GuestbookEntry) => void;
}

export default function GuestbookForm({ onAdded }: Props) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !password) {
      setError('이름, 메시지, 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const entry = await addEntry(name.trim(), message.trim(), password);
      onAdded(entry);
      setName('');
      setMessage('');
      setPassword('');
      setPasswordConfirm('');
    } catch {
      setError('작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <PenLine className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-gray-900 text-sm">방명록 작성</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="이름"
            maxLength={20}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={passwordConfirm}
            onChange={e => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          rows={3}
          maxLength={500}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{message.length}/500</span>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
