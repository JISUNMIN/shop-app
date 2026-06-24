# Shop App Roadmap

## Goal

이 프로젝트를 단순 쇼핑몰 클론이 아니라, 아래 중 하나의 강한 스토리를 가진 포트폴리오 프로젝트로 완성한다.

- 주문 상태 머신 중심의 실서비스형 커머스
- AI 구매 도우미가 있는 로봇 특화 커머스

현재 구조를 보면 첫 번째 방향이 가장 자연스럽고 완성도 있게 밀기 좋다.

## Current Diagnosis

이미 갖춘 것

- NextAuth 기반 다중 인증
- 비회원/회원 장바구니 흐름
- 주문, 쿠폰, 배송지, 찜 기능
- 다국어 상품 데이터 구조
- 검색 자동완성
- 주문 취소/반품 요청 흐름

아직 약한 것

- 포트폴리오용 핵심 메시지가 약함
- 주문 상태 로직의 정합성이 일부 깨져 있음
- README 충돌 상태가 남아 있음
- 챗봇은 현재 FAQ 성격이 강해서 차별점으로 밀기엔 약함

## Recommended Direction

우선 방향은 아래로 고정한다.

`주문 상태 머신 중심의 로봇 커머스`

핵심 메시지:

`사용자 구매 경험뿐 아니라 주문 이후의 상태 전이, 취소/반품 요청, 쿠폰 처리까지 설계한 실서비스형 커머스 프로젝트`

## Work Order

### Phase 1. 신뢰도 복구

목표:

- 포트폴리오로 보여줄 때 바로 걸리는 문제부터 제거

할 일

- [ ] `README.md` 충돌 마커 제거 후 설명 정리
- [ ] 주문 상태 전이 버그 수정
- [ ] 결제 상태와 `paidAt` 처리 정합성 수정
- [ ] 상태 enum/실제 로직/README 설명 일치시키기

관련 파일

- `README.md`
- `src/app/api/orders/route.ts`
- `src/app/api/orders/[orderId]/claim/route.ts`
- `prisma/schema.prisma`

완료 기준

- README에 충돌 마커가 없음
- 반품 요청 시 올바른 상태로 저장됨
- 무통장 결제와 결제 완료 시점 데이터가 논리적으로 맞음

### Phase 2. 상태 머신 고도화

목표:

- 이 프로젝트의 핵심 차별점을 명확하게 만들기

할 일

- [ ] 주문 상태 전이 규칙 표 작성
- [ ] 각 상태에서 가능한 사용자 액션 정의
- [ ] 서버에서 불가능한 상태 전이 차단
- [ ] 주문 상세 페이지에 상태 타임라인 UI 추가
- [ ] 취소/반품 요청 가능 조건 UI에 반영

예시 규칙

- `PENDING -> PAID`
- `PAID -> SHIPPING`
- `SHIPPING -> DELIVERED`
- `PAID -> CANCEL_REQUESTED -> REFUNDED`
- `DELIVERED -> RETURN_REQUESTED -> RETURNED`

관련 파일 후보

- `src/app/mypage/orders/[orderId]/page.tsx`
- `src/app/mypage/orders/[orderId]/_components/`
- `src/app/api/orders/[orderId]/route.ts`
- `src/app/api/orders/[orderId]/claim/route.ts`
- `src/utils/orders.ts`

완료 기준

- 상태별 허용 액션이 명확함
- 잘못된 요청은 서버에서 막힘
- 사용자가 현재 주문이 어느 단계인지 시각적으로 이해 가능

### Phase 3. 포트폴리오 데모 강화

목표:

- 면접/시연에서 기억에 남는 한 장면 만들기

할 일

- [ ] 주문 상태 타임라인 시각 개선
- [ ] 관리자 시뮬레이터 페이지 또는 개발용 상태 변경 패널 추가
- [ ] 주문 생성부터 배송 완료/취소/반품까지 데모 시나리오 정리
- [ ] README를 “기능 목록”이 아니라 “문제 해결 스토리” 중심으로 다시 작성

완료 기준

- 데모할 때 2~3분 안에 강점이 드러남
- “왜 이 프로젝트가 그냥 쇼핑몰이 아닌지” 바로 설명 가능

### Phase 4. 선택 확장

아래는 핵심 완성 후 고려한다.

- [ ] AI 구매 도우미를 실제 상품 데이터 기반 추천으로 업그레이드
- [ ] 다국어 상품 비교 기능 추가
- [ ] 실시간 기능 필요성이 분명해지면 소켓 도입

## Socket Decision

지금은 소켓이 1순위가 아니다.

소켓은 아래 중 하나를 구현할 때 도입한다.

- 실시간 주문 상태 갱신
- 관리자-고객 실시간 상담
- 재고 실시간 반영

위 시나리오가 없으면 소켓은 기술 과시처럼 보일 수 있다.

## Next Task

다음 작업은 이것부터 시작한다.

1. `README.md` 충돌 해결
2. `src/app/api/orders/[orderId]/claim/route.ts`에서 반품 상태 버그 수정
3. `src/app/api/orders/route.ts`에서 `paymentMethod === "BANK"`일 때 `paidAt` 처리 재검토
4. 주문 상태 전이 규칙을 문서화할지, 코드 상수로 뺄지 결정

## Notes For Next Session

확인된 문제

- `README.md`는 현재 충돌 상태로 보였음
- `src/app/api/orders/[orderId]/claim/route.ts`에서 반품 요청이 `REFUNDED`로 저장됨
- `src/app/api/orders/route.ts`에서 `BANK` 결제도 `paidAt`이 바로 저장됨

다음 세션 시작 문장

`codex/PROJECT_ROADMAP.md 기준으로 Phase 1부터 진행해줘`
