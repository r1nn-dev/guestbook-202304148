import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("hex salt(16바이트)와 hex hash(64바이트)를 콜론으로 이은 문자열을 만든다", async () => {
    expect(await hashPassword("1234")).toMatch(/^[0-9a-f]{32}:[0-9a-f]{128}$/);
  });

  it("같은 글 비밀번호라도 매번 다른 salt를 쓴다", async () => {
    expect(await hashPassword("1234")).not.toBe(await hashPassword("1234"));
  });

  it("원문 비밀번호를 포함하지 않는다", async () => {
    expect(await hashPassword("secret-pass")).not.toContain("secret-pass");
  });
});

describe("verifyPassword", () => {
  it("맞는 글 비밀번호는 통과한다", async () => {
    expect(await verifyPassword("1234", await hashPassword("1234"))).toBe(true);
  });

  it("틀린 글 비밀번호와 공백만 다른 비밀번호는 거부한다", async () => {
    const stored = await hashPassword("1234");
    expect(await verifyPassword("12345", stored)).toBe(false);
    expect(await verifyPassword(" 1234", stored)).toBe(false);
  });

  it.each(["", "nocolon", "abcd:", ":abcd", "abcd:1234"])(
    "형식이 깨진 저장값 %j는 예외 없이 거부한다",
    async (stored) => {
      expect(await verifyPassword("1234", stored)).toBe(false);
    },
  );
});
