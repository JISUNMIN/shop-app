# Phase 2 - Status Timeline

## What We Finished

- 주문 상태 규칙을 화면에서 재사용할 수 있게 정리
- 주문 상세 API에 상태 관련 시점 데이터를 추가
  - `paidAt`
  - `deliveredAt`
  - `cancelRequestedAt`
  - `refundedAt`
  - `returnRequestedAt`
  - `returnedAt`
- 주문 상세 페이지에 `주문 상태 타임라인` 섹션 추가
- 메인 주문 플로우를 단계형 카드로 노출
  - `PENDING`
  - `PAID`
  - `SHIPPING`
  - `DELIVERED`
- 실제 발생한 주문 이벤트를 세로 타임라인으로 노출
- 현재 상태에서 가능한 고객 액션을 표시
  - 취소 가능
  - 반품 가능
  - 현재 가능한 요청 없음

## Why This Matters

이전에는 주문 상태가 배지와 일부 버튼 조건 정도로만 드러났다.

이제는 아래가 명확해졌다.

- 시스템이 주문을 어떤 단계로 보고 있는지
- 고객이 지금 어떤 액션을 할 수 있는지
- 주문 이후 어떤 이벤트가 실제로 발생했는지

포트폴리오 관점에서는 단순 쇼핑몰이 아니라

`주문 상태와 후속 액션을 설계한 서비스형 커머스`

로 설명하기 쉬워졌다.

## Main Files Changed

- `src/app/api/orders/[orderId]/route.ts`
- `src/app/mypage/orders/[orderId]/_components/OrderStatusTimeline.tsx`
- `src/app/mypage/orders/[orderId]/_components/OrderDetailShell.tsx`
- `src/utils/orders.ts`
- `src/types/index.ts`
- `src/i18n/ko.json`
- `src/i18n/en.json`

## Validation Notes

- 이번 수정 범위 파일 기준 ESLint 에러 없음
- 이번 수정 범위 파일 기준 TypeScript 에러도 추가로 확인되지 않음
- 레포 전체 기준 기존 타입 부채는 여전히 남아 있을 수 있음

## Next Big Task

다음 단계는 `상태 전이 제어를 서버/개발 도구 수준까지 끌어올리는 것`이다.

우선순위

1. 상태 전이 규칙을 더 명시적인 테이블로 정리
2. 주문 상태 변경 전용 서버 로직 추가
3. 개발용 주문 상태 시뮬레이터 페이지 추가
4. 취소/반품 요청 이후 후속 상태 처리 흐름 추가
   - `CANCEL_REQUESTED -> REFUNDED`
   - `RETURN_REQUESTED -> RETURNED`

## Resume Prompt

다음 세션에서 이렇게 말하면 바로 이어갈 수 있다.

`codex/PHASE_2_STATUS_TIMELINE.md 기준으로 다음 상태 전이 기능 계속 진행해줘`
