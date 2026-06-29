'use client';
import { useState, useCallback } from 'react';
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { UploadFile } from '@/types';
import { formatBytes } from '@/utils/fileUtils';
import { uploadFile } from '@/lib/files';
import UploadDropzone from './UploadDropzone';

interface Props {
  folderId: string | null;
  onClose: () => void;
  onDone: () => void;
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export default function UploadModal({ folderId, onClose, onDone, onToast }: Props) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const newItems: UploadFile[] = files.map(f => ({
      file: f,
      id: crypto.randomUUID(),
      progress: 0,
      status: 'pending',
    }));
    setUploadFiles(prev => [...prev, ...newItems]);
  }, []);

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const startUpload = async () => {
    if (!uploadFiles.length || uploading) return;
    setUploading(true);
    let successCount = 0;

    for (const item of uploadFiles) {
      if (item.status === 'done') continue;
      setUploadFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading', progress: 10 } : f));
      try {
        await uploadFile(item.file, folderId, (p) => {
          setUploadFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: p } : f));
        });
        setUploadFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', progress: 100 } : f));
        successCount++;
      } catch (err) {
        setUploadFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', error: '업로드 실패' } : f));
      }
    }

    setUploading(false);
    if (successCount > 0) {
      onToast('success', `${successCount}개 파일 업로드 완료`);
      onDone();
      onClose();
    } else {
      onToast('error', '업로드에 실패했습니다');
    }
  };

  const totalSize = uploadFiles.reduce((sum, f) => sum + f.file.size, 0);
  const pendingCount = uploadFiles.filter(f => f.status !== 'done').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">파일 업로드</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <UploadDropzone onFiles={addFiles} disabled={uploading} />

          {uploadFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{uploadFiles.length}개 파일 · {formatBytes(totalSize)}</p>
                {!uploading && (
                  <button onClick={() => setUploadFiles([])} className="text-xs text-gray-400 hover:text-gray-600">모두 제거</button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadFiles.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.file.name}</p>
                      <p className="text-xs text-gray-400">{formatBytes(item.file.size)}</p>
                      {item.status === 'uploading' && (
                        <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all" style={{ width: `${item.progress}%` }} />
                        </div>
                      )}
                    </div>
                    {item.status === 'pending' && !uploading && (
                      <button onClick={() => removeFile(item.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0"><X className="w-4 h-4" /></button>
                    )}
                    {item.status === 'uploading' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />}
                    {item.status === 'done' && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    {item.status === 'error' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 flex gap-3 justify-end">
          <button onClick={onClose} disabled={uploading} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">
            취소
          </button>
          <button
            onClick={startUpload}
            disabled={!pendingCount || uploading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? '업로드 중...' : `${pendingCount}개 업로드`}
          </button>
        </div>
      </div>
    </div>
  );
}
