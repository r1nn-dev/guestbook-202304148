"use client"; // 오류 경계는 클라이언트 컴포넌트여야 한다.

// 방명록을 불러오지 못했을 때의 화면. 오류 내용은 보여주지 않는다.
// 루트 레이아웃(헤더·푸터)은 이 경계 바깥이라 그대로 남는다.
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
      <p className="text-lg font-bold tracking-tight">일시적인 문제로 방명록을 불러오지 못했습니다.</p>
      <p className="mt-2 text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
      <button type="button" onClick={() => retry()} className="btn-primary mt-6 px-5 py-2.5">
        다시 시도
      </button>
    </div>
  );
}
