const kstFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// "2026. 09. 30. 14:05" 형태의 KST 시각
export function formatKst(iso: string): string {
  const parts = Object.fromEntries(
    kstFormatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${parts.year}. ${parts.month}. ${parts.day}. ${parts.hour}:${parts.minute}`;
}
