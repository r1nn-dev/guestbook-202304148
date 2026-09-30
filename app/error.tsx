"use client"; // 오류 경계는 클라이언트 컴포넌트여야 한다.

// 방명록을 불러오지 못했을 때의 화면. 오류 내용은 보여주지 않는다.
// 루트 레이아웃(헤더·푸터)은 이 경계 바깥이라 그대로 남는다.
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
      <p className="font-semibold">일시적인 문제로 방명록을 불러오지 못했습니다.</p>
      <p className="mt-1 text-sm text-gray-600">잠시 후 다시 시도해주세요.</p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
