"use client";

import { useState } from "react";
import { LIMITS } from "@/lib/validation";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: "new-password" | "current-password";
  className?: string;
};

// 작성·수정·삭제 폼이 함께 쓰는 비밀번호 입력칸. 눈 아이콘으로 입력한 값을 보거나 숨긴다.
// 보기 상태는 이 컴포넌트 안에만 있어서, 패널을 닫았다 열면 다시 가려진다.
export function PasswordInput({ value, onChange, placeholder, autoComplete, className = "" }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        minLength={LIMITS.password.min}
        maxLength={LIMITS.password.max}
        required
        autoComplete={autoComplete}
        className="w-full rounded border border-gray-300 py-2 pl-3 pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 hover:text-gray-800"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </div>
  );
}
