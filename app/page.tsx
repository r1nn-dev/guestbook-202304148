import { listEntries } from "@/lib/entries";
import { formatKst } from "@/lib/format";
import { EntryForm } from "./EntryForm";
import { EntryItem } from "./EntryItem";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries();

  return (
    <div className="space-y-10">
      <EntryForm />
      <section>
        {/* 총 글 수는 헤더에만 보여준다(같은 숫자를 두 번 보이지 않기). */}
        <h2 className="mb-3 text-lg font-bold tracking-tight">방명록</h2>
        {entries.length === 0 ? (
          <p className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500">
            아직 글이 없습니다. 첫 글을 남겨보세요.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {entries.map((entry) => (
              // 수정되면 key가 바뀌어 수정 패널의 상태가 새 메시지로 초기화된다.
              <EntryItem
                key={`${entry.id}-${entry.updatedAt ?? ""}`}
                id={entry.id}
                name={entry.name}
                message={entry.message}
                createdAtText={formatKst(entry.createdAt)}
                edited={entry.updatedAt !== null}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
