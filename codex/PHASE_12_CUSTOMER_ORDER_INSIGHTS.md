## Phase 12 - Customer Order Insights

### What Changed
- 고객 주문 목록을 단순 리스트에서 `상태 판단형 주문 보드`로 확장했다.
  - 전체 / 진행중 / 완료 / 클레임 요약 카드 추가
  - 주문별 진행률 바 추가
  - 주문별 핵심 포인트 카드 추가
- 고객 주문 상세 상단에 `주문 인사이트 패널`을 추가했다.
  - 현재 주문 진행률
  - 현재 배송 단계
  - 이벤트 개수
  - 지금 할 수 있는 고객 액션
  - 운송장 준비 상태
- 주문 상태를 설명하는 고객용 요약 로직을 공통 유틸로 분리했다.
  - 상태별 진행률 계산
  - 상태별 주의 포인트 문구
  - 상태별 고객 액션 문구

### Why It Matters
- 이제 마이페이지에서도 이 프로젝트가 그냥 상품만 파는 쇼핑몰이 아니라, `주문 이후 경험`까지 설계한 서비스처럼 보인다.
- 운영자 화면에 들어가지 않아도 상태 머신과 주문 흐름의 강점이 사용자 화면에서 드러난다.
- 포트폴리오 설명 시 `고객용 주문 경험`과 `운영용 처리 경험`을 한 세트로 말할 수 있게 됐다.

### Main Files
- `src/app/mypage/tabs/OrdersTab.tsx`
- `src/app/mypage/orders/[orderId]/_components/OrderDetailShell.tsx`
- `src/utils/orders.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경한 TS/TSX 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인
- 전체 `tsc --noEmit` 는 기존 프로젝트의 다른 파일들에서 이미 존재하던 타입 에러로 인해 실패

### Next Big Step
- 고객 주문 상세의 `배송조회` 버튼을 실제 추적 경험으로 연결
- 운영자 진입 문제를 줄이기 위해 로컬 데모용 관리자 접근 흐름 정리
- 홈/상품 화면에서도 이 프로젝트 강점이 보이도록 `주문 운영형 커머스` 메시지 강화
