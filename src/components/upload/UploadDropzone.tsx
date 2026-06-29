'use client';
import { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export default function UploadDropzone({ onFiles, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];
    items.forEach(item => {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    });
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
      } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
    >
      <input ref={fileRef} type="file" multiple hidden onChange={e => onFiles(Array.from(e.target.files ?? []))} />
      <input ref={folderRef} type="file" hidden {...({ webkitdirectory: 'true' } as object)} onChange={e => onFiles(Array.from(e.target.files ?? []))} />

      <CloudUpload className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-gray-400'}`} />
      <p className="text-sm font-medium text-gray-700 mb-1">파일을 드래그하거나 선택하세요</p>
      <p className="text-xs text-gray-400 mb-4">모든 파일 형식 지원 · 파일당 최대 50MB</p>
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          파일 선택
        </button>
        <button
          type="button"
          onClick={() => folderRef.current?.click()}
          className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          폴더 선택
        </button>
      </div>
    </div>
  );
}
