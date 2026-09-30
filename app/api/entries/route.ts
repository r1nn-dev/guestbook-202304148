import { createEntry, listEntries } from "@/lib/entries";
import { errorResponse, readJson } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { parseCreateInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await listEntries());
}

export async function POST(request: Request) {
  const input = parseCreateInput(await readJson(request));
  if (!input.ok) return errorResponse(400, input.error);

  const { name, message, password } = input.value;
  const entry = await createEntry(name, message, await hashPassword(password));
  return Response.json(entry, { status: 201 });
}
