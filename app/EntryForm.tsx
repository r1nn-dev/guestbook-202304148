"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/validation";
import { useApiSubmit } from "./useApiSubmit";

export function EntryForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const { pending, error, submit } = useApiSubmit();

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    submit({ url: "/api/entries", method: "POST", body: { name, message, password } }, () => {
      setName("");
      setMessage("");
      setPassword("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold">글 남기기</h2>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`작성자 이름 (${LIMITS.name.max}자 이내)`}
          maxLength={LIMITS.name.max}
          required
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`비밀번호 (${LIMITS.password.min}~${LIMITS.password.max}자)`}
          minLength={LIMITS.password.min}
          maxLength={LIMITS.password.max}
          required
          autoComplete="new-password"
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`메시지 (${LIMITS.message.max}자 이내)`}
        maxLength={LIMITS.message.max}
        required
        rows={3}
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "등록 중…" : "등록"}
      </button>
    </form>
  );
}
