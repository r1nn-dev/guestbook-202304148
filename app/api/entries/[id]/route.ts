import { deleteEntry, findPasswordHash, updateMessage } from "@/lib/entries";
import { errorResponse, readJson, withErrorResponse } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { ERRORS, parseDeleteInput, parseEntryId, parseUpdateInput } from "@/lib/validation";

type Context = RouteContext<"/api/entries/[id]">;

// 판정 순서: 400(글 번호 → 요청 본문) → 404(글 없음) → 403(비밀번호 불일치)

// 글쓴이인지 확인한다. 통과하면 null, 아니면 돌려줄 404/403 응답.
async function checkEntryPassword(id: string, password: string): Promise<Response | null> {
  const stored = await findPasswordHash(id);
  if (stored === null) return errorResponse(404, ERRORS.notFound);
  if (!(await verifyPassword(password, stored))) return errorResponse(403, ERRORS.passwordMismatch);
  return null;
}

export const PATCH = withErrorResponse(async (request: Request, ctx: Context) => {
  const id = parseEntryId((await ctx.params).id);
  if (!id.ok) return errorResponse(400, id.error);
  const input = parseUpdateInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const denied = await checkEntryPassword(id.value, input.value.password);
  if (denied) return denied;

  const entry = await updateMessage(id.value, input.value.message);
  if (entry === null) return errorResponse(404, ERRORS.notFound);
  return Response.json(entry, { status: 200 });
});

export const DELETE = withErrorResponse(async (request: Request, ctx: Context) => {
  const id = parseEntryId((await ctx.params).id);
  if (!id.ok) return errorResponse(400, id.error);
  const input = parseDeleteInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const denied = await checkEntryPassword(id.value, input.value.password);
  if (denied) return denied;

  if (!(await deleteEntry(id.value))) return errorResponse(404, ERRORS.notFound);
  return new Response(null, { status: 204 });
});
