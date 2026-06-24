## Phase 8 - Live Operator Stream

### What Changed
- 운영 주문 대시보드용 공통 데이터 빌더를 분리했다.
  - `src/lib/opsOrders.ts`
  - 일반 조회 API와 실시간 스트림이 같은 대시보드 계산 로직을 공유한다.
- SSE 기반 실시간 운영 스트림을 추가했다.
  - `GET /api/ops/orders/stream`
  - 5초 주기로 주문 상태/운송 정보/이벤트 변경을 감지한다.
  - 변경이 있으면 `dashboard-update` 이벤트를 푸시하고, 없으면 heartbeat를 보낸다.
- 운영 보드 클라이언트가 EventSource로 스트림을 구독하도록 연결했다.
  - 연결 상태: `idle / connecting / live / error`
  - 실시간 이벤트를 받으면 React Query 캐시를 무효화해서 최신 데이터를 당겨온다.
- 운영 화면 상단에 실시간 연결 상태 배지와 SSE 활성 상태 표시를 추가했다.

### Why It Matters
- 이제 운영 보드가 단순 폴링 화면이 아니라 실시간 운영 도구처럼 보인다.
- 포트폴리오 설명에서 “고객용 커머스 + 운영자 워크스페이스 + 서버 푸시 기반 갱신” 구조를 말할 수 있다.
- 이후 WebSocket, 알림센터, 운영 히스토리 상세 페이지로 확장하기 좋은 기반이 생겼다.

### Main Files
- `src/lib/opsOrders.ts`
- `src/app/api/ops/orders/route.ts`
- `src/app/api/ops/orders/stream/route.ts`
- `src/hooks/useOpsOrders.ts`
- `src/app/ops/orders/page.tsx`
- `src/types/index.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Next Big Step
- 주문 변경 시점에만 푸시되는 진짜 이벤트 드리븐 구조로 개선
- 운영자 주문 상세 페이지 분리
- 실시간 알림 패널과 우선순위 큐(환불/반품/출고지연) 추가
