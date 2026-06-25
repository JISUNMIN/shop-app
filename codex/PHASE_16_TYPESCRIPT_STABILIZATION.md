## Phase 16 - TypeScript Stabilization

### What Changed
- 기존에 누적돼 있던 주요 TypeScript 에러를 정리했다.
  - Next.js App Router 동적 API route 시그니처를 최신 형태에 맞게 수정
  - 배송지 추가/수정에서 입력용 타입과 조회용 타입을 분리
  - 주문 결제 화면에서 `주문 아이템`, `쿠폰`, `배송지` 타입 불일치 해결
  - 장바구니 포맷 유틸에 누락되어 있던 재고 필드 추가
- 주문 결제 영역의 로컬 타입 구조를 정리했다.
  - `CheckoutOrderItem`
  - `AddressPayload`
  - `AddressUpdatePayload`
- 결제 화면과 관련 섹션 컴포넌트들의 prop 타입을 실제 데이터 구조에 맞게 통일했다.

### Why It Matters
- 이전에는 기능은 동작해도 `npx tsc --noEmit` 가 실패해서 마감 완성도가 떨어지는 상태였다.
- 이제 프로젝트가 다시 타입체크를 통과하므로 이후 기능 추가나 리팩토링의 안정성이 훨씬 좋아졌다.
- 포트폴리오 관점에서도 `기능만 추가한 프로젝트`가 아니라 `타입 안정성까지 마무리한 프로젝트`로 설명할 수 있게 됐다.

### Main Files
- `src/app/api/addresses/[addressId]/route.ts`
- `src/app/api/wishlist/[productId]/route.ts`
- `src/app/order/_components/OrderShell.tsx`
- `src/app/order/_components/dialogs/AddressCreateDialog.tsx`
- `src/app/order/_components/sections/OrderItemsSection.tsx`
- `src/app/order/_components/sections/OrderBenefitsSection.tsx`
- `src/hooks/useAddress.ts`
- `src/utils/cart.ts`
- `src/types/index.ts`

### Verification
- `npx tsc --noEmit` 통과
- 변경 파일 대상 ESLint 통과

### Next Big Step
- 메인 상품 리스트의 큐레이션 메시지 강화
- 운영자 시드/마이그레이션 상태를 실제 로컬 기준으로 점검
- 포트폴리오 제출 직전 README/데모 스토리 정리
