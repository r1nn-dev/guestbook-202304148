# 미니 방명록

SDD(Spec-Driven Development) 방식으로 만든 미니 방명록 웹앱.  
회원가입·로그인 없이 이름과 비밀번호만으로 글을 남기고, 본인 글을 수정·삭제할 수 있다.

- **배포 URL**: https://guestbook-<학번>.vercel.app
- **개발자**: 홍길동 · 20231234

---

## 주요 기능

| 기능 | 설명 |
| --- | --- |
| 글 작성 | 이름, 메시지, 비밀번호를 입력해 글을 남긴다. |
| 글 조회 | 전체 글을 최신 작성 순으로 본다. |
| 글 수정 | 작성 시 설정한 비밀번호로 메시지를 수정한다. 틀리면 거부되고 안내가 표시된다. |
| 글 삭제 | 작성 시 설정한 비밀번호로 글을 삭제한다. 틀리면 거부되고 안내가 표시된다. |
| 관리자 삭제 | 관리자 비밀번호로 글쓴이 비밀번호 없이 어떤 글이든 삭제한다. |

---

## 기술 스택

| 분류 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 데이터베이스 | Neon Postgres (`@neondatabase/serverless`, ORM 없이 raw SQL) |
| 스타일 | Tailwind CSS |
| 테스트 | Vitest (입력 검증·비밀번호 해시 순수 로직) |
| 배포 | Vercel |
| 개발 도구 | Claude Code + Matt Pocock's Skills (SDD) |

---

## 설계 결정

- **비밀번호 저장**: scrypt + 랜덤 salt로 해시해 `salt:hash` 형태로 저장한다. 평문은 어디에도 저장하지 않는다.
- **비밀번호 비교**: `timingSafeEqual`로 타이밍 공격을 방지한다.
- **입력 검증**: 클라이언트(`maxLength`)는 UX, API Route가 실제 방어, DB `CHECK` 제약이 최종 방어 역할을 한다.
- **캐시 방지**: `export const dynamic = "force-dynamic"`으로 목록을 요청마다 DB에서 읽는다.
- **민감 정보 보호**: `select *` 대신 필요한 열만 명시해 `password_hash`가 응답에 포함되지 않게 한다.

---

## 로컬 실행

**1. 의존성 설치**

```bash
npm install
```

**2. 환경변수 설정**

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 입력한다.

```
DATABASE_URL=postgresql://<사용자>:<비밀번호>@<호스트>/<DB이름>?sslmode=require
ADMIN_PASSWORD=<관리자 비밀번호 — 16자 이상 권장>
```

**3. DB 스키마 적용**

Neon SQL Editor에서 `db/schema.sql`을 실행한다.

**4. 개발 서버 실행**

```bash
npm run dev   # http://localhost:3000
```

**5. 테스트 실행**

```bash
npm run test
```

---

## 프로젝트 구조

```
app/
├── api/entries/
│   ├── route.ts          # GET(목록 조회), POST(글 작성)
│   └── [id]/route.ts     # PATCH(수정), DELETE(삭제 + 관리자 강제 삭제)
├── entry-form.tsx         # 작성 폼 (Client Component)
├── entry-item.tsx         # 글 카드 + 수정·삭제 폼 (Client Component)
├── error.tsx              # 오류 화면
├── loading.tsx            # 로딩 스켈레톤
└── page.tsx               # 목록 화면 (Server Component)
lib/
├── db.ts                  # Neon SQL 클라이언트
├── developer.ts           # 개발자 정보 상수
├── entry.ts               # 입력 검증 (순수 함수)
├── entry.test.ts          # 단위 테스트
└── password.ts            # 비밀번호 해시·검증
db/
└── schema.sql             # 테이블 생성 SQL
```

---

## API

| 메서드 | 경로 | 요청 본문 | 응답 |
| --- | --- | --- | --- |
| `GET` | `/api/entries` | — | `200` 글 목록 (최신순) |
| `POST` | `/api/entries` | `{ name, message, password }` | `201` 생성된 글 / `400` 검증 실패 |
| `PATCH` | `/api/entries/[id]` | `{ message, password }` | `200` 수정된 글 / `400` / `403` / `404` |
| `DELETE` | `/api/entries/[id]` | `{ password }` | `204` / `400` / `403` / `404` |

모든 오류 응답은 `{ "error": "안내 문구" }` 형태로 통일된다.