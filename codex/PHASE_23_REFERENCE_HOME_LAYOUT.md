## Phase 23 - Reference Home Layout

### What Changed
- 사용자가 준 `robo_shop_redesign_v2.html` 시안을 참고해 홈 메인 레이아웃을 다시 구성했다.
- 상단 히어로를 `좌측 메시지 + 우측 썸네일 프리뷰` 구조로 정리했다.
- 히어로 아래에 3칸 프로모 배너 스트립을 추가했다.
  - 특가
  - 렌탈
  - 전문가 매칭
- 카테고리 진입 영역을 별도 스트립처럼 보이게 재구성했다.
- 상품 리스트 상단도 과한 설명형 박스 대신 단정한 섹션 헤더 구조로 정리했다.

### Why It Matters
- 이전 홈은 기능 설명을 줄였어도 여전히 “기획 문구가 많은 커머스 화면”에 가까웠다.
- 이번 수정은 참고 시안처럼
  - 큰 히어로
  - 짧은 프로모 카드
  - 카테고리 스트립
  - 상품 섹션
  흐름으로 나눠서 더 쇼핑몰다운 인상을 주는 데 집중했다.

### Main Files
- `src/components/common/BannerCarousel.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/app/product/ProductList.tsx`
- `src/app/page.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `npx tsc --noEmit` 통과
- i18n JSON 파싱 확인

### Next Big Step
- 헤더도 참고 시안 톤에 맞게 더 가볍고 정돈된 구조로 재정리
- 상품 카드 상세 스타일을 현재보다 더 플랫하고 갤러리형으로 맞추기
- 배너 이미지 리소스가 레이아웃과 더 잘 맞도록 보정 또는 교체 검토
