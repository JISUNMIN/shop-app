## Phase 6 - Operator Guardrails

### What Changed
- 주문 운영 보드에서 상태 전환에 필요한 조건을 화면과 서버에 함께 반영했다.
- `SHIPPING`, `DELIVERED` 전환 전에는 택배사와 운송장 번호가 필요하도록 막았다.
- `REFUNDED`, `RETURNED` 전환 전에는 운영 메모를 필수로 받아 이벤트 로그에 남기도록 만들었다.
- 상태별 요구사항을 `src/utils/orders.ts`의 공통 규칙으로 정리해서 UI와 API가 같은 기준을 쓰게 했다.

### Why It Matters
- 단순 쇼핑몰 CRUD가 아니라 주문 상태 머신과 운영 규칙을 설계한 프로젝트라는 점이 더 잘 드러난다.
- 나중에 실시간 소켓, 관리자 권한 분리, 운영 대시보드 확장 같은 기능을 붙일 때 기준점이 된다.
- 이벤트 로그에 운영 메모가 남아서 “왜 이 상태가 되었는지” 추적 가능성이 좋아졌다.

### Main Files
- `src/app/dev/orders/page.tsx`
- `src/app/api/orders/[orderId]/route.ts`
- `src/hooks/useOrder.ts`
- `src/utils/orders.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Next Big Step
- 운영자/관리자 전용 영역 분리
- 실시간 주문 이벤트 반영
- 주문별 액션 히스토리 시각화 강화
