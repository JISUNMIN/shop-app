# 🛒 Shop-App - 전자상거래 플랫폼

Next.js 15(App Router) 기반으로 설계한 전자상거래 플랫폼입니다.  
OAuth 인증, 비로그인 장바구니 유지, 주문 상태 머신 설계 등  
실제 서비스 환경에서 발생할 수 있는 사용자 흐름을 고려해 구현했습니다.

---
## 🔗 Demo

- Demo: https://shop-app-orcin-six.vercel.app
- GitHub Repository: https://github.com/JISUNMIN/shop-app
- 주요 기능: 로그인/비로그인 장바구니/찜하기, 주문/환불/반품 상태 관리, 쿠폰 적용

---

## 🚀 Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui

### Auth
- NextAuth.js v5
- Kakao OAuth
- bcryptjs (비밀번호 해싱)

### Data & State
- React Query (서버 상태 관리)
- Zustand (언어 상태 관리)
- Axios Interceptor (세션 기반 요청 처리)

### Backend / DB
- Prisma
- PostgreSQL

### i18n / UX
- i18next
- framer-motion
- Lottie

---

## 🔐 1. 인증 시스템 (NextAuth.js v5)

### 지원 인증 방식

**1) Credentials 로그인** (아이디/비밀번호)
- bcryptjs를 이용한 안전한 비밀번호 해싱
- 사용자 정보 DB 검증

**2) 카카오 OAuth 로그인**
- PrismaAdapter를 통한 자동 계정 동기화
- 신규 사용자 가입 시 **웰컴 쿠폰 자동 발급**
- 프로필 정보 자동 저장

### 핵심 구현

```typescript
// JWT Token에 사용자 정보 저장
const jwt({ token, user, account }) => {
  token.provider = account.provider; // "kakao" | "naver" | "credentials"
  token.id = user.id;
  token.userId = user.userId;
  token.phone = user.phone;
  return token;
}

// 클라이언트 세션에 토큰 정보 전달
const session({ session, token }) => {
  session.user.id = token.id;
  session.user.provider = token.provider;
  return session;
}
```

**효과:** 다양한 인증 방식 지원으로 사용자 진입장벽 최소화

---

## 🛍️ 2. 비로그인 사용자 세션 및 장바구니 관리

로그인하지 않아도 장바구니가 유지되어 구매 흐름이 끊기지 않도록 구현.

### 미들웨어 기반 세션 관리 (src/middleware.ts)

```typescript
// 비로그인 사용자: roboshop-session 쿠키로 고유 세션 생성
// 유지기간: 30일, httpOnly 쿠키로 보안 강화
```

### 장바구니 구조

| 사용자 유형 | 식별자 | 저장소 |
|----------|-------|--------|
| 로그인 | userId | DB |
| 비로그인 | sessionId | DB (쿠키로 추적) |

**효과:** 비로그인 사용자도 장바구니 데이터 보존 가능 → 전환율 향상

재방문 시에도 장바구니가 유지되도록 설계함

---

## 📦 3. 주문 시스템 및 상태 관리

### 3가지 구매 방식 지원

1. **바로 구매** - 상품 상세페이지에서 직접 주문페이지로 이동
2. **장바구니 구매** - 여러 상품 선택해서 주문
3. **비로그인 구매** - 세션 기반 장바구니로 로그인 없이 구매 가능

### 로그인/회원가입 → 주문 페이지 연동

```
1. 상품 구매 시 미로그인 상태 감지
2. 제품 정보를 URL Query로 전달 (productId, quantity, cartItems)
3. 로그인/회원가입 페이지로 이동
4. 인증 후 callbackUrl을 통해 자동으로 주문 페이지 복귀
5. 의도한 제품이 그대로 전달되어 바로 주문 진행 가능
```
인증 과정에서도 사용자의 구매 의도가 사라지지 않도록 설계함.

### 주문 정보 입력

- ✅ 배송지 주소 (기존 주소 선택 또는 신규 생성)
- ✅ 배송 메모 / 개인 메모
- ✅ 결제수단 (카드, 계좌이체, 카카오페이, 네이버페이)
- ✅ 쿠폰 적용

- ※ 실제 PG사(카카오페이/네이버페이 등) 연동은 하지 않았으며,  
- 결제 성공/실패를 가정한 **Mock 결제 로직**으로 주문 상태 흐름을 설계했습니다. 

### 주문 상태 (12가지)
- Mock 결제 결과에 따라 상태가 전이되도록 설계

```
PENDING → PAID → CONFIRMED → SHIPPING → DELIVERED
              ↓
         CANCEL_REQUESTED
              ↓
           REFUNDED
              
DELIVERED → RETURN_REQUESTED → RETURNED
```

---

## 🎁 4. 쿠폰/포인트 시스템

- **신규 사용자 웰컴 쿠폰** - 가입 시 자동 발급
- **쿠폰 적용** - 주문 시 할인 쿠폰 선택 적용

---

## 🎨 5. 인터랙션 및 애니메이션

- **기술:** Lottie 애니메이션, framer-motion
- **적용 위치:**
  - `OrderCompleteModal` - 주문 완료 시 체크 아이콘 애니메이션
  - `CartItem`, `ProductGallery` - 리스트 항목 등장 및 호버 효과
