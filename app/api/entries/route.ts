import { createEntry, listEntries } from "@/lib/entries";
import { errorResponse, readJson, withErrorResponse } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { parseCreateInput } from "@/lib/validation";

// 라우트 핸들러는 기본적으로 캐시되지 않으므로 dynamic 설정이 필요 없다.

export const GET = withErrorResponse(async () => {
  return Response.json(await listEntries());
});

export const POST = withErrorResponse(async (request: Request) => {
  const input = parseCreateInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const { name, message, password } = input.value;
  const entry = await createEntry(name, message, await hashPassword(password));
  return Response.json(entry, { status: 201 });
});
