import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string, salt: string, keylen: number) => Promise<Buffer>;

const SALT_BYTES = 16;
const KEY_LENGTH = 64;

// 저장 형식: "<salt hex>:<hash hex>" (docs/adr/0001)
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 2) return false;
  const [salt, hashHex] = parts;
  if (!salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await scryptAsync(password, salt, KEY_LENGTH);
  return timingSafeEqual(actual, expected);
}

// 강제 삭제용 관리자 비밀번호 비교 (docs/adr/0003).
// 설정값은 호출하는 쪽이 넘긴다. 없거나 비어 있으면 강제 삭제는 꺼진다.
// 양쪽을 SHA-256으로 같은 길이로 만들어, 길이 차이로 예외가 나거나 정보가 새지 않게 한다.
export function isAdminPassword(input: string, configured: string | undefined): boolean {
  if (!configured) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(input), digest(configured));
}
