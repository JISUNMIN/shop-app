// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();

  // 샘플 로봇 상품 데이터
  const products = [
    {
      name: { ko: "코지모 AI 반려로봇", en: "Cozimo AI Companion Robot" },
      price: 899000,
      description: {
        ko: "감정 인식과 대화가 가능한 귀여운 AI 반려로봇. 외로움을 달래주는 완벽한 친구입니다.",
        en: "A cute AI companion robot capable of emotion recognition and conversation. Perfect friend to cure loneliness.",
      },
      images: [
        "https://images.unsplash.com/photo-1559715541-d4fc97b8d6dd?w=500",
        "https://images.unsplash.com/photo-1659018966820-de07c94e0d01?w=500",
        "https://plus.unsplash.com/premium_photo-1741881406929-6945240017e8?w=500",
      ],
      stock: 45,
      category: { ko: "반려로봇", en: "Companion Robot" },
    },
    {
      name: { ko: "서빙봇 프로 MAX", en: "Serving Bot Pro MAX" },
      price: 3490000,
      description: {
        ko: "카페와 레스토랑을 위한 스마트 서빙 로봇. 자율주행으로 안전하고 정확한 서빙을 제공합니다.",
        en: "Smart serving robot for cafes and restaurants. Provides safe and precise serving with autonomous navigation.",
      },
      images: [
        "https://images.unsplash.com/photo-1629248242733-43d4013f33a1?w=500",
        "https://plus.unsplash.com/premium_photo-1757096613035-818a14f001d3?w=500",
      ],
      stock: 12,
      category: { ko: "서비스로봇", en: "Service Robot" },
    },
    {
      name: { ko: "루미 청소로봇 AI+", en: "Lumi Cleaning Robot AI+" },
      price: 649000,
      description: {
        ko: "AI 매핑과 장애물 회피 기술을 탑재한 프리미엄 로봇청소기. 완벽한 청소를 경험하세요.",
        en: "Premium robotic vacuum with AI mapping and obstacle avoidance technology. Experience perfect cleaning.",
      },
      images: [
        "https://images.unsplash.com/photo-1754297813553-43eb3a9f65a4?w=500",
        "https://images.unsplash.com/photo-1754297813495-b1b4d20b8a11?w=500",
        "https://images.unsplash.com/photo-1699602048528-5311af9da7f6?w=500",
      ],
      stock: 78,
      category: { ko: "청소로봇", en: "Cleaning Robot" },
    },
    {
      name: { ko: "가디언 보안로봇", en: "Guardian Security Robot" },
      price: 2890000,
      description: {
        ko: "24시간 자율 순찰이 가능한 보안 로봇. 얼굴 인식과 침입자 감지 기능을 제공합니다.",
        en: "Security robot capable of 24/7 autonomous patrol. Provides facial recognition and intruder detection features.",
      },
      images: [
        "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?w=500",
        "https://images.unsplash.com/photo-1738054040695-d6f1f0e161ac?w=500",
      ],
      stock: 8,
      category: { ko: "보안로봇", en: "Security Robot" },
    },
    {
      name: { ko: "키티봇 교육로봇", en: "KittyBot Educational Robot" },
      price: 459000,
      description: {
        ko: "코딩교육을 위한 귀여운 고양이 모양 교육로봇. 아이들의 창의력을 키워줍니다.",
        en: "Cute cat-shaped educational robot for coding education. Enhances children's creativity.",
      },
      images: [
        "https://images.unsplash.com/photo-1684369176170-463e84248b70?w=500",
        "https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?w=500",
        "https://images.unsplash.com/photo-1590065672897-8cd8dc54a530?w=500",
      ],
      stock: 95,
      category: { ko: "교육로봇", en: "Educational Robot" },
    },
    {
      name: { ko: "농업도우미 파머봇", en: "FarmerBot Agricultural Assistant" },
      price: 4290000,
      description: {
        ko: "스마트팜을 위한 농업 자동화 로봇. 파종, 관수, 수확까지 모든 농업 작업을 지원합니다.",
        en: "Agricultural automation robot for smart farms. Supports seeding, watering, and harvesting.",
      },
      images: [
        "https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?w=500",
        "https://plus.unsplash.com/premium_photo-1674624682288-085eff4f98da?w=500",
        "https://images.unsplash.com/photo-1746301469706-ea64999d6f42?w=500",
      ],
      stock: 6,
      category: { ko: "농업로봇", en: "Agricultural Robot" },
    },
    {
      name: { ko: "펫케어 로봇 플래피", en: "PetCare Robot Flappy" },
      price: 789000,
      description: {
        ko: "반려동물 돌봄 전용 로봇. 자동 급식, 놀이, 건강 모니터링까지 한 번에!",
        en: "Robot dedicated to pet care. Automatic feeding, play, and health monitoring all in one!",
      },
      images: [
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
      ],
      stock: 34,
      category: { ko: "펫케어로봇", en: "Pet Care Robot" },
    },
    {
      name: { ko: "휴머노이드 아시모 2.0", en: "Humanoid ASIMO 2.0" },
      price: 12900000,
      description: {
        ko: "차세대 휴머노이드 로봇. 인간과 유사한 움직임과 상호작용이 가능한 미래형 로봇입니다.",
        en: "Next-generation humanoid robot. Capable of human-like movement and interaction.",
      },
      images: [
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500",
        "https://images.unsplash.com/photo-1630505331189-4ca903b81824?w=500",
      ],
      stock: 3,
      category: { ko: "휴머노이드", en: "Humanoid" },
    },
    {
      name: { ko: "바리스타 로봇 카페마스터", en: "Barista Robot CafeMaster" },
      price: 1890000,
      description: {
        ko: "완벽한 커피를 내려주는 바리스타 로봇. 라떼아트까지 가능한 프로페셔널 로봇입니다.",
        en: "Barista robot that brews perfect coffee. Professional robot capable of latte art.",
      },
      images: [
        "https://plus.unsplash.com/premium_photo-1741636530412-641689accf2b?w=500",
        "https://plus.unsplash.com/premium_photo-1742884841225-7e8961ec3611?w=500",
      ],
      stock: 15,
      category: { ko: "서비스로봇", en: "Service Robot" },
    },
    {
      name: { ko: "미니 드론로봇 버디", en: "Mini Drone Robot Buddy" },
      price: 329000,
      description: {
        ko: "실내용 미니 드론 로봇. 귀여운 외형과 다양한 기능으로 온 가족이 즐길 수 있습니다.",
        en: "Indoor mini drone robot. Cute design with various features for the whole family.",
      },
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
        "https://images.unsplash.com/photo-1506947411487-a56738267384?w=500",
      ],
      stock: 67,
      category: { ko: "드론로봇", en: "Drone Robot" },
    },
    {
      name: {
        ko: "의료지원 로봇 케어플러스",
        en: "Medical Support Robot CarePlus",
      },
      price: 5690000,
      description: {
        ko: "병원과 요양원을 위한 의료지원 로봇. 환자 모니터링과 기본적인 의료 보조 업무를 수행합니다.",
        en: "Medical support robot for hospitals and nursing homes. Performs patient monitoring and basic medical assistance.",
      },
      images: [
        "https://images.unsplash.com/photo-1717347424091-08275b73c918?w=500",
        "https://plus.unsplash.com/premium_photo-1680700308578-b40c7418e997?w=500",
      ],
      stock: 9,
      category: { ko: "의료로봇", en: "Medical Robot" },
    },
    {
      name: {
        ko: "창고로봇 로지스틱스 프로",
        en: "Warehouse Robot Logistics Pro",
      },
      price: 2390000,
      description: {
        ko: "물류창고 자동화를 위한 AGV 로봇. 효율적인 상품 이동과 재고관리를 제공합니다.",
        en: "AGV robot for warehouse automation. Provides efficient product transport and inventory management.",
      },
      images: [
        "https://images.unsplash.com/photo-1589254065909-b7086229d08c?w=500",
        "https://images.unsplash.com/photo-1589254066213-a0c9dc853511?w=500",
      ],
      stock: 18,
      category: { ko: "물류로봇", en: "Logistics Robot" },
    },
    {
      name: { ko: "댄싱로봇 리듬이", en: "Dancing Robot Rhythm" },
      price: 599000,
      description: {
        ko: "음악에 맞춰 춤추는 엔터테인먼트 로봇. 파티와 이벤트를 더욱 즐겁게 만들어줍니다.",
        en: "Entertainment robot that dances to music. Makes parties and events more fun.",
      },
      images: [
        "https://images.unsplash.com/photo-1707948952408-f7aa2c51db1f?w=500",
        "https://images.unsplash.com/photo-1538491247542-5da27794bc65?w=500",
      ],
      stock: 52,
      category: { ko: "엔터테인먼트", en: "Entertainment" },
    },
    {
      name: { ko: "스마트홈 허브로봇 홈이", en: "Smart Home Hub Robot Homey" },
      price: 889000,
      description: {
        ko: "집안의 모든 IoT 기기를 제어하는 중앙 허브 로봇. 음성 명령으로 스마트홈을 완성하세요.",
        en: "Central hub robot controlling all IoT devices at home. Complete your smart home with voice commands.",
      },
      images: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
        "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=500",
      ],
      stock: 41,
      category: { ko: "스마트홈", en: "Smart Home" },
    },
    {
      name: { ko: "배달로봇 딜리버리 원", en: "Delivery Robot Delivery One" },
      price: 1490000,
      description: {
        ko: "무인 배달 서비스를 위한 자율주행 배달로봇. 안전하고 신속한 배달을 보장합니다.",
        en: "Autonomous delivery robot for unmanned delivery service. Ensures safe and fast delivery.",
      },
      images: [
        "https://plus.unsplash.com/premium_photo-1756908689167-fc8d92b3a9e1?w=500",
        "https://images.unsplash.com/photo-1722452323413-b8f5447d4c41?w=500",
      ],
      stock: 23,
      category: { ko: "배달로봇", en: "Delivery Robot" },
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(` ${products.length}개의 로봇 상품이 생성되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
