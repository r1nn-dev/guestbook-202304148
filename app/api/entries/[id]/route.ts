import { deleteEntry, findPasswordHash, updateMessage } from "@/lib/entries";
import { errorResponse, readJson } from "@/lib/http";
import { verifyPassword } from "@/lib/password";
import { ERRORS, parseDeleteInput, parseEntryId, parseUpdateInput } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

// 판정 순서: 400(글 번호 → 본문) → 404(글 없음) → 403(비밀번호 불일치)

export async function PATCH(request: Request, { params }: Context) {
  const id = parseEntryId((await params).id);
  if (!id.ok) return errorResponse(400, id.error);
  const input = parseUpdateInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const stored = await findPasswordHash(id.value);
  if (stored === null) return errorResponse(404, ERRORS.notFound);
  if (!(await verifyPassword(input.value.password, stored))) {
    return errorResponse(403, ERRORS.passwordMismatch);
  }

  const entry = await updateMessage(id.value, input.value.message);
  if (entry === null) return errorResponse(404, ERRORS.notFound);
  return Response.json(entry, { status: 200 });
}

export async function DELETE(request: Request, { params }: Context) {
  const id = parseEntryId((await params).id);
  if (!id.ok) return errorResponse(400, id.error);
  const input = parseDeleteInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const stored = await findPasswordHash(id.value);
  if (stored === null) return errorResponse(404, ERRORS.notFound);
  if (!(await verifyPassword(input.value.password, stored))) {
    return errorResponse(403, ERRORS.passwordMismatch);
  }

  if (!(await deleteEntry(id.value))) return errorResponse(404, ERRORS.notFound);
  return new Response(null, { status: 204 });
}
