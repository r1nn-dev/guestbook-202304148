import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");
}

export const sql = neon(databaseUrl);
