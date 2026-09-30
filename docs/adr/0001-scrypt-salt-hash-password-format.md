# 글 비밀번호는 scrypt `salt:hash` 문자열로 저장한다

글 비밀번호는 `node:crypto`의 scrypt에 글마다 무작위 salt(16바이트)를 붙여 해시하고, `password_hash` 한 컬럼에 hex 문자열 `salt:hash`(키 64바이트, scrypt 기본 파라미터)로 저장한다. 비교는 `timingSafeEqual`로 한다. bcrypt/argon2 같은 외부 패키지는 설치·배포 부담 없이 표준 라이브러리만으로 충분해서 쓰지 않았다. salt와 hash를 컬럼 하나에 묶은 이유는 스키마를 단순하게 두기 위해서다.

## Consequences

- 이미 저장된 행이 이 형식에 묶여 있다. 알고리즘이나 파라미터를 바꾸려면 새 형식을 구분할 접두사를 붙이고, 옛 형식도 계속 검증할 수 있어야 한다.
- `password_hash`는 어떤 API 응답에도 담지 않는다. 그래서 조회 쿼리는 `select *`를 쓰지 않고 컬럼을 하나하나 지정한다.
