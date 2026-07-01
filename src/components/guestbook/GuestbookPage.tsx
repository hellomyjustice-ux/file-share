'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, RefreshCw } from 'lucide-react';
import { GuestbookEntry as Entry, fetchEntries } from '@/lib/guestbook';
import GuestbookForm from './GuestbookForm';
import GuestbookEntryCard from './GuestbookEntry';

/**
 * GuestbookPage 컴포넌트
 *
 * Props:
 * @param {function} onBack - 뒤로가기 핸들러 [Required]
 */
interface Props {
  onBack: () => void;
}

export default function GuestbookPage({ onBack }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEntries();
      setEntries(data);
    } catch {
      setError('방명록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdded = (entry: Entry) => setEntries(prev => [entry, ...prev]);

  const handleUpdated = (id: string, name: string, message: string) => {
    setEntries(prev =>
      prev.map(e => e.id === id ? { ...e, name, message, updated_at: new Date().toISOString() } : e)
    );
  };

  const handleDeleted = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 h-14 sm:h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">돌아가기</span>
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-gray-900">방명록</span>
            </div>

            <div className="flex-1" />

            <button
              onClick={load}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 sm:px-6 py-6">
        <GuestbookForm onAdded={handleAdded} />

        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1.5" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-3" />
                  <div className="h-2.5 bg-gray-100 rounded w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={load}
                className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">
                아직 방명록이 없습니다.<br />첫 번째로 남겨보세요!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-400">{entries.length}개의 방명록</p>
              {entries.map(entry => (
                <GuestbookEntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
