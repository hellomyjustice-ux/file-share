'use client';
import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { GuestbookEntry as Entry, verifyPassword, updateEntry, deleteEntry } from '@/lib/guestbook';
import PasswordModal from './PasswordModal';

/**
 * GuestbookEntry 컴포넌트
 *
 * Props:
 * @param {Entry} entry - 방명록 항목 데이터 [Required]
 * @param {function} onUpdated - 수정 완료 핸들러 [Required]
 * @param {function} onDeleted - 삭제 완료 핸들러 [Required]
 */
interface Props {
  entry: Entry;
  onUpdated: (id: string, name: string, message: string) => void;
  onDeleted: (id: string) => void;
}

type Mode = 'view' | 'edit' | 'pw-edit' | 'pw-delete';

export default function GuestbookEntry({ entry, onUpdated, onDeleted }: Props) {
  const [mode, setMode] = useState<Mode>('view');
  const [editName, setEditName] = useState(entry.name);
  const [editMessage, setEditMessage] = useState(entry.message);
  const [saving, setSaving] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!editName.trim() || !editMessage.trim()) return;
    setSaving(true);
    try {
      await updateEntry(entry.id, editName.trim(), editMessage.trim());
      onUpdated(entry.id, editName.trim(), editMessage.trim());
      setMode('view');
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordConfirm = async (password: string): Promise<boolean> => {
    const ok = await verifyPassword(entry.id, password);
    if (ok) {
      if (mode === 'pw-edit') {
        setEditName(entry.name);
        setEditMessage(entry.message);
        setMode('edit');
      } else {
        await deleteEntry(entry.id);
        onDeleted(entry.id);
      }
    }
    return ok;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
        {mode === 'edit' ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              maxLength={20}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editMessage}
              onChange={e => setEditMessage(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setMode('view')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" /> 취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" /> {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-gray-900">{entry.name}</span>
                  {entry.updated_at && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">수정됨</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                  {entry.message}
                </p>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  onClick={() => setMode('pw-edit')}
                  className="p-1.5 text-gray-300 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50"
                  title="수정"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setMode('pw-delete')}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{formatDate(entry.created_at)}</p>
          </>
        )}
      </div>

      {(mode === 'pw-edit' || mode === 'pw-delete') && (
        <PasswordModal
          title={mode === 'pw-edit' ? '수정 비밀번호 확인' : '삭제 비밀번호 확인'}
          onConfirm={handlePasswordConfirm}
          onClose={() => setMode('view')}
        />
      )}
    </>
  );
}
