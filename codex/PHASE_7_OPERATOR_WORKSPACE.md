## Phase 7 - Operator Workspace

### What Changed
- 운영자 권한 개념을 추가했다.
  - `User.role` 필드와 `UserRole` enum을 도입했다.
  - 세션/JWT에 role 정보를 실어 클라이언트와 서버에서 모두 접근 제어가 가능해졌다.
- 운영자 전용 주문 API를 분리했다.
  - `GET /api/ops/orders`: 주문 목록, 상태별 카운트, 오늘 주문 수, 출고 지연 수를 포함한 대시보드 응답
  - `PATCH /api/ops/orders/[orderId]`: 운영자 전용 상태 변경/배송 정보 수정
- `/ops/orders` 전용 운영 대시보드를 만들었다.
  - KPI 카드
  - 자동 새로고침 기반 라이브 보드
  - 상태/검색 필터
  - 주문별 상태 전이, 배송 정보 편집, 운영 메모 입력
  - 최근 이벤트 로그 확인
- 관리자 로그인 시 헤더에서 운영 보드로 바로 이동할 수 있게 했다.

### Why It Matters
- 이제 프로젝트가 단순 고객용 쇼핑몰이 아니라 운영 툴까지 설계된 서비스처럼 보인다.
- 고객용 API와 운영용 API가 분리되어 포트폴리오에서 권한/도메인 분리 설계를 설명하기 좋아졌다.
- 실시간 소켓을 붙이기 전 단계로, 자동 갱신 기반의 운영 대시보드를 먼저 갖췄다.

### Main Files
- `prisma/schema.prisma`
- `prisma/migrations/20260623023000_add_user_role/migration.sql`
- `prisma/seed.ts`
- `src/auth.ts`
- `src/lib/operatorAuth.ts`
- `src/lib/orderOperations.ts`
- `src/app/api/ops/orders/route.ts`
- `src/app/api/ops/orders/[orderId]/route.ts`
- `src/app/ops/layout.tsx`
- `src/app/ops/orders/page.tsx`
- `src/hooks/useOpsOrders.ts`
- `src/components/layout/Header.tsx`

### Demo Note
- 로컬 시드 기준 운영자 계정:
  - `userId`: `ops_admin`
  - `password`: `admin1234!`
- 시드를 다시 실행해야 계정이 만들어진다.

### Next Big Step
- 폴링 기반 갱신을 넘어 SSE 또는 WebSocket 기반 실시간 주문 스트림 추가
- 운영자 주문 상세 페이지 분리
- 운영 메모/클레임 처리 이력의 필드 구조 고도화
