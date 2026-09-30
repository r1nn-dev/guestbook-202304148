"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendJson } from "@/lib/api-client";
import { LIMITS } from "@/lib/validation";

type Props = {
  id: string;
  name: string;
  message: string;
  createdAtText: string;
  edited: boolean;
};

type Mode = "view" | "edit" | "delete";

export function EntryItem({ id, name, message, createdAtText, edited }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState(message);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function open(next: Mode) {
    setMode(next);
    setDraft(message);
    setPassword("");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result =
      mode === "edit"
        ? await sendJson(`/api/entries/${id}`, "PATCH", { message: draft, password })
        : await sendJson(`/api/entries/${id}`, "DELETE", { password });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMode("view");
    setPassword("");
    router.refresh();
  }

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-gray-500">
          {createdAtText}
          {edited && " (수정됨)"}
        </span>
      </div>

      {mode !== "edit" && <p className="mt-2 whitespace-pre-wrap break-words">{message}</p>}

      {mode === "view" ? (
        <div className="mt-3 flex gap-3 text-sm text-gray-600">
          <button type="button" onClick={() => open("edit")} className="hover:underline">
            수정
          </button>
          <button type="button" onClick={() => open("delete")} className="hover:underline">
            삭제
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
          {mode === "edit" && (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={LIMITS.message.max}
              required
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          )}
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              minLength={LIMITS.password.min}
              maxLength={LIMITS.password.max}
              required
              autoComplete="current-password"
              className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm"
            />
            <button
              type="submit"
              disabled={pending}
              className={`rounded px-3 py-1.5 text-sm text-white disabled:opacity-50 ${
                mode === "delete" ? "bg-red-600" : "bg-gray-900"
              }`}
            >
              {mode === "edit" ? "저장" : "삭제"}
            </button>
            <button
              type="button"
              onClick={() => open("view")}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm"
            >
              취소
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </li>
  );
}
