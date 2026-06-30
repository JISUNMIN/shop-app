## Phase 18 - Ops Demo Readiness

### What Changed
- `/ops-access`에 로컬 데모 준비 상태를 확인하는 진단 패널을 추가했다.
  - DB 연결 가능 여부
  - `ops_admin` 관리자 계정 존재 여부
  - 상품/주문/이벤트 시드 데이터 존재 여부
  - 운영 메타데이터 컬럼 조회 가능 여부
- 개발 환경 전용 진단 API를 추가했다.
  - `GET /api/demo/ops-readiness`
  - 운영 보드 시연 전에 로컬 환경 상태를 빠르게 점검할 수 있도록 구성
- 운영자 접근 가이드가 이제 `설명 페이지`를 넘어 `실제 데모 점검 도구` 역할도 하게 됐다.

### Why It Matters
- 이전에는 운영자 접근 흐름은 좋아졌지만, 실제 DB 상태가 데모 가능한지 여부는 사용자가 직접 추측해야 했다.
- 이제는 관리자 계정 누락, 시드 데이터 부족, DB 문제 같은 시연 방해 요소를 화면에서 바로 확인할 수 있다.
- 포트폴리오 데모 직전에 `지금 이 환경이 바로 보여줄 수 있는 상태인지`를 빠르게 판단할 수 있게 됐다.

### Main Files
- `src/app/api/demo/ops-readiness/route.ts`
- `src/app/ops-access/OpsAccessGuide.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인
- `npx tsc --noEmit` 통과

### Next Big Step
- README와 데모 시나리오 최종 정리
- 홈/상품 카드의 비교 포인트 강화 여부 검토
- 운영자/고객 시연용 실제 샘플 계정과 데이터 최종 점검
