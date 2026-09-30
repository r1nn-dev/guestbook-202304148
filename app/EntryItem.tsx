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
    submitClass: "bg-gray-900",
    showsDraft: true,
    hint: "작성자 이름은 수정할 수 없고, 메시지만 수정할 수 있습니다.",
  },
  delete: {
    method: "DELETE",
    submitLabel: "삭제",
    submitClass: "bg-red-600",
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
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{name}</span>
        <span className="text-xs text-gray-500">
          {createdAtText}
          {edited && " (수정됨)"}
        </span>
      </div>

      {!panel?.showsDraft && <p className="mt-2 whitespace-pre-wrap wrap-break-word">{message}</p>}

      {panel === null ? (
        <div className="mt-3 flex gap-3 text-sm text-gray-600">
          <button type="button" onClick={() => switchMode("edit")} className="hover:underline">
            수정
          </button>
          <button type="button" onClick={() => switchMode("delete")} className="hover:underline">
            삭제
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
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
              className="flex-1 text-sm"
            />
            <button
              type="submit"
              disabled={submitDisabled}
              className={`rounded px-3 py-1.5 text-sm text-white disabled:opacity-50 ${panel.submitClass}`}
            >
              {panel.submitLabel}
            </button>
            {/* 처리 중에 패널을 닫으면 돌아온 오류 안내가 보이지 않으므로 취소도 막는다. */}
            <button
              type="button"
              onClick={() => switchMode("view")}
              disabled={pending}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
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
