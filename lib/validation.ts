export const LIMITS = {
  name: { min: 1, max: 20 },
  message: { min: 1, max: 500 },
  password: { min: 4, max: 50 },
} as const;

export const ERRORS = {
  badRequest: "잘못된 요청입니다.",
  badId: "잘못된 글 번호입니다.",
  name: `이름은 ${LIMITS.name.min}~${LIMITS.name.max}자로 입력해주세요.`,
  message: `메시지는 ${LIMITS.message.min}~${LIMITS.message.max}자로 입력해주세요.`,
  password: `비밀번호는 ${LIMITS.password.min}~${LIMITS.password.max}자로 입력해주세요.`,
  passwordMismatch: "비밀번호가 일치하지 않습니다.",
  notFound: "글을 찾을 수 없습니다.",
  server: "서버 오류가 발생했습니다.",
  // 화면(클라이언트)에서만 쓰는 안내
  unknown: "요청을 처리하지 못했습니다.",
  network: "서버에 연결하지 못했습니다.",
} as const;

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export type CreateInput = { name: string; message: string; password: string };
export type UpdateInput = { message: string; password: string };
export type DeleteInput = { password: string };

type Limit = { min: number; max: number };

// Postgres char_length와 같은 코드포인트 기준으로 센다. 이모지 하나는 .length로 2지만 여기서는 1.
function withinLimit(value: string, limit: Limit): boolean {
  const length = [...value].length;
  return length >= limit.min && length <= limit.max;
}

function isRecord(body: unknown): body is Record<string, unknown> {
  return typeof body === "object" && body !== null && !Array.isArray(body);
}

function checkTrimmed(value: unknown, limit: Limit, error: string): Result<string> {
  if (typeof value !== "string") return { ok: false, error };
  const trimmed = value.trim();
  return withinLimit(trimmed, limit) ? { ok: true, value: trimmed } : { ok: false, error };
}

// 글 비밀번호는 trim하지 않는다. 입력한 그대로가 비밀번호다.
function checkPassword(value: unknown): Result<string> {
  if (typeof value !== "string" || !withinLimit(value, LIMITS.password)) {
    return { ok: false, error: ERRORS.password };
  }
  return { ok: true, value };
}

export function parseCreateInput(body: unknown): Result<CreateInput> {
  if (!isRecord(body)) return { ok: false, error: ERRORS.badRequest };
  const name = checkTrimmed(body.name, LIMITS.name, ERRORS.name);
  if (!name.ok) return name;
  const message = checkTrimmed(body.message, LIMITS.message, ERRORS.message);
  if (!message.ok) return message;
  const password = checkPassword(body.password);
  if (!password.ok) return password;
  return { ok: true, value: { name: name.value, message: message.value, password: password.value } };
}

// 작성자 이름은 고칠 수 없으므로 요청 본문에 들어와도 보지 않는다.
export function parseUpdateInput(body: unknown): Result<UpdateInput> {
  if (!isRecord(body)) return { ok: false, error: ERRORS.badRequest };
  const message = checkTrimmed(body.message, LIMITS.message, ERRORS.message);
  if (!message.ok) return message;
  const password = checkPassword(body.password);
  if (!password.ok) return password;
  return { ok: true, value: { message: message.value, password: password.value } };
}

// bigserial 글 번호. 18자리까지만 받아 bigint 범위를 넘는 값이 DB 오류가 되지 않게 한다.
export function parseEntryId(raw: string): Result<string> {
  return /^[1-9]\d{0,17}$/.test(raw) ? { ok: true, value: raw } : { ok: false, error: ERRORS.badId };
}

export function parseDeleteInput(body: unknown): Result<DeleteInput> {
  if (!isRecord(body)) return { ok: false, error: ERRORS.badRequest };
  const password = checkPassword(body.password);
  if (!password.ok) return password;
  return { ok: true, value: { password: password.value } };
}
