import { ERRORS } from "./validation";

export function errorResponse(status: 400 | 403 | 404 | 500, error: string): Response {
  return Response.json({ error }, { status });
}

// JSON이 아닌 요청 본문은 undefined로 돌려 검증 단계에서 400이 되게 한다.
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

// DB 오류처럼 예상하지 못한 예외도 다른 오류와 같은 { error } 모양의 500으로 돌려준다.
export function withErrorResponse<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(error);
      return errorResponse(500, ERRORS.server);
    }
  };
}
