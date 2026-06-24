## Phase 9 - Operator Order Detail

### What Changed
- 운영자 전용 주문 상세 조회 API를 추가했다.
  - `GET /api/ops/orders/[orderId]`
  - 고객 정보, 배송지, 취소/반품 사유, 주문 상품, 전체 이벤트 로그까지 포함한다.
- 운영자 상세 전용 훅을 만들었다.
  - `src/hooks/useOpsOrderDetail.ts`
  - 상세 조회와 상태/배송 정보 수정 mutation을 한 곳에서 관리한다.
- `/ops/orders/[orderId]` 운영자 상세 페이지를 만들었다.
  - 주문 흐름 타임라인
  - 상품 목록
  - 고객 정보
  - 배송지 정보
  - 취소/반품 접수 정보
  - 상태 전환 액션
  - 배송 정보 수정
  - 전체 이벤트 로그
- 운영 보드(`/ops/orders`)에서 각 주문의 운영 상세 페이지로 진입할 수 있도록 연결했다.

### Why It Matters
- 이제 운영 영역이 단순 목록 보드에서 끝나지 않고, 주문 하나를 깊게 처리하는 실제 업무 화면까지 갖추게 됐다.
- 포트폴리오 설명에서 “고객 쇼핑몰 + 운영 보드 + 운영 상세 콘솔” 구조를 이야기할 수 있다.
- 이후 클레임 승인 플로우, 내부 메모 체계, 담당자 배정 같은 기능을 붙이기 쉬워졌다.

### Main Files
- `src/app/api/ops/orders/[orderId]/route.ts`
- `src/hooks/useOpsOrderDetail.ts`
- `src/app/ops/orders/[orderId]/page.tsx`
- `src/app/ops/orders/page.tsx`
- `src/types/index.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Next Big Step
- 운영자 내부 메모를 이벤트 로그와 분리해 구조화
- 담당자 배정/우선순위/처리 SLA 필드 추가
- 클레임 전용 상세 액션(환불 승인, 회수 완료, 고객 안내 템플릿) 확장
