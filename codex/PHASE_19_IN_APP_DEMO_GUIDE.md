## Phase 19 - In-App Demo Guide

### What Changed
- 앱 안에서 바로 볼 수 있는 데모 가이드 페이지를 추가했다.
  - `/demo-guide`
  - 고객 시연 흐름
  - 운영자 시연 흐름
  - 자주 열어볼 핵심 경로
  - 설명 포인트 정리
- 홈 포지셔닝 섹션에서 데모 가이드로 바로 이동할 수 있게 연결했다.
- 푸터에도 `데모 가이드` 링크를 추가해 접근성을 높였다.

### Why It Matters
- 아직 README를 정리하지 않아도, 앱 안에서 바로 시연 순서를 따라갈 수 있게 됐다.
- 포트폴리오 데모 시 어떤 화면을 어떤 순서로 보여줄지 고민하는 시간을 줄일 수 있다.
- 고객 경험, 운영 경험, 접근/준비 상태까지 하나의 스토리로 묶어 설명하기 쉬워졌다.

### Main Files
- `src/app/demo-guide/page.tsx`
- `src/app/demo-guide/DemoGuidePage.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/components/layout/Footer.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `ko.json`, `en.json` JSON 파싱 확인
- `npx tsc --noEmit` 통과

### Next Big Step
- README 최종 정리
- 시연용 샘플 계정/데이터 실제 점검
- 커밋/브랜치 정리 후 배포 또는 제출 준비
