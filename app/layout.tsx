import type { Metadata } from "next";
import { Suspense } from "react";
import { DEVELOPER } from "@/lib/developer";
import { EntryCount } from "./EntryCount";
import "./globals.css";

export const metadata: Metadata = {
  title: "미니 방명록",
  description: "누구나 글을 남길 수 있는 미니 방명록",
};

const developerText = `${DEVELOPER.name} · ${DEVELOPER.studentId}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-2xl items-baseline justify-between px-4 py-4">
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-bold">미니 방명록</h1>
              {/* 개수를 세는 동안 헤더를 막지 않도록 자리만 비워 둔다. */}
              <Suspense fallback={null}>
                <EntryCount />
              </Suspense>
            </div>
            <span className="text-sm text-gray-600">{developerText}</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <p className="mx-auto max-w-2xl px-4 py-4 text-center text-sm text-gray-600">
            개발자: {developerText}
          </p>
        </footer>
      </body>
    </html>
  );
}
