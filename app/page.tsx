import { listEntries } from "@/lib/entries";
import { formatKst } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries();

  return (
    <section>
      <h2 className="mb-3 font-semibold">전체 글 {entries.length}개</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">아직 글이 없습니다. 첫 글을 남겨보세요.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{entry.name}</span>
                <span className="text-xs text-gray-500">
                  {formatKst(entry.createdAt)}
                  {entry.updatedAt !== null && " (수정됨)"}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words">{entry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
