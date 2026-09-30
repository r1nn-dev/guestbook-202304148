import { sql } from "./db";

// 응답과 화면에 쓰는 글의 모양. password_hash는 절대 포함하지 않는다 (docs/adr/0001).
export type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
};

function toEntry(row: Record<string, unknown>): Entry {
  return {
    id: String(row.id),
    name: row.name as string,
    message: row.message as string,
    createdAt: new Date(row.created_at as string | Date).toISOString(),
    updatedAt: row.updated_at === null ? null : new Date(row.updated_at as string | Date).toISOString(),
  };
}

// select *는 쓰지 않는다. 컬럼을 하나하나 지정해 password_hash가 새지 않게 한다.
export async function listEntries(): Promise<Entry[]> {
  const rows = await sql`
    select id, name, message, created_at, updated_at
    from entries
    order by created_at desc, id desc
  `;
  return rows.map(toEntry);
}
