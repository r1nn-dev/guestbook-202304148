import { describe, expect, it } from "vitest";
import { countChars, parseCreateInput, parseDeleteInput, parseEntryId, parseUpdateInput } from "./validation";

const valid = { name: "하린", message: "안녕하세요", password: "1234" };

describe("parseCreateInput", () => {
  it("작성자 이름과 메시지의 앞뒤 공백을 제거한다", () => {
    expect(parseCreateInput({ ...valid, name: "  하린 ", message: "\n안녕\n " })).toEqual({
      ok: true,
      value: { name: "하린", message: "안녕", password: "1234" },
    });
  });

  it("글 비밀번호는 공백을 제거하지 않는다", () => {
    expect(parseCreateInput({ ...valid, password: " 1234 " })).toEqual({
      ok: true,
      value: { ...valid, password: " 1234 " },
    });
  });

  it.each([
    ["공백뿐인 작성자 이름", { name: "   " }, "이름은 1~20자로 입력해주세요."],
    ["21자 작성자 이름", { name: "가".repeat(21) }, "이름은 1~20자로 입력해주세요."],
    ["문자열이 아닌 작성자 이름", { name: 123 }, "이름은 1~20자로 입력해주세요."],
    ["빈 메시지", { message: "" }, "메시지는 1~500자로 입력해주세요."],
    ["공백뿐인 메시지", { message: " \n\t " }, "메시지는 1~500자로 입력해주세요."],
    ["501자 메시지", { message: "a".repeat(501) }, "메시지는 1~500자로 입력해주세요."],
    ["3자 글 비밀번호", { password: "123" }, "비밀번호는 4~50자로 입력해주세요."],
    ["51자 글 비밀번호", { password: "a".repeat(51) }, "비밀번호는 4~50자로 입력해주세요."],
    ["없는 글 비밀번호", { password: undefined }, "비밀번호는 4~50자로 입력해주세요."],
  ])("%s는 거부한다", (_, override, error) => {
    expect(parseCreateInput({ ...valid, ...override })).toEqual({ ok: false, error });
  });

  it("경계값(20자, 500자, 4자·50자)은 허용한다", () => {
    expect(parseCreateInput({ ...valid, name: "가".repeat(20) }).ok).toBe(true);
    expect(parseCreateInput({ ...valid, message: "a".repeat(500) }).ok).toBe(true);
    expect(parseCreateInput({ ...valid, password: "1234" }).ok).toBe(true);
    expect(parseCreateInput({ ...valid, password: "a".repeat(50) }).ok).toBe(true);
  });

  it("이모지를 눈에 보이는 대로 한 글자로 센다", () => {
    expect(parseCreateInput({ ...valid, message: "😀".repeat(500) }).ok).toBe(true);
    expect(parseCreateInput({ ...valid, name: "😀".repeat(21) })).toEqual({
      ok: false,
      error: "이름은 1~20자로 입력해주세요.",
    });
  });

  it.each([null, undefined, "문자열", [1, 2]])("객체가 아닌 요청 본문 %j는 거부한다", (body) => {
    expect(parseCreateInput(body)).toEqual({ ok: false, error: "잘못된 요청입니다." });
  });

  it("여러 칸이 틀리면 작성자 이름 → 메시지 → 비밀번호 순서로 첫 오류 하나만 돌려준다", () => {
    expect(parseCreateInput({ name: "", message: "", password: "" })).toEqual({
      ok: false,
      error: "이름은 1~20자로 입력해주세요.",
    });
    expect(parseCreateInput({ name: "하린", message: "", password: "" })).toEqual({
      ok: false,
      error: "메시지는 1~500자로 입력해주세요.",
    });
  });
});

describe("parseUpdateInput", () => {
  it("메시지를 trim하고, 작성자 이름이 들어와도 무시한다", () => {
    expect(parseUpdateInput({ name: "바꾸려는 이름", message: " 수정 ", password: "1234" })).toEqual({
      ok: true,
      value: { message: "수정", password: "1234" },
    });
  });

  it("글 비밀번호는 공백을 제거하지 않는다", () => {
    expect(parseUpdateInput({ message: "수정", password: " 1234" })).toEqual({
      ok: true,
      value: { message: "수정", password: " 1234" },
    });
  });

  it("메시지 오류를 비밀번호 오류보다 먼저 알린다", () => {
    expect(parseUpdateInput({ message: " ", password: "1" })).toEqual({
      ok: false,
      error: "메시지는 1~500자로 입력해주세요.",
    });
  });

  it("짧은 글 비밀번호와 객체가 아닌 요청 본문은 거부한다", () => {
    expect(parseUpdateInput({ message: "수정", password: "123" })).toEqual({
      ok: false,
      error: "비밀번호는 4~50자로 입력해주세요.",
    });
    expect(parseUpdateInput(null)).toEqual({ ok: false, error: "잘못된 요청입니다." });
  });
});

describe("parseEntryId", () => {
  it.each(["1", "42", "123456789012345678"])("글 번호 %j는 허용한다", (raw) => {
    expect(parseEntryId(raw)).toEqual({ ok: true, value: raw });
  });

  it.each(["0", "-1", "01", "1.5", "abc", "", "1234567890123456789"])("글 번호 %j는 거부한다", (raw) => {
    expect(parseEntryId(raw)).toEqual({ ok: false, error: "잘못된 글 번호입니다." });
  });
});

describe("parseDeleteInput", () => {
  it("글 비밀번호만 보고, 공백을 제거하지 않는다", () => {
    expect(parseDeleteInput({ password: " 1234" })).toEqual({ ok: true, value: { password: " 1234" } });
  });

  it("너무 짧은 글 비밀번호는 거부한다", () => {
    expect(parseDeleteInput({ password: "12" })).toEqual({
      ok: false,
      error: "비밀번호는 4~50자로 입력해주세요.",
    });
  });

  it("요청 본문이 없으면 잘못된 요청이다", () => {
    expect(parseDeleteInput(undefined)).toEqual({ ok: false, error: "잘못된 요청입니다." });
  });
});

describe("countChars", () => {
  it("이모지를 눈에 보이는 대로 한 글자로 센다", () => {
    expect(countChars("😀😀", { trim: false })).toBe(2);
  });

  it("한글과 줄바꿈이 섞여도 코드포인트 수를 센다", () => {
    expect(countChars("안녕\n하세요", { trim: false })).toBe(6);
  });

  it("trim 옵션이면 앞뒤 공백을 빼고 센다", () => {
    expect(countChars("  안녕 \n", { trim: true })).toBe(2);
    expect(countChars("  안녕 \n", { trim: false })).toBe(6);
  });

  it("500자 경계에서 메시지 검증과 같은 판정을 낸다", () => {
    const at500 = ` ${"😀".repeat(500)} `;
    const at501 = "😀".repeat(501);
    expect(countChars(at500, { trim: true })).toBe(500);
    expect(parseCreateInput({ name: "하린", message: at500, password: "1234" }).ok).toBe(true);
    expect(countChars(at501, { trim: true })).toBe(501);
    expect(parseCreateInput({ name: "하린", message: at501, password: "1234" }).ok).toBe(false);
  });
});
