'use client';
import { Moon, FolderOpen, Upload, Share2 } from 'lucide-react';

/**
 * WelcomeScreen 컴포넌트
 *
 * Props:
 * @param {function} onEnter - 파일 보관함 입장 버튼 클릭 핸들러 [Required]
 */
interface Props {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 배경 장식 원 */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* 아이콘 */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300" />
        </div>
      </div>

      {/* 타이틀 */}
      <h1 className="text-center font-extrabold tracking-tight leading-tight mb-4">
        <span className="block text-4xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
          Moon's File
        </span>
        <span className="block text-3xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent mt-1">
          Share
        </span>
      </h1>

      {/* 서브타이틀 */}
      <p className="text-blue-300/70 text-sm sm:text-base lg:text-lg text-center max-w-md mb-12 leading-relaxed">
        파일을 안전하게 보관하고<br className="sm:hidden" /> 손쉽게 공유하세요
      </p>

      {/* 기능 요약 */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 text-blue-200/50 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5" />
          <span>파일 업로드</span>
        </div>
        <span className="hidden sm:block text-blue-700">•</span>
        <div className="flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>폴더 관리</span>
        </div>
        <span className="hidden sm:block text-blue-700">•</span>
        <div className="flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" />
          <span>간편 공유</span>
        </div>
      </div>

      {/* 입장 버튼 */}
      <button
        onClick={onEnter}
        className="group relative px-8 sm:px-12 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base sm:text-lg rounded-2xl transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-blue-700/50 hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">
          파일 보관함 열기
          <span className="text-blue-200 group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
        </span>
      </button>
    </div>
  );
}
