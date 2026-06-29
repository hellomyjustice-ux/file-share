import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Moon's File — 파일 공유 아카이브",
  description: '파일과 폴더를 업로드하고 공유하세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-slate-50">{children}</body>
    </html>
  );
}
