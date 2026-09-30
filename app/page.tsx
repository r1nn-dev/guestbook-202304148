import { listEntries } from "@/lib/entries";
import { formatKst } from "@/lib/format";
import { EntryForm } from "./EntryForm";
import { EntryItem } from "./EntryItem";

export const dynamic = "force-dynamic";

export default async function Home() {
  const entries = await listEntries();

  return (
    <div className="space-y-6">
      <EntryForm />
      <section>
        <h2 className="sr-only">방명록</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500">아직 글이 없습니다. 첫 글을 남겨보세요.</p>
        ) : (
          <ul className="space-y-3">
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
