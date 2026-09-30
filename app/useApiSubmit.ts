"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendJson } from "@/lib/api-client";

type Request = { url: string; method: "POST" | "PATCH" | "DELETE"; body: unknown };

// 폼 제출 공통 흐름: 처리 중 표시 → API 호출 → 실패하면 안내, 성공하면 onSuccess 후 목록 다시 받기
export function useApiSubmit() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit({ url, method, body }: Request, onSuccess: () => void) {
    setPending(true);
    setError(null);
    const result = await sendJson(url, method, body);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess();
    router.refresh();
  }

  return { pending, error, setError, submit };
}
