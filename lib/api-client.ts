// 브라우저에서 API를 호출하고, 실패하면 서버가 보낸 안내 문구를 돌려준다.
export async function sendJson(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true };
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "요청을 처리하지 못했습니다." };
  } catch {
    return { ok: false, error: "서버에 연결하지 못했습니다." };
  }
}
