import { listEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await listEntries());
}
