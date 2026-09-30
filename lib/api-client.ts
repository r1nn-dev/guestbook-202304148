import { ERRORS, type Result } from "./validation";

// 브라우저에서 API를 호출하고, 실패하면 서버가 보낸 안내 문구를 돌려준다.
export async function sendJson(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body: unknown,
): Promise<Result<null>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true, value: null };
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? ERRORS.unknown };
  } catch {
    return { ok: false, error: ERRORS.network };
  }
}
