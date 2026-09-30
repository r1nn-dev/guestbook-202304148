# 01: 방명록 보기 + 개발자 정보 (뼈대)

**What to build:** 방문자가 `/`에 들어오면 방명록 전체를 최신 작성 순으로 본다. 각 글에는 작성자 이름, 메시지(줄바꿈 유지), KST 작성 시각이 나오고, 수정된 글에는 "(수정됨)"이 붙는다. 글이 없으면 첫 글을 남겨보라는 안내가 나온다. 전체 글 개수도 보인다. 화면 상단과 푸터에는 개발자 정보(조하린 · 202304148)가 항상 표시된다. 같은 목록을 `GET /api/entries`로도 받을 수 있다. 이 티켓으로 DB → API → 화면 → 테스트가 한 줄로 이어진 것을 확인한다.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Vitest를 설치하고 `test` 스크립트를 추가한다. Vitest 5의 요구에 맞춰 `@types/node`를 22 이상으로 올린다. `--legacy-peer-deps`로 우회하지 않는다.
- [x] KST 표시 함수는 ISO 시각을 `Asia/Seoul` 기준 `YYYY. MM. DD. HH:mm`(24시간제)으로 돌려준다. 테스트로 UTC → KST 변환과, KST 기준으로 연·월·일이 넘어가는 경계를 확인한다.
- [x] DB 클라이언트는 `DATABASE_URL`로 Neon에 연결한다. 값이 없으면 분명한 오류를 낸다.
- [x] 글 저장소의 목록 조회는 `created_at desc, id desc` 순으로 `id, name, message, created_at, updated_at`만 가져온다. `select *`는 쓰지 않는다. 결과는 camelCase 글 모양(`id`는 문자열, 시각은 ISO 문자열, `updatedAt`은 null 가능)으로 바꾼다.
- [x] `GET /api/entries`는 200과 글 배열을 돌려준다. 응답 어디에도 `password`나 `password_hash`가 없다.
- [x] `/` 페이지는 `export const dynamic = "force-dynamic"`으로 요청마다 렌더링한다.
- [x] 방명록이 비어 있으면 안내 문구와 "전체 글 0개"가 보인다.
- [x] 개발자 정보 상수는 사용자가 지정한 `lib/developer.ts`에 둔다(이름 "조하린", 학번 "202304148"). 레이아웃 상단과 푸터에 표시한다.
- [x] 레이아웃은 `lang="ko"`와 한국어 제목을 쓴다. 템플릿에 남은 전역 스타일(body 배경, 다크 모드 변수)처럼 Tailwind 클래스를 덮어쓰는 규칙은 정리한다.
- [x] 메시지는 줄바꿈을 유지해 보여준다. HTML은 이스케이프된 글자로만 보인다.
- [x] `npm test`, 타입 검사, 린트, `npm run build`가 모두 통과한다.
- [x] 구현 전에 `node_modules/next/dist/docs/`의 관련 문서(라우트 핸들러, `dynamic` 설정)를 확인한다.

## Comments

- 구현 완료. 자동 테스트는 KST 표시 함수 3개. 개발 서버에서 읽기 요청만으로 수동 확인: `GET /api/entries` 200 `[]`, 페이지의 `lang="ko"`, 제목, 개발자 정보, 빈 방명록 안내, "전체 글 0개", 응답에 password 없음. DB에는 쓰지 않았다.
