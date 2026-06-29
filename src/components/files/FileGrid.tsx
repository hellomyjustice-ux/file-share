'use client';
import { FileRecord, FolderRecord } from '@/types';
import FileCard from './FileCard';
import FolderCard from './FolderCard';

interface Props {
  files: FileRecord[];
  folders: FolderRecord[];
  selected: Set<string>;
  imageUrls: Record<string, string>;
  onSelectFile: (id: string) => void;
  onClickFile: (file: FileRecord) => void;
  onDownload: (file: FileRecord) => void;
  onDeleteFile: (file: FileRecord) => void;
  onRenameFile: (file: FileRecord) => void;
  onClickFolder: (folder: FolderRecord) => void;
  onRenameFolder: (folder: FolderRecord) => void;
  onDeleteFolder: (folder: FolderRecord) => void;
}

export default function FileGrid({ files, folders, selected, imageUrls, onSelectFile, onClickFile, onDownload, onDeleteFile, onRenameFile, onClickFolder, onRenameFolder, onDeleteFolder }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {folders.map(folder => (
        <FolderCard key={folder.id} folder={folder} onClick={onClickFolder} onRename={onRenameFolder} onDelete={onDeleteFolder} />
      ))}
      {files.map(file => (
        <FileCard
          key={file.id}
          file={file}
          selected={selected.has(file.id)}
          imageUrl={imageUrls[file.id]}
          onSelect={onSelectFile}
          onClick={onClickFile}
          onDownload={onDownload}
          onDelete={onDeleteFile}
          onRename={onRenameFile}
        />
      ))}
    </div>
  );
}
