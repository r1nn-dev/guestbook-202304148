# 미니 방명록

회원가입 없이 누구나 이름, 메시지, 글 비밀번호만으로 글을 남기는 한 페이지짜리 방명록입니다.

- 개발자: 조하린 (202304148)
- 저장소: https://github.com/r1nn-dev/guestbook-202304148

## 기능

- **글 남기기:** 작성자 이름(1~20자), 메시지(1~500자), 글 비밀번호(4~50자)를 입력합니다. 이름과 메시지는 앞뒤 공백을 제거합니다.
- **방명록 보기:** 최신 작성 순으로 보여주고, 작성 시각은 KST로 표시합니다. 헤더에 총 글 수가 나옵니다.
- **수정·삭제:** 글 안에서 글 비밀번호를 입력해 메시지를 수정하거나 글을 삭제합니다. 비밀번호가 틀리면 "비밀번호가 일치하지 않습니다."가 표시됩니다. 수정된 글에는 "수정됨"이 붙습니다.
- **강제 삭제:** 관리자는 삭제 폼에 관리자 비밀번호(`ADMIN_PASSWORD`)를 입력해 어떤 글이든 지울 수 있습니다. 수정은 할 수 없습니다.
- **편의 기능:**
  - 메시지 글자 수 표시(`123/500`, 이모지는 1글자)
  - Ctrl/Cmd+Enter로 등록
  - 비밀번호 보기 토글
  - 로딩 스켈레톤
  - 오류 화면(다시 시도)

## 기술 스택

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Neon Postgres(`@neondatabase/serverless`, ORM 없이 `sql` 태그드 템플릿), Vercel, Vitest

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # 순수 로직 테스트 (입력 검증, 비밀번호, KST 표시)
npm run build
```

`.env.local`에 아래 환경 변수가 필요합니다. 배포 환경(Vercel)에도 같은 값을 넣어야 합니다.

| 이름 | 설명 |
| --- | --- |
| `DATABASE_URL` | Neon Postgres 연결 문자열. 로컬과 배포가 같은 DB를 씁니다. |
| `ADMIN_PASSWORD` | 강제 삭제용 관리자 비밀번호. 16~50자 무작위 값. 없으면 강제 삭제가 꺼집니다. |

DB 스키마는 [db/schema.sql](db/schema.sql)에 있습니다. Neon에서 직접 실행하며, 마이그레이션 도구는 쓰지 않습니다.

## API

| 요청 | 성공 | 실패 |
| --- | --- | --- |
| `GET /api/entries` | 200 글 배열 | 500 |
| `POST /api/entries` `{ name, message, password }` | 201 생성된 글 | 400 |
| `PATCH /api/entries/[id]` `{ message, password }` | 200 수정된 글 | 400 / 404 / 403 |
| `DELETE /api/entries/[id]` `{ password }` | 204 | 400 / 404 / 403 |

- 오류 응답은 모두 `{ "error": "안내 문구" }` 모양입니다.
- 비밀번호와 해시는 어떤 응답에도 담지 않습니다.

## 문서

- [CONTEXT.md](CONTEXT.md): 용어집
- [docs/adr/](docs/adr/): 설계 결정 기록
  - 0001: 비밀번호 해시 형식
  - 0002: 로컬과 배포가 DB 하나를 같이 씀
  - 0003: 강제 삭제
- [.scratch/](.scratch/): 스펙과 티켓
