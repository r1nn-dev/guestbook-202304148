import type { Metadata } from "next";
import { Suspense } from "react";
import { DEVELOPER } from "@/lib/developer";
import { EntryCount } from "./EntryCount";
import { Logo } from "./Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: "미니 방명록",
  description: "누구나 글을 남길 수 있는 미니 방명록",
};

const SERVICE_NAME = "미니 방명록";
const REPO = "github.com/r1nn-dev/guestbook-202304148";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-page text-gray-900">
        <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Logo />
              <h1 className="text-lg font-bold tracking-tight">{SERVICE_NAME}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {/* 개수를 세는 동안 헤더를 막지 않도록 자리만 비워 둔다. */}
              <Suspense fallback={null}>
                <EntryCount />
              </Suspense>
              <span className="hidden px-2 text-gray-500 sm:inline">
                {DEVELOPER.name} · {DEVELOPER.studentId}
              </span>
            </div>
          </div>
          {/* 좁은 화면에서도 개발자 정보가 상단에 보이도록 한 줄 더 둔다. */}
          <p className="px-4 pb-2 text-xs text-gray-500 sm:hidden">
            {DEVELOPER.name} · {DEVELOPER.studentId}
          </p>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">{children}</main>

        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-3xl space-y-3 px-4 py-8 text-sm sm:px-6">
            <nav className="text-gray-700">
              <a href={`https://${REPO}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                GitHub 저장소
              </a>
            </nav>
            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
              <div className="flex gap-1">
                <dt>서비스명 :</dt>
                <dd>{SERVICE_NAME}</dd>
              </div>
              <div className="flex gap-1">
                <dt>제작 :</dt>
                <dd>{DEVELOPER.name}</dd>
              </div>
              <div className="flex gap-1">
                <dt>학번 :</dt>
                <dd>{DEVELOPER.studentId}</dd>
              </div>
              <div className="flex gap-1">
                <dt>GitHub :</dt>
                <dd>{REPO}</dd>
              </div>
            </dl>
            <p className="flex items-center gap-2 text-xs text-gray-400">
              <Logo size="sm" />© 2026 {SERVICE_NAME}. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
