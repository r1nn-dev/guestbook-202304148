import { connection } from "next/server";
import { countEntries } from "@/lib/entries";

async function loadCount(): Promise<number | null> {
  try {
    return await countEntries();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 헤더의 총 글 수. 루트 레이아웃은 error.tsx가 감싸지 않으므로,
// 개수를 못 불러와도 레이아웃 전체가 죽지 않게 여기서 오류를 삼키고 개수만 숨긴다.
export async function EntryCount() {
  await connection(); // 빌드 때 미리 렌더링하지 않고 요청마다 센다.
  const count = await loadCount();
  if (count === null) return null;
  return <span className="text-sm text-gray-600">총 {count}개</span>;
}
