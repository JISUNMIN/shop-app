## Phase 24 - Home And Login Polish

### What Changed
- 홈 히어로에서 우측 `배달로봇 / 청소로봇` 썸네일 박스를 제거했다.
- 대신 해당 이미지를 히어로 우측 배경 콜라주처럼 배치해 더 자연스럽게 통합했다.
- 상품 리스트 상단의 중복된 `전체 상품` 섹션을 하나로 합쳤다.
- 상품 헤더와 필터 영역의 역할을 정리해 메인 통일감을 높였다.
- 로그인 페이지에 `고객 데모 계정 / 운영자 데모 계정` 선택 UI를 추가했다.
  - 선택 시 아이디와 비밀번호 자동 입력
  - 운영자 데모: `ops_admin / admin1234!`
  - 고객 데모: `demo_user / demo1234!`
- 고객 데모 계정을 시드에 추가했고, 현재 로컬 DB에도 바로 사용할 수 있게 반영했다.
- 현재 DB에 누락되어 있던 `public.users.role` 컬럼도 코드 기대치에 맞게 보정했다.

### Why It Matters
- 이전 히어로는 배경과 썸네일 카드가 분리되어 보여 상단 비주얼이 조금 끊겨 보였다.
- 상품 섹션은 제목 블록이 두 번 나와 정보 구조가 겹쳐 보였다.
- 로그인은 운영자 보드를 보려면 어떤 계정으로 들어가야 하는지 번거로웠다.
- 이번 정리로
  - 홈은 더 일관되게 보이고
  - 상품 섹션은 덜 중복되며
  - 운영자/고객 데모 진입은 훨씬 빠르게 재현 가능해졌다.

### Main Files
- `src/components/common/BannerCarousel.tsx`
- `src/app/product/ProductList.tsx`
- `src/app/login/page.tsx`
- `prisma/seed.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `npx tsc --noEmit` 통과
- `ko.json`, `en.json` JSON 파싱 확인
- 현재 DB에 데모 계정 반영

### Next Big Step
- 헤더 디자인을 홈 레이아웃 톤에 맞게 더 가볍고 정돈된 형태로 리프레시
- 상품 카드와 상세 페이지까지 홈 시안 톤에 맞춰 통일
- 운영자 진입 가이드와 로그인 페이지 연결 문구를 더 짧고 명확하게 다듬기
