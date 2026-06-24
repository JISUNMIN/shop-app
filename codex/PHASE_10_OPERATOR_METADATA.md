## Phase 10 - Operator Metadata

### What Changed
- 주문 모델에 운영 메타데이터를 추가했다.
  - `assignedOperator`
  - `priority`
  - `slaDueAt`
  - `internalMemo`
- 운영 보드(`/ops/orders`)에서 주문 카드마다 아래 항목을 바로 수정할 수 있게 만들었다.
  - 담당자
  - 우선순위
  - SLA 마감 시각
  - 내부 메모
- 운영 보드 요약 KPI를 확장했다.
  - 긴급 우선 주문 수
  - SLA 초과 주문 수
  - 미배정 주문 수
- 운영 상세(`/ops/orders/[orderId]`)에서도 같은 메타데이터를 깊게 관리할 수 있게 연결했다.
- 운영 메타데이터 변경도 이벤트 로그에 기록되도록 API에 반영했다.

### Why It Matters
- 이제 운영 화면이 단순 상태 변경 툴이 아니라 실제 업무 배분/우선순위 관리 도구처럼 보인다.
- 포트폴리오에서 “주문 처리 + 운영 메타 + SLA 개념”까지 설계한 서비스로 설명할 수 있다.
- 다음 단계에서 담당자별 큐, 우선순위 필터, 클레임 SLA 관리 같은 기능으로 자연스럽게 확장 가능하다.

### Main Files
- `prisma/schema.prisma`
- `prisma/migrations/20260623042000_add_order_ops_metadata/migration.sql`
- `src/lib/opsOrders.ts`
- `src/app/api/ops/orders/[orderId]/route.ts`
- `src/hooks/useOpsOrders.ts`
- `src/hooks/useOpsOrderDetail.ts`
- `src/app/ops/orders/page.tsx`
- `src/app/ops/orders/[orderId]/page.tsx`
- `src/types/index.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Next Big Step
- 담당자/우선순위 기준 정렬 및 필터 강화
- SLA 임박/초과 전용 큐 만들기
- 클레임 전용 액션 흐름과 내부 메모 이력 분리
