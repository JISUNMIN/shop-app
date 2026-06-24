# Phase 1 - Order Foundation

## What We Finished

- 주문 생성 시 클라이언트 금액을 그대로 믿지 않고, 서버에서 상품 가격 기준으로 다시 계산하도록 수정
- 쿠폰 유효성 검사와 할인 금액 계산을 주문 생성 API 안으로 이동
- 무통장 결제는 `PENDING`, 즉시 결제는 `PAID`로 생성되도록 정리
- 무통장 결제 주문은 `paidAt`이 바로 찍히지 않도록 수정
- 반품 요청이 잘못 `REFUNDED`로 들어가던 버그를 `RETURN_REQUESTED`로 수정
- 취소/반품 요청 가능 상태를 서버에서 한 번 더 검증하도록 보강
- 주문 상세 페이지의 금액 표시를 실제 저장 의미와 맞게 정리
- README를 현재 프로젝트 방향에 맞는 포트폴리오용 설명으로 재작성
- 주문 상태 유틸과 타입에서 예전 상태명 흔적을 정리

## Why This Matters

이번 단계의 핵심은 `주문 데이터의 신뢰도 복구`다.

이전에는 아래 문제가 있었다.

- 주문 금액을 클라이언트 값에 의존
- 무통장 주문도 결제 완료 시각이 바로 저장됨
- 반품 요청이 환불 완료 상태로 저장됨
- 문서와 실제 코드가 서로 다른 상태 체계를 설명함

이제는 포트폴리오에서 최소한 아래 설명이 가능하다.

`주문 생성과 상태 전이를 서버 기준으로 통제하는 커머스 흐름을 설계했다`

## Main Files Changed

- `src/app/api/orders/route.ts`
- `src/app/api/orders/[orderId]/route.ts`
- `src/app/api/orders/[orderId]/claim/route.ts`
- `src/app/mypage/orders/[orderId]/_components/OrderDetailShell.tsx`
- `src/app/mypage/orders/[orderId]/_components/OrderClaimDialog.tsx`
- `src/utils/orders.ts`
- `src/types/index.ts`
- `README.md`

## Validation Notes

- 수정 범위 대상 ESLint 확인 결과 에러는 정리됨
- 남아 있는 경고는 주로 기존 레포 전반의 `<img>` 사용 및 일부 미사용 변수 성격
- 전체 레포 기준 TypeScript 오류는 여전히 남아 있음
  - 이건 이번 주문 흐름 수정만의 문제라기보다 기존 전역 타입 부채가 포함됨

## Next Big Task

다음 큰 기능은 `주문 상태 머신 시각화 + 액션 제어 강화`로 진행한다.

우선순위

1. 주문 상태 전이 규칙을 상수 또는 테이블로 명시
2. 상태별 허용 액션을 서버/클라이언트에서 함께 사용
3. 주문 상세에 상태 타임라인 UI 추가
4. 개발용 주문 상태 변경 시뮬레이터 또는 관리자용 테스트 패널 추가

## Resume Prompt

다음 세션에서 이렇게 말하면 바로 이어갈 수 있다.

`codex/PHASE_1_ORDER_FOUNDATION.md 기준으로 Phase 2 주문 상태 머신 작업 이어서 진행해줘`
