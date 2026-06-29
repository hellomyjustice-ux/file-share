'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Trash2, FolderPlus, Download } from 'lucide-react';
import { FileRecord, FolderRecord, FileCategory, SortOption, ViewMode, FilesFilter } from '@/types';
import { fetchFiles, downloadFile, deleteFile, deleteFiles, renameFile } from '@/lib/files';
import { fetchFolders, createFolder, renameFolder, deleteFolder, getFolderPath } from '@/lib/folders';
import { getPublicUrl } from '@/lib/files';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/layout/Breadcrumb';
import WelcomeScreen from '@/components/ui/WelcomeScreen';
import AdminLoginModal from '@/components/ui/AdminLoginModal';
import CategoryTabs from '@/components/filters/CategoryTabs';
import SortDropdown from '@/components/filters/SortDropdown';
import ViewModeToggle from '@/components/filters/ViewModeToggle';
import FileGrid from '@/components/files/FileGrid';
import FileList from '@/components/files/FileList';
import FileDetailModal from '@/components/files/FileDetailModal';
import UploadModal from '@/components/upload/UploadModal';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export default function HomePage() {
  const [isWelcome, setIsWelcome]       = useState(true);
  const [isAdmin, setIsAdmin]           = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const pendingActionRef                = useRef<(() => void) | null>(null);
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory]         = useState<FileCategory>('all');
  const [sort, setSort]                 = useState<SortOption>('newest');
  const [viewMode, setViewMode]         = useState<ViewMode>('grid');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath]     = useState<FolderRecord[]>([]);
  const [files, setFiles]               = useState<FileRecord[]>([]);
  const [folders, setFolders]           = useState<FolderRecord[]>([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(0);
  const [hasMore, setHasMore]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [imageUrls, setImageUrls]       = useState<Record<string, string>>({});
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [detailFile, setDetailFile]     = useState<FileRecord | null>(null);
  const [uploadOpen, setUploadOpen]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'file' | 'files' | 'folder'; payload: FileRecord | FolderRecord | FileRecord[] } | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ type: 'file' | 'folder'; item: FileRecord | FolderRecord; currentName: string } | null>(null);
  const [renameName, setRenameName]     = useState('');
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('adminSession') === '1');
  }, []);

  const requireAdmin = useCallback((action: () => void) => {
    if (isAdmin) {
      action();
    } else {
      pendingActionRef.current = action;
      setShowAdminModal(true);
    }
  }, [isAdmin]);

  const handleAdminSuccess = useCallback(() => {
    setIsAdmin(true);
    sessionStorage.setItem('adminSession', '1');
    setShowAdminModal(false);
    if (pendingActionRef.current) {
      pendingActionRef.current();
      pendingActionRef.current = null;
    }
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem('adminSession');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filter: FilesFilter = useMemo(() => ({
    category, search: debouncedSearch, sort, folderId: currentFolderId,
  }), [category, debouncedSearch, sort, currentFolderId]);

  const loadFiles = useCallback(async (reset = true) => {
    try {
      if (reset) { setLoading(true); setError(null); } else setLoadingMore(true);
      const nextPage = reset ? 0 : page + 1;
      const [fileResult, folderData] = await Promise.all([
        fetchFiles(filter, nextPage),
        reset ? fetchFolders(currentFolderId) : Promise.resolve(null),
      ]);
      if (reset) {
        setFiles(fileResult.data);
        if (folderData) setFolders(folderData);
        setPage(0);
      } else {
        setFiles(prev => [...prev, ...fileResult.data]);
        setPage(nextPage);
      }
      setTotal(fileResult.count);
      setHasMore(fileResult.hasMore);
    } catch {
      setError('파일 목록을 불러오지 못했습니다');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter, currentFolderId, page]);

  useEffect(() => { loadFiles(true); }, [filter]);

  useEffect(() => {
    if (!currentFolderId) { setFolderPath([]); return; }
    getFolderPath(currentFolderId).then(setFolderPath).catch(() => setFolderPath([]));
  }, [currentFolderId]);

  useEffect(() => {
    files.filter(f => f.category === 'image' && !imageUrls[f.id]).forEach(f => {
      getPublicUrl(f.storage_path)
        .then(url => setImageUrls(prev => ({ ...prev, [f.id]: url })))
        .catch(() => {});
    });
  }, [files]);

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelected(new Set());
    setSearch('');
    setCategory('all');
  };

  const handleReset = useCallback(() => {
    setIsWelcome(true);
    setCurrentFolderId(null);
    setSelected(new Set());
    setSearch('');
    setCategory('all');
    setSort('newest');
    setPage(0);
  }, []);

  const toggleSelect = (id: string) => setSelected(prev => {
    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
  });
  const toggleSelectAll = () => setSelected(prev =>
    prev.size === files.length ? new Set() : new Set(files.map(f => f.id))
  );

  const handleDownload = async (file: FileRecord) => {
    try {
      await downloadFile(file);
      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, download_count: f.download_count + 1 } : f));
      addToast('success', `${file.original_name} 다운로드 완료`);
    } catch { addToast('error', '다운로드에 실패했습니다'); }
  };
  const handleBulkDownload = async () => {
    for (const f of files.filter(f => selected.has(f.id))) await handleDownload(f);
  };
  const handleDeleteFile = async (file: FileRecord) => {
    try {
      await deleteFile(file);
      setFiles(prev => prev.filter(f => f.id !== file.id));
      setTotal(prev => prev - 1);
      addToast('success', `${file.original_name} 삭제 완료`);
    } catch { addToast('error', '삭제에 실패했습니다'); }
  };
  const handleDeleteFiles = async (targets: FileRecord[]) => {
    try {
      await deleteFiles(targets);
      const ids = new Set(targets.map(f => f.id));
      setFiles(prev => prev.filter(f => !ids.has(f.id)));
      setTotal(prev => prev - targets.length);
      setSelected(new Set());
      addToast('success', `${targets.length}개 파일 삭제 완료`);
    } catch { addToast('error', '삭제에 실패했습니다'); }
  };
  const handleDeleteFolder = async (folder: FolderRecord) => {
    try {
      await deleteFolder(folder.id);
      setFolders(prev => prev.filter(f => f.id !== folder.id));
      addToast('success', `${folder.name} 폴더 삭제 완료`);
    } catch { addToast('error', '폴더 삭제에 실패했습니다'); }
  };
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await createFolder(newFolderName, currentFolderId);
      setFolders(prev => [...prev, folder]);
      setNewFolderName(''); setNewFolderOpen(false);
      addToast('success', `${folder.name} 폴더 생성 완료`);
    } catch { addToast('error', '폴더 생성에 실패했습니다'); }
  };
  const handleRename = async () => {
    if (!renameTarget || !renameName.trim()) return;
    try {
      if (renameTarget.type === 'file') {
        await renameFile(renameTarget.item.id, renameName);
        setFiles(prev => prev.map(f => f.id === renameTarget.item.id ? { ...f, original_name: renameName } : f));
      } else {
        await renameFolder(renameTarget.item.id, renameName);
        setFolders(prev => prev.map(f => f.id === renameTarget.item.id ? { ...f, name: renameName } : f));
      }
      addToast('success', '이름이 변경되었습니다');
    } catch { addToast('error', '이름 변경에 실패했습니다'); }
    setRenameTarget(null);
  };

  const selectedFiles = files.filter(f => selected.has(f.id));
  const isEmpty = !loading && !error && files.length === 0 && folders.length === 0;
  const isSearchActive = debouncedSearch.trim() !== '' || category !== 'all';

  if (isWelcome) {
    return <WelcomeScreen onEnter={() => setIsWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        search={search}
        onSearchChange={setSearch}
        onUploadClick={() => requireAdmin(() => setUploadOpen(true))}
        onReset={handleReset}
        isAdmin={isAdmin}
        onAdminLogin={() => setShowAdminModal(true)}
        onAdminLogout={handleAdminLogout}
      />

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumb path={folderPath} onNavigate={navigateToFolder} />

        {/* 모바일 카테고리 (가로) */}
        <div className="md:hidden mb-4">
          <CategoryTabs active={category} onChange={c => { setCategory(c); setPage(0); }} />
        </div>

        <div className="flex gap-6">
          {/* 왼쪽 카테고리 사이드바 (데스크톱) */}
          <aside className="hidden md:block w-40 flex-shrink-0 pt-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">카테고리</p>
            <CategoryTabs isVertical active={category} onChange={c => { setCategory(c); setPage(0); }} />
          </aside>

          {/* 오른쪽 콘텐츠 */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="text-sm text-gray-500">
                {loading ? '로딩 중...' : `${total.toLocaleString()}개 파일`}
              </div>
              <div className="flex-1" />
              <button onClick={() => requireAdmin(() => setNewFolderOpen(true))} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FolderPlus className="w-4 h-4" /> 새 폴더
              </button>
              <SortDropdown value={sort} onChange={setSort} />
              <ViewModeToggle value={viewMode} onChange={setViewMode} />
            </div>

            {selected.size > 0 && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-sm font-medium text-blue-700">{selected.size}개 선택됨</span>
                <div className="flex-1" />
                <button onClick={handleBulkDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4" /> 다운로드
                </button>
                <button onClick={() => requireAdmin(() => setConfirmDelete({ type: 'files', payload: selectedFiles }))} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" /> 삭제
                </button>
                <button onClick={() => setSelected(new Set())} className="text-sm text-gray-400 hover:text-gray-600">취소</button>
              </div>
            )}

        {loading ? (
          <LoadingSkeleton viewMode={viewMode} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => loadFiles(true)} />
        ) : isEmpty ? (
          <EmptyState isSearch={isSearchActive} onUpload={() => setUploadOpen(true)} />
        ) : viewMode === 'grid' ? (
          <FileGrid
            files={files} folders={folders} selected={selected} imageUrls={imageUrls}
            onSelectFile={toggleSelect} onClickFile={setDetailFile} onDownload={handleDownload}
            onDeleteFile={f => requireAdmin(() => setConfirmDelete({ type: 'file', payload: f }))}
            onRenameFile={f => requireAdmin(() => { setRenameTarget({ type: 'file', item: f, currentName: f.original_name }); setRenameName(f.original_name); })}
            onClickFolder={f => navigateToFolder(f.id)}
            onRenameFolder={f => requireAdmin(() => { setRenameTarget({ type: 'folder', item: f, currentName: f.name }); setRenameName(f.name); })}
            onDeleteFolder={f => requireAdmin(() => setConfirmDelete({ type: 'folder', payload: f }))}
          />
        ) : (
          <FileList
            files={files} folders={folders} selected={selected}
            onSelectFile={toggleSelect} onSelectAll={toggleSelectAll}
            onClickFile={setDetailFile} onDownload={handleDownload}
            onDeleteFile={f => requireAdmin(() => setConfirmDelete({ type: 'file', payload: f }))}
            onRenameFile={f => requireAdmin(() => { setRenameTarget({ type: 'file', item: f, currentName: f.original_name }); setRenameName(f.original_name); })}
            onClickFolder={f => navigateToFolder(f.id)}
            onRenameFolder={f => requireAdmin(() => { setRenameTarget({ type: 'folder', item: f, currentName: f.name }); setRenameName(f.name); })}
            onDeleteFolder={f => requireAdmin(() => setConfirmDelete({ type: 'folder', payload: f }))}
          />
        )}

        {hasMore && !loading && (
          <div className="mt-8 text-center">
            <button onClick={() => loadFiles(false)} disabled={loadingMore} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              {loadingMore ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
          </div>
        </div>
      </main>

      {showAdminModal && (
        <AdminLoginModal onSuccess={handleAdminSuccess} onClose={() => { setShowAdminModal(false); pendingActionRef.current = null; }} />
      )}

      {uploadOpen && (
        <UploadModal folderId={currentFolderId} onClose={() => setUploadOpen(false)} onDone={() => loadFiles(true)} onToast={addToast} />
      )}

      <FileDetailModal
        file={detailFile} onClose={() => setDetailFile(null)}
        onDownload={handleDownload}
        onDelete={f => requireAdmin(() => { setDetailFile(null); setConfirmDelete({ type: 'file', payload: f }); })}
      />

      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRenameTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">{renameTarget.type === 'file' ? '파일명 변경' : '폴더명 변경'}</h3>
            <input
              type="text" value={renameName} onChange={e => setRenameName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameTarget(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">취소</button>
              <button onClick={handleRename} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">변경</button>
            </div>
          </div>
        </div>
      )}

      {newFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setNewFolderOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-4">새 폴더 만들기</h3>
            <input
              type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
              placeholder="폴더 이름" autoFocus
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setNewFolderOpen(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">취소</button>
              <button onClick={handleCreateFolder} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">만들기</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="삭제 확인"
        message={
          confirmDelete?.type === 'files'
            ? `선택한 ${(confirmDelete.payload as FileRecord[]).length}개 파일을 삭제할까요? 복구할 수 없습니다.`
            : confirmDelete?.type === 'folder'
            ? `"${(confirmDelete.payload as FolderRecord).name}" 폴더를 삭제할까요?`
            : `"${(confirmDelete?.payload as FileRecord)?.original_name}" 파일을 삭제할까요?`
        }
        onConfirm={async () => {
          if (!confirmDelete) return;
          if (confirmDelete.type === 'file') await handleDeleteFile(confirmDelete.payload as FileRecord);
          else if (confirmDelete.type === 'files') await handleDeleteFiles(confirmDelete.payload as FileRecord[]);
          else await handleDeleteFolder(confirmDelete.payload as FolderRecord);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
