## Phase 15 - Ops Access Flow

### What Changed
- 운영자 보드 진입 흐름을 로컬 데모 기준으로 정리했다.
  - 로그인되지 않은 상태에서 `/ops` 진입 시 로그인 후 다시 운영 보드로 복귀하도록 callback URL 연결
  - 로그인은 했지만 ADMIN 권한이 없으면 홈으로 튕기지 않고 전용 가이드 페이지로 이동
- 운영자 접근 가이드 페이지를 추가했다.
  - 현재 세션 상태 표시
  - 운영자 권한 조건 설명
  - 로컬 데모 계정 안내
  - 시드 실행 시 주의사항 안내
  - 현재 계정 로그아웃 액션 제공
- 로그인 페이지에 운영자 접근 보조 안내를 추가했다.
  - `/ops` 경로에서 넘어온 로그인 시 운영자 권한이 필요하다는 점을 바로 설명
- 홈의 운영 보조 CTA를 일반 지원 페이지가 아니라 운영자 진입 가이드로 연결했다.

### Why It Matters
- 이전에는 운영자 보드 기능이 있어도 진입 경로가 불친절해서 localhost에서 "안 되는 기능"처럼 보일 수 있었다.
- 이제는 권한 문제인지, 로그인 문제인지, 관리자 계정 부재 문제인지 사용자 입장에서 바로 이해할 수 있다.
- 포트폴리오 시연에서 운영자 보드를 보여주는 과정이 훨씬 매끄러워졌다.

### Main Files
- `src/app/ops/layout.tsx`
- `src/app/ops-access/page.tsx`
- `src/app/ops-access/OpsAccessGuide.tsx`
- `src/app/login/page.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경한 TS/TSX 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인

### Next Big Step
- 운영자 계정/시드/마이그레이션 상태를 실제 로컬 환경 기준으로 점검
- 메인 상품 리스트의 큐레이션 메시지 강화
- 남아 있는 기존 타입 에러 정리 착수
