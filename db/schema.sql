-- 이미 Neon에서 실행된 스키마의 기록용 사본. 자동으로 실행되지 않는다 (docs/adr/0002 참고).

create table entries (
  id            bigserial primary key,
  name          text not null check (char_length(name) between 1 and 20),
  message       text not null check (char_length(message) between 1 and 500),
  password_hash text not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz null
);

create index entries_created_at_desc_idx on entries (created_at desc);
