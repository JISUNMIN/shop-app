## Phase 20 - Demo Data Readiness

### What Changed
- 데모 가이드 페이지에 `시연용 주문 데이터 준비 상태` 패널을 추가했다.
  - 전체 주문 수
  - 배송조회 가능한 주문 예시
  - 배송완료 주문 예시
  - 클레임 주문 예시
  - 상태별 주문 개수와 샘플 주문 번호 표시
- 개발 환경 전용 시나리오 진단 API를 추가했다.
  - `GET /api/demo/scenario-readiness`
  - 현재 로컬 DB에서 어떤 주문 상태를 실제로 시연할 수 있는지 빠르게 확인 가능
- 데모 가이드에서 샘플 주문 상세로 바로 이동할 수 있게 링크를 연결했다.
  - 고객 주문 상세
  - 운영자 상세(관리자일 때)

### Why It Matters
- 이전에는 데모 가이드가 시연 순서만 설명했고, 실제로 보여줄 만한 샘플 주문이 있는지는 따로 확인해야 했다.
- 이제는 어떤 상태의 주문이 준비되어 있는지 앱 안에서 바로 확인할 수 있어 시연 직전 점검이 훨씬 쉬워졌다.
- 포트폴리오 데모에서 “지금 실제로 보여줄 수 있는 데이터가 있는가”까지 검증되는 구조가 생겼다.

### Main Files
- `src/app/api/demo/scenario-readiness/route.ts`
- `src/app/demo-guide/DemoGuidePage.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인
- `npx tsc --noEmit` 통과

### Next Big Step
- README 최종 정리
- 실제 커밋/브랜치/배포 준비
- 시연용 주문 데이터가 부족하면 최소 데모 데이터 보강 전략 검토
