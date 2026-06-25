## Phase 14 - Tracking Experience

### What Changed
- 고객 주문 상세의 `배송조회` 버튼을 실제 동작하는 추적 경험으로 확장했다.
  - 전용 배송조회 다이얼로그 추가
  - 현재 배송 상태 / 주문 상태 / 택배사 / 운송장 정보 표시
  - 운송장 번호 복사 기능 추가
  - 외부 배송조회 열기 기능 추가
- 배송 상태에 따라 고객에게 보여줄 안내 문구를 분기했다.
  - 배송 전
  - 출고 준비
  - 배송중
  - 배송 완료
  - 취소/환불/반품 상태
- 배송조회 관련 로직을 별도 유틸로 분리했다.
  - 택배사 + 운송장 기반 외부 조회 URL 생성
  - 상태별 추적 인사이트 생성

### Why It Matters
- 이전에는 `배송조회` 버튼이 사실상 비어 있는 액션에 가까워 체감 가치가 낮았다.
- 이제 고객은 주문 상세에서 바로 운송장 정보를 복사하거나 외부 조회로 이어질 수 있어 실제 사용성이 높아졌다.
- 마이페이지 주문 경험이 `상태 확인`에서 `즉시 행동 가능한 주문 관리` 쪽으로 한 단계 올라갔다.

### Main Files
- `src/app/mypage/orders/[orderId]/_components/OrderTrackingDialog.tsx`
- `src/app/mypage/orders/[orderId]/_components/OrderDetailShell.tsx`
- `src/utils/shippingTracking.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경한 TS/TSX 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인

### Next Big Step
- 운영자 로컬 데모 접근 흐름 정리
- 배송 상태를 실시간으로 반영하는 UX 검토
- 상품/홈 화면의 큐레이션과 운영 스토리 연결 강화
