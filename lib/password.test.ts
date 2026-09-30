import { describe, expect, it } from "vitest";
import { hashPassword, isAdminPassword, verifyPassword } from "./password";

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

  it("콜론으로 나뉜 조각이 셋 이상인 저장값은 맞는 비밀번호라도 거부한다", async () => {
    const stored = await hashPassword("1234");
    expect(await verifyPassword("1234", `${stored}:junk`)).toBe(false);
  });
});

describe("isAdminPassword", () => {
  const admin = "correct-horse-battery-staple";

  it("관리자 비밀번호와 같으면 통과한다", () => {
    expect(isAdminPassword(admin, admin)).toBe(true);
  });

  it("다르면 거부한다", () => {
    expect(isAdminPassword("wrong-horse-battery-staple", admin)).toBe(false);
  });

  it("길이가 달라도 예외 없이 거부한다", () => {
    expect(isAdminPassword("1234", admin)).toBe(false);
    expect(isAdminPassword(`${admin}-longer`, admin)).toBe(false);
  });

  it("앞뒤 공백 한 글자만 달라도 거부한다", () => {
    expect(isAdminPassword(` ${admin}`, admin)).toBe(false);
    expect(isAdminPassword(`${admin} `, admin)).toBe(false);
  });

  it.each([undefined, ""])("관리자 비밀번호가 설정되지 않았으면(%j) 어떤 입력도 거부한다", (configured) => {
    expect(isAdminPassword("", configured)).toBe(false);
    expect(isAdminPassword("1234", configured)).toBe(false);
    expect(isAdminPassword(admin, configured)).toBe(false);
  });
});
