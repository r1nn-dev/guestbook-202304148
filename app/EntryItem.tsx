"use client";

import { useState } from "react";
import { MessageInput, isMessageTooLong } from "./MessageInput";
import { PasswordInput } from "./PasswordInput";
import { useApiSubmit } from "./useApiSubmit";

type Props = {
  id: string;
  name: string;
  message: string;
  createdAtText: string;
  edited: boolean;
};

type Mode = "view" | "edit" | "delete";

// 수정·삭제 패널마다 다른 부분을 한곳에 모은다.
const PANELS = {
  edit: {
    method: "PATCH",
    submitLabel: "저장",
    submitClass: "bg-brand hover:bg-brand-strong",
    showsDraft: true,
    hint: "작성자 이름은 수정할 수 없고, 메시지만 수정할 수 있습니다.",
  },
  delete: {
    method: "DELETE",
    submitLabel: "삭제",
    submitClass: "bg-red-600 hover:bg-red-700",
    showsDraft: false,
    // 강제 삭제는 같은 삭제 폼에서 관리자 비밀번호로 한다 (docs/adr/0003).
    hint: "관리자 비밀번호도 사용할 수 있습니다.",
  },
} as const;

export function EntryItem({ id, name, message, createdAtText, edited }: Props) {
  const [mode, setMode] = useState<Mode>("view");
  const [draft, setDraft] = useState(message);
  const [password, setPassword] = useState("");
  const { pending, error, setError, submit } = useApiSubmit();
  const panel = mode === "view" ? null : PANELS[mode];
  const submitDisabled = pending || (panel?.showsDraft === true && isMessageTooLong(draft));

  function switchMode(next: Mode) {
    setMode(next);
    setDraft(message);
    setPassword("");
    setError(null);
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!panel) return;
    const body = panel.showsDraft ? { message: draft, password } : { password };
    submit({ url: `/api/entries/${id}`, method: panel.method, body }, () => {
      setMode("view");
      setPassword("");
    });
  }

  return (
    <li className="px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900">{name}</p>
          <p className="mt-0.5 text-sm text-gray-500">{createdAtText}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {edited && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" aria-hidden="true" />
              수정됨
            </span>
          )}
          {panel === null && (
            <div className="flex text-sm text-gray-500">
              <button
                type="button"
                onClick={() => switchMode("edit")}
                className="rounded-lg px-2 py-1 hover:bg-gray-100 hover:text-gray-900"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => switchMode("delete")}
                className="rounded-lg px-2 py-1 hover:bg-red-50 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {!panel?.showsDraft && (
        <p className="mt-3 whitespace-pre-wrap wrap-break-word leading-relaxed text-gray-800">{message}</p>
      )}

      {panel !== null && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">{panel.hint}</p>
          {panel.showsDraft && (
            <MessageInput value={draft} onChange={setDraft} submitDisabled={submitDisabled} />
          )}
          <div className="flex flex-wrap gap-2">
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="비밀번호"
              autoComplete="current-password"
              className="min-w-48 flex-1"
            />
            <button
              type="submit"
              disabled={submitDisabled}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${panel.submitClass}`}
            >
              {panel.submitLabel}
            </button>
            {/* 처리 중에 패널을 닫으면 돌아온 오류 안내가 보이지 않으므로 취소도 막는다. */}
            <button
              type="button"
              onClick={() => switchMode("view")}
              disabled={pending}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40"
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
