# Phase 3 - Status Transitions

## What We Finished

- 주문 상태 전이 규칙을 코드 상수로 명시
- 현재 상태에서 갈 수 있는 다음 상태 목록을 계산하는 로직 추가
- 잘못된 상태 전이를 서버에서 막는 검증 추가
- 개발 환경에서만 동작하는 주문 상태 변경 API 추가
- 주문 상세 페이지에 개발용 상태 시뮬레이터 패널 추가
- 버튼 한 번으로 아래 흐름을 직접 테스트할 수 있게 구성
  - `PENDING -> PAID`
  - `PAID -> SHIPPING`
  - `SHIPPING -> DELIVERED`
  - `PENDING|PAID -> CANCEL_REQUESTED -> REFUNDED`
  - `DELIVERED -> RETURN_REQUESTED -> RETURNED`

## Why This Matters

이제 이 프로젝트는 단순히 주문 상태를 "보여주는" 수준이 아니다.

- 상태 규칙이 코드로 명시되어 있음
- 서버가 잘못된 전이를 차단함
- 개발 중 실제 주문을 단계별로 흘려보며 검증 가능함

포트폴리오 관점에서는 아래 설명이 가능해졌다.

`주문 상태 머신을 시각화했을 뿐 아니라, 전이 제약과 시뮬레이션 도구까지 구현한 커머스 프로젝트`

## Main Files Changed

- `src/utils/orders.ts`
- `src/app/api/orders/[orderId]/route.ts`
- `src/hooks/useOrder.ts`
- `src/app/mypage/orders/[orderId]/_components/OrderStatusDebugPanel.tsx`
- `src/app/mypage/orders/[orderId]/_components/OrderDetailShell.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

## Validation Notes

- 이번 수정 범위 기준 ESLint 에러 없음
- 이번 수정 범위 기준 TypeScript 문제도 추가 확인되지 않음
- 상태 변경 API는 개발 환경에서만 허용되도록 막아두었음

## Next Big Task

다음으로 가장 가치가 큰 작업은 둘 중 하나다.

1. 관리자/운영자 전용 주문 제어 화면 만들기
2. 주문 후속 처리 자동화 강화
   - 상태 변경 시 운송장/메모/처리 시각 보강
   - 취소/반품 사유와 결과를 더 구조화
   - 주문 이벤트 히스토리를 별도 모델로 분리

현재 프로젝트 흐름상 다음 우선순위는 `관리자/운영자 전용 주문 제어 화면`이 가장 좋다.

## Resume Prompt

다음 세션에서 이렇게 말하면 바로 이어갈 수 있다.

`codex/PHASE_3_STATUS_TRANSITIONS.md 기준으로 관리자 주문 제어 화면 계속 진행해줘`
