// 방명록을 불러오는 동안 보여주는 글 카드 모양 스켈레톤
export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="방명록을 불러오는 중">
      {[0, 1, 2].map((key) => (
        <div key={key} className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>
          <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