- **효과:** 주문 완료 시 시각적 피드백으로 사용자 만족도 향상

---

## ⚡ 6. 스켈레톤 로더

- **기술:** 커스텀 Skeleton 컴포넌트
- **적용 위치:** 상품 상세/목록, 장바구니, 주문 상세
- **내용:** 초기 로딩 시 실제 콘텐츠와 동일한 레이아웃 자리 표시자 표시
- **효과:** 로딩 상태 명확화 → 체감 로딩 시간 단축, CLS 최소화

---

## 💾 7. 캐싱 전략 (React Query)

### 캐싱 key 구조

```typescript
// 상품 목록
queryKey: ["products", "list", { category, search, page }]

// 상품 상세
queryKey: ["products", "detail", productId]

// 장바구니
queryKey: ["cart", "list"]

// 주문
queryKey: ["orders", "list"]
queryKey: ["orders", "detail", orderId]
```

### 캐시 무효화 전략

| 작업 | 무효화 대상 |
|-----|----------|
| 장바구니 추가/삭제 | cart 쿼리 |
| 주문 생성 | orders 쿼리 |
| 재고 변경 | products 쿼리 |

**설정:**
- `staleTime: 30초` - 30초 이내 같은 쿼리는 캐시 사용
- `retry: 1` - 실패 시 1회 재시도

**효과:** 불필요한 네트워크 요청 감소, 신속한 데이터 로드

---

## 🌍 8. 다국어 전략 (i18n)

### 구조

- **라이브러리:** i18next + react-i18next
- **지원 언어:** 한국어(ko), 영어(en)
- **상태 관리:** Zustand의 `useLangStore`

### 번역 파일 구조

```
src/i18n/
  ├── ko.json  (한국어)
  ├── en.json  (영어)
  └── i18n.ts  (설정)
```

### 사용 예시

```typescript
const { t, i18n } = useTranslation();
const lang = i18n.language as LangCode; // "ko" | "en"

// 텍스트 번역
<h1>{t("mypage.orderDetail.title")}</h1>

// 동적 번역 (제품 다국어 정보)
const productName = product.name[lang]; // ko or en
```

**적용 위치:** Header, ProductList, OrderDetail, 모든 UI 텍스트

**효과:** 원클릭 언어 전환으로 국제 사용자 지원

---

## 📱 9. 반응형 및 모바일 대응

- **기술:** TailwindCSS 반응형 유틸리티 (`sm:`, `lg:` 등), shadcn/ui
- **적용 위치:** 전체 UI (Header, 상품 그리드, 주문 페이지 등)
- **특징:**
  - 모바일/태블릿/데스크톱 환경별 레이아웃 최적화
  - shadcn/ui 재사용 컴포넌트로 일관성 있는 디자인

**예시:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 4열 */}
</div>
```

**효과:** 모든 디바이스에서 최적의 UX 제공

---

## 🔗 10. 세션 및 API 통신 관리

### Axios 인터셉터 (axiosSession)

```typescript
// 자동 설정
- x-session-id 헤더 (비로그인 사용자 추적)
- Content-Type: application/json (POST, PATCH 요청)
- 쿠키 기반 인증 (로그인 사용자)
```

### API 엔드포인트 구조

```
/api/auth/...        (인증)
/api/products/...    (상품)
/api/cart/...        (장바구니)
/api/orders/...      (주문)
/api/addresses/...   (주소)
/api/coupon/...      (쿠폰)
```

**효과:** API 통신 표준화, 중복 제거, 유지보수성 향상

---

## 📊 데이터베이스 스키마 (Prisma)

### 핵심 모델

```
User
├── Credentials (아이디/비밀번호) 또는 OAuth Provider
├── Order (주문 정보)
├── CartItem (장바구니)
├── Address (배송지)
├── UserCoupon (할인 쿠폰)
└── WishlistItem (위시리스트)

Product
├── 다국어 정보 (name, description)
├── 이미지 (images[])
├── 재고관리 (stock)
└── OrderItem (주문 상품)

Order
├── OrderItem[] (주문 상품 목록)
├── 배송정보 (ship**)
├── 결제정보 (paymentMethod, totalAmount)
└── 상태관리 (status)
```

---

## 🎯 주요 특징 요약

| 기능 | 기술 | 효과 |
|-----|-----|------|
| OAuth 로그인 | NextAuth.js + Kakao | 사용자 진입장벽 최소화 |
| 비로그인 장바구니 | 미들웨어 + 쿠키 | 전환율 향상 |
| 한 번의 클릭으로 구매 완료 | 주문 상태 관리 + UI 최적화 | UX 개선 |
| 빠른 데이터 로드 | React Query 캐싱 | 성능 최적화 |
| 글로벌 지원 | i18next | 국제화 |
| 모든 디바이스 대응 | TailwindCSS | 접근성 |
| 안전한 통신 | JWT + httpOnly 쿠키 | 보안 |

---

## 🚀 성능 최적화

- ✅ React Query를 통한 스마트 캐싱
- ✅ Skeleton 로더로 CLS 최소화
- ✅ 이미지 lazy loading
- ✅ framer-motion 초기값 설정으로 레이아웃 안정화
