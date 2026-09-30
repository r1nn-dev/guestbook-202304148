import { sql } from "./db";

// 응답과 화면에 쓰는 글의 모양. password_hash는 절대 포함하지 않는다 (docs/adr/0001).
export type Entry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
};

// select *는 쓰지 않는다. 응답에 나가는 컬럼은 이 한 곳에서만 정해 password_hash가 새지 않게 한다.
// 고정 문자열이라 unsafe로 끼워 넣어도 안전하다.
const ENTRY_COLUMNS = sql.unsafe("id, name, message, created_at, updated_at");

function toEntry(row: Record<string, unknown>): Entry {
  return {
    id: String(row.id),
    name: row.name as string,
    message: row.message as string,
    createdAt: new Date(row.created_at as string | Date).toISOString(),
    updatedAt: row.updated_at === null ? null : new Date(row.updated_at as string | Date).toISOString(),
  };
}

export async function listEntries(): Promise<Entry[]> {
  const rows = await sql`
    select ${ENTRY_COLUMNS}
    from entries
    order by created_at desc, id desc
  `;
  return rows.map(toEntry);
}

export async function createEntry(name: string, message: string, passwordHash: string): Promise<Entry> {
  const rows = await sql`
    insert into entries (name, message, password_hash)
    values (${name}, ${message}, ${passwordHash})
    returning ${ENTRY_COLUMNS}
  `;
  return toEntry(rows[0]);
}

export async function findPasswordHash(id: string): Promise<string | null> {
  const rows = await sql`select password_hash from entries where id = ${id}`;
  return rows.length === 0 ? null : (rows[0].password_hash as string);
}

// 비밀번호 확인과 수정 사이에 글이 지워졌으면 null
export async function updateMessage(id: string, message: string): Promise<Entry | null> {
  const rows = await sql`
    update entries
    set message = ${message}, updated_at = now()
    where id = ${id}
    returning ${ENTRY_COLUMNS}
  `;
  return rows.length === 0 ? null : toEntry(rows[0]);
}

// 비밀번호 확인과 삭제 사이에 글이 지워졌으면 false
export async function deleteEntry(id: string): Promise<boolean> {
  const rows = await sql`delete from entries where id = ${id} returning id`;
  return rows.length > 0;
}

export async function countEntries(): Promise<number> {
  const rows = await sql`select count(*)::int as count from entries`;
  return rows[0].count as number;
}
