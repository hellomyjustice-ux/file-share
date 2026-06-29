'use client';
import { FileRecord, FolderRecord } from '@/types';
import FileRow from './FileRow';
import FolderCard from './FolderCard';

interface Props {
  files: FileRecord[];
  folders: FolderRecord[];
  selected: Set<string>;
  onSelectFile: (id: string) => void;
  onSelectAll: () => void;
  onClickFile: (file: FileRecord) => void;
  onDownload: (file: FileRecord) => void;
  onDeleteFile: (file: FileRecord) => void;
  onRenameFile: (file: FileRecord) => void;
  onClickFolder: (folder: FolderRecord) => void;
  onRenameFolder: (folder: FolderRecord) => void;
  onDeleteFolder: (folder: FolderRecord) => void;
}

export default function FileList({ files, folders, selected, onSelectFile, onSelectAll, onClickFile, onDownload, onDeleteFile, onRenameFile, onClickFolder, onRenameFolder, onDeleteFolder }: Props) {
  const allSelected = files.length > 0 && files.every(f => selected.has(f.id));

  return (
    <div>
      {folders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {folders.map(folder => (
            <FolderCard key={folder.id} folder={folder} onClick={onClickFolder} onRename={onRenameFolder} onDelete={onDeleteFolder} />
          ))}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-8">
                <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">파일명</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">형식</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">크기</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">업로드 날짜</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">다운로드</th>
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {files.map(file => (
              <FileRow
                key={file.id}
                file={file}
                selected={selected.has(file.id)}
                onSelect={onSelectFile}
                onClick={onClickFile}
                onDownload={onDownload}
                onDelete={onDeleteFile}
                onRename={onRenameFile}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
