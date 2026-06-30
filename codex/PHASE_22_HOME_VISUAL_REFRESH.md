## Phase 22 - Home Visual Refresh

### What Changed
- 메인 첫 화면의 비주얼 구조를 전면 수정했다.
- 배너 영역을 단순 이미지 슬라이더에서 에디토리얼 히어로 섹션으로 바꿨다.
  - 좌측: 핵심 메시지, CTA, 메트릭
  - 우측: 실제 배너 이미지가 보이는 캐러셀
- 홈 상단 배경을 단색 흰 바탕에서 벗어나, 섹션 간 톤이 이어지는 레이어드 배경으로 재구성했다.
- 배너 아래 안내 섹션도 흰 박스 나열형에서 벗어나, 따뜻한 컬러 카드 + 다크 포커스 카드 조합으로 바꿨다.
- 상품 컬렉션 상단 영역은 그리드 패턴, 컬러 포인트, 카드 톤을 추가해 단조로운 정보 박스 느낌을 줄였다.
- 상품 카드도 그림자, 표면 톤, 타이포 대비를 조정해 조금 더 진열형 카드처럼 보이게 정리했다.

### Why It Matters
- 이전 화면은 정보가 정리되어 있어도 시각적 위계가 약해서 “뭘 개선했는지 모르겠다”는 반응이 나올 수밖에 없는 상태였다.
- 이번 수정은 기능 설명이 아니라 첫 인상 자체를 바꾸는 작업이다.
- 메인을 보는 순간
  - 쇼핑몰처럼 보이는가
  - 배너와 아래 섹션이 하나의 톤으로 연결되는가
  - 흰 박스만 쌓인 평면적인 화면이 아닌가
  이 세 가지를 우선 해결하는 데 집중했다.

### Main Files
- `src/app/page.tsx`
- `src/components/common/BannerCarousel.tsx`
- `src/components/common/HomeCapabilityShowcase.tsx`
- `src/app/product/ProductList.tsx`
- `src/app/product/ProductCard.tsx`
- `src/i18n/ko.json`
- `src/i18n/en.json`

### Verification
- 변경 파일 대상 ESLint 통과
- `npx tsc --noEmit` 통과
- `ko.json`, `en.json` JSON 파싱 확인

### Next Big Step
- 메인 비주얼 톤을 기준으로 상품 상세 / 장바구니 / 주문 화면까지 같은 디자인 언어로 맞추기
- 헤더와 검색바도 현재보다 브랜드 톤이 살아나도록 한 단계 더 정리
- 필요하면 배너 이미지를 교체하거나 보정해서 지금 만든 히어로 레이아웃과 더 잘 맞게 다듬기
