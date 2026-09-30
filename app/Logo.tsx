// 보라색 사각형 안의 말풍선 아이콘. 헤더와 푸터에서 같이 쓴다.
export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "md" ? "h-8 w-8 rounded-lg" : "h-5 w-5 rounded-md";
  const icon = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <span className={`inline-flex items-center justify-center bg-brand text-white ${box}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z" />
        <path d="M9 11h6M9 14h4" />
      </svg>
    </span>
  );
}
