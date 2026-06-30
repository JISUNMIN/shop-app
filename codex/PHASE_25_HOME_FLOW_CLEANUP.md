## Phase 25 - Home Flow Cleanup

### What Changed
- 홈 메인 배너를 다시 `큰 이미지가 전체 영역을 차지하는 구조`로 되돌렸다.
- 히어로 우측에 작게 떠 있던 배달/청소 썸네일 박스를 제거했다.
- 홈 프로모 영역에서 실제 없는 `렌탈 서비스` 유도를 제거했다.
- 프로모 링크를 실제 동작 기준으로 정리했다.
  - 할인: `/special-offers`
  - 배송 안내: `/shopping-info`
  - 전문가 상담: `/support`
- 할인 프로모를 눌렀을 때 이동할 수 있는 전용 할인 페이지를 추가했다.
- 홈 카테고리 스트립을 제거해서 메인과 상품 리스트의 카테고리 필터 중복을 없앴다.
- 상품 리스트 상단의 `배달로봇 1개 / 청소로봇 1개 ...` 요약 배지를 제거했다.
- `전체 상품` 섹션을 하나의 카드형 헤더 + 하나의 필터/정렬 영역으로 통합했다.
- 메인 프로모 섹션과 상품 섹션이 같은 흰 배경 톤 안에서 이어지도록 정리했다.

### Why It Matters
- 이전 홈은
  - 배너 이미지가 작게 소비되고
  - 카테고리 필터가 두 번 나오고
  - 실제 없는 렌탈 기능을 홈에서 먼저 유도하고
  - 상품 상단 정보가 중복되어
  전체 흐름이 다소 산만했다.
- 이번 수정으로 홈이 다시
  - 큰 비주얼 배너
  - 짧은 프로모 카드
  - 단일 상품 필터
  - 명확한 상품 리스트
  흐름으로 정리됐다.

### Main Files
- `src/components/common/BannerCarousel.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/app/product/ProductList.tsx`
- `src/app/special-offers/page.tsx`
- `src/app/page.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `npx tsc --noEmit` 통과
- i18n JSON 파싱 확인
- 로컬 라우트 응답 확인
  - `/` -> 200
  - `/special-offers` -> 200
  - `/login` -> 200

### Next Big Step
- 헤더를 홈 톤에 맞게 더 단정하게 리프레시
- 할인 페이지를 실제 할인 정책 데이터와 연결할지 검토
- 상품 카드/상품 상세의 시각 언어를 홈과 더 강하게 통일
