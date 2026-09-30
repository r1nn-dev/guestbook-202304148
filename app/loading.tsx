// 방명록을 불러오는 동안 보여주는 글 카드 모양 스켈레톤
export default function Loading() {
  return (
    <div
      className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white"
      aria-busy="true"
      aria-label="방명록을 불러오는 중"
    >
      {[0, 1, 2].map((key) => (
        <div key={key} className="animate-pulse px-6 py-5">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
          <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
