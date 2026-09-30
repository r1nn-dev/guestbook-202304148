"use client";

import { LIMITS, countChars } from "@/lib/validation";

// 서버와 같은 기준(trim 후 코드포인트)으로 센 메시지가 제한을 넘는지
export function isMessageTooLong(message: string): boolean {
  return countChars(message, { trim: true }) > LIMITS.message.max;
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  // 처리 중이거나 제한을 넘으면 Ctrl+Enter로도 제출하지 않는다 (버튼 비활성화와 같은 조건).
  submitDisabled: boolean;
  placeholder?: string;
  rows?: number;
};

// 작성·수정 폼이 함께 쓰는 메시지 입력칸: 글자 수 표시와 Ctrl/Cmd+Enter 제출.
// maxLength는 UTF-16 단위로 세어 코드포인트 기준과 어긋나므로 두지 않고, 최종 판정은 서버가 한다.
export function MessageInput({ value, onChange, submitDisabled, placeholder, rows = 3 }: Props) {
  const count = countChars(value, { trim: true });
  const tooLong = count > LIMITS.message.max;

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
    // 한글 조합 중에 제출하면 마지막 글자가 두 번 들어가거나 빠진다.
    if (event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!submitDisabled) event.currentTarget.form?.requestSubmit();
  }

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required
        rows={rows}
        className="field resize-y"
      />
      <p className={`mt-1 text-right text-xs tabular-nums ${tooLong ? "font-semibold text-red-600" : "text-gray-400"}`}>
        {count}/{LIMITS.message.max}
      </p>
    </div>
  );
}
