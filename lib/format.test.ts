import { describe, expect, it } from "vitest";
import { formatKst } from "./format";

describe("formatKst", () => {
  it("UTC 시각을 KST로 바꿔 YYYY. MM. DD. HH:mm으로 표시한다", () => {
    expect(formatKst("2026-09-30T05:05:00.000Z")).toBe("2026. 09. 30. 14:05");
  });

  it("KST 기준으로 연·월·일이 넘어간다", () => {
    expect(formatKst("2026-12-31T15:30:00.000Z")).toBe("2027. 01. 01. 00:30");
  });

  it("자정 직후를 24시간제 00시로 표시한다", () => {
    expect(formatKst("2026-03-01T15:00:00.000Z")).toBe("2026. 03. 02. 00:00");
  });
});
