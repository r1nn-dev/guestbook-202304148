"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/validation";
import { MessageInput, isMessageTooLong } from "./MessageInput";
import { PasswordInput } from "./PasswordInput";
import { useApiSubmit } from "./useApiSubmit";

export function EntryForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const { pending, error, submit } = useApiSubmit();
  const submitDisabled = pending || isMessageTooLong(message);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({ url: "/api/entries", method: "POST", body: { name, message, password } }, () => {
      setName("");
      setMessage("");
      setPassword("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight">글 남기기</h2>
        <p className="mt-1 text-sm text-gray-500">글 비밀번호를 기억해 두면 나중에 수정하거나 삭제할 수 있어요.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`작성자 이름 (${LIMITS.name.max}자 이내)`}
          maxLength={LIMITS.name.max}
          required
          className="field flex-1"
        />
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={`비밀번호 (${LIMITS.password.min}~${LIMITS.password.max}자)`}
          autoComplete="new-password"
          className="flex-1"
        />
      </div>
      <MessageInput
        value={message}
        onChange={setMessage}
        submitDisabled={submitDisabled}
        placeholder={`메시지 (${LIMITS.message.max}자 이내, Ctrl+Enter로 등록)`}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-red-600">{error}</p>
        <button type="submit" disabled={submitDisabled} className="btn-primary shrink-0 px-5 py-2.5">
          {pending ? "등록 중…" : "등록"}
        </button>
      </div>
    </form>
  );
}
