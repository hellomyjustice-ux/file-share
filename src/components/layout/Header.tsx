'use client';
import { Upload, Share2, ShieldCheck, Lock, LogOut } from 'lucide-react';
import SearchBar from '@/components/filters/SearchBar';

/**
 * Header 컴포넌트
 *
 * Props:
 * @param {string} search - 검색어 [Required]
 * @param {function} onSearchChange - 검색어 변경 핸들러 [Required]
 * @param {function} onUploadClick - 업로드 버튼 클릭 핸들러 [Required]
 * @param {function} onReset - 로고 클릭 시 초기화면으로 이동 핸들러 [Required]
 * @param {boolean} isAdmin - 관리자 로그인 여부 [Optional, 기본값: false]
 * @param {function} onAdminLogin - 관리자 로그인 모달 열기 핸들러 [Optional]
 * @param {function} onAdminLogout - 관리자 로그아웃 핸들러 [Optional]
 */
interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  onUploadClick: () => void;
  onReset: () => void;
  isAdmin?: boolean;
  onAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export default function Header({ search, onSearchChange, onUploadClick, onReset, isAdmin = false, onAdminLogin, onAdminLogout }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 h-14 sm:h-16">
          {/* Logo */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-75 transition-opacity"
            aria-label="홈으로 이동"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base sm:text-lg hidden sm:block whitespace-nowrap">
              Moon's File
            </span>
          </button>

          {/* Search */}
          <div className="flex-1 min-w-0">
            <SearchBar value={search} onChange={onSearchChange} />
          </div>

          {/* Admin area */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">관리자</span>
              </div>
              <button
                onClick={onAdminLogout}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="관리자 로그아웃"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAdminLogin}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
              title="관리자 로그인"
              aria-label="관리자 로그인"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:block">관리자</span>
            </button>
          )}

          {/* Upload */}
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:block">업로드</span>
          </button>
        </div>
      </div>
    </header>
  );
}
