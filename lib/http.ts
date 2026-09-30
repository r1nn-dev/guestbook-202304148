export function errorResponse(status: 400 | 403 | 404, error: string): Response {
  return Response.json({ error }, { status });
}

// JSON이 아닌 본문은 undefined로 돌려 검증 단계에서 400이 되게 한다.
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
