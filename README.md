# 프로젝트 주요 기술 및 전략

## 1. 인터랙션 및 애니메이션

- **기술:** Lottie 애니메이션, framer-motion
- **적용 위치:**
  - `OrderCompleteModal` (Lottie 애니메이션 + framer-motion)
  - `CartItem`, `ProductGallery` 등 (framer-motion)
- **내용:** 체크 아이콘 및 버튼 등장, 리스트 항목 애니메이션 등 마이크로 인터랙션 구현
- **효과:** 주문 완료 시 시각적 피드백 제공 → 사용자가 행동 완료를 명확히 인지
- **UX 개선:** 앱과의 상호작용 경험을 풍부하게 하여 전반적인 UX 향상

---

## 2. 스켈레톤 로더

- **기술:** 커스텀 Skeleton 컴포넌트 (`ProductDetailSkeleton`, `ProductGridSkeleton`, `CartSkeleton`)
- **적용 위치:** 상품 상세 페이지, 상품 목록 페이지, 장바구니
- **내용:** 초기 로딩 시 레이아웃 기반 자리 표시자 표시
- **효과:** 로딩 상태 명확화, 체감 로딩 시간 단축

---

## 3. LCP / CLS 개선

- **기술:** Next.js `Image`, framer-motion, 고정 레이아웃
- **적용 위치:** 상품 카드, 그리드 레이아웃
- **내용:**
  - Skeleton 로더 적용 → 콘텐츠 렌더 전 자리 확보
  - framer-motion 초기 opacity, y-offset, scale 값 지정 → CLS 최소화
  - 이미지 aspect ratio 및 width/height 명시, 카드/그리드 고정 크기
- **효과:** LCP 지연 최소화, CLS 안정화
- **예시 이미지:**
  ![Lighthouse Before](./lighthouse-before.png)
  ![Lighthouse After](./lighthouse-after.png)

---

## 4. 캐싱 전략

- **기술:** React Query (`QueryClientProvider`, `useProducts`, `useCart`)
- **적용 위치:** 상품 목록, 상품 상세, 장바구니
- **내용:**
  - 상품 목록 조회: `queryKey = ["products", "list", params]`
  - 상품 상세 조회: `queryKey = ["products", "detail", targetId]`
  - 장바구니: `queryKey = ["cart"]`
- **무효화 기준:**
  - 장바구니 변경 시 → 장바구니 쿼리 무효화
  - 재고 변경 시 → 상품 목록 쿼리 무효화
- **옵션:** `staleTime: 30초`, `retry: 1`
- **효과:**
  - 불필요한 네트워크 요청 감소
  - 빠른 데이터 로드로 UX 향상
  - 데이터 변경 시점에 맞는 정확한 캐시 무효화로 일관성 있는 데이터 제공

---

## 5. 다국어 전략 (i18n)

- **기술:** `useTranslation()` 훅, `en.json` / `ko.json`
- **적용 위치:** `Header`, `ProductList`, `CartPage`, `OrderCompleteModal`
- **구조:**
  - `TranslationProvider`를 최상위 레이아웃(`layout.tsx`)에 적용 → 전체 컴포넌트에서 번역 가능
  - 언어별 JSON 파일 사용
- **언어 상태 관리:**
  - `useLangStore`에서 `lang` 값(`ko` / `en`) 관리
  - 사용자가 선택한 언어에 따라 번역 텍스트 실시간 반영
- **번역 키 규칙:**
  - 단순 키(flat 구조, dot notation 없음)
  - 컴포넌트명 또는 페이지명 기준 네이밍
  - 새 페이지/컴포넌트 추가 시 JSON 키 추가 후 `useTranslation()` 사용

---

## 6. 반응형 및 모바일 대응

- **기술:** TailwindCSS 반응형 유틸리티 (`sm:`, `lg:` 등), shadcn/ui 컴포넌트
  **적용 위치:** 전체 UI, 주요 컴포넌트 (`Header`, 상품 그리드, 버튼, 카드 등)
- **내용:**
- 모바일/데스크톱 환경에 맞춰 UI 유연하게 변화\
- shadcn/ui의 재사용 가능한 컴포넌트를 활용하여 빠른 UI 구성과 일관성 유지
- **효과:** 모바일 퍼스트 설계 지원, 유지보수 용이, 디자인 일관성 확보

---

## 7. 세션 및 API 통신 관리

- **기술:** `axiosSession` 인터셉터
- **적용 위치:** 모든 API 요청 (상품, 장바구니, 주문 등)
- **내용:**
  - `x-session-id` 헤더 자동 추가 → 익명 사용자 장바구니 사용 가능
  - POST, PATCH 등 GET 외 요청 시 `Content-Type: application/json` 자동 설정
- **효과:** API 통신 표준화, 재사용성 향상
