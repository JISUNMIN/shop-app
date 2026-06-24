## Phase 13 - Home Positioning

### What Changed
- 메인 홈에 `프로젝트 정체성 섹션`을 추가했다.
  - 이 프로젝트가 단순 상품 진열 쇼핑몰이 아니라 `주문 이후 운영 흐름`까지 설계한 커머스라는 점을 첫 화면에서 바로 설명
  - 주문 상태 머신, 클레임 흐름, 운영 대시보드 축을 카드 형태로 강조
- 홈에서 바로 이어지는 CTA를 추가했다.
  - 고객 기준: `주문 경험 보기`
  - 운영자 기준: `운영 보드 열기`
  - 일반 사용자 기준 보조 경로: `지원 흐름 보기`
- 포트폴리오 메시지를 위한 정적 proof 칩과 핵심 지표를 추가했다.
  - `8단계 상태 머신`
  - `취소·반품 흐름`
  - `실시간 대시보드`
  - `고객 타임라인 / 실시간 스트림 / SLA 큐`

### Why It Matters
- 이전에는 홈이 배너와 상품 목록 중심이라 localhost 첫인상이 일반 쇼핑몰처럼 보였다.
- 이제는 메인에서부터 `운영형 커머스`라는 메시지가 드러나서, 사용자나 면접관이 프로젝트 성격을 더 빨리 이해할 수 있다.
- 고객 화면과 운영 화면을 연결하는 포트폴리오 스토리가 홈에서 바로 시작된다.

### Main Files
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/app/page.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- `src/app/page.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`

위 파일 대상 ESLint 통과

- `ko.json`, `en.json` JSON 파싱 확인

### Next Big Step
- 배송조회 버튼을 실제 추적 경험으로 연결
- 운영자 로컬 데모 접근 흐름 정리
- 홈 아래 상품 리스트도 `운영형 로봇 커머스` 메시지에 맞게 큐레이션 강화
