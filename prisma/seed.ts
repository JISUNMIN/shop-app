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
      name: "코지모 AI 반려로봇",
      price: 899000,
      description:
        "감정 인식과 대화가 가능한 귀여운 AI 반려로봇. 외로움을 달래주는 완벽한 친구입니다.",
      images: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
      ],
      stock: 45,
      category: "반려로봇",
    },
    {
      name: "서빙봇 프로 MAX",
      price: 3490000,
      description:
        "카페와 레스토랑을 위한 스마트 서빙 로봇. 자율주행으로 안전하고 정확한 서빙을 제공합니다.",
      images: [
        "https://images.unsplash.com/photo-1629248242733-43d4013f33a1?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 12,
      category: "서비스로봇",
    },
    {
      name: "루미 청소로봇 AI+",
      price: 649000,
      description:
        "AI 매핑과 장애물 회피 기술을 탑재한 프리미엄 로봇청소기. 완벽한 청소를 경험하세요.",
      images: [
        "https://images.unsplash.com/photo-1754297813553-43eb3a9f65a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 78,
      category: "청소로봇",
    },
    {
      name: "가디언 보안로봇",
      price: 2890000,
      description:
        "24시간 자율 순찰이 가능한 보안 로봇. 얼굴 인식과 침입자 감지 기능을 제공합니다.",
      images: [
        "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?q=80&w=952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 8,
      category: "보안로봇",
    },
    {
      name: "키티봇 교육로봇",
      price: 459000,
      description:
        "코딩과 STEM 교육을 위한 귀여운 고양이 모양 교육로봇. 아이들의 창의력을 키워줍니다.",
      images: [
        "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500",
      ],
      stock: 95,
      category: "교육로봇",
    },
    {
      name: "농업도우미 파머봇",
      price: 4290000,
      description:
        "스마트팜을 위한 농업 자동화 로봇. 파종, 관수, 수확까지 모든 농업 작업을 지원합니다.",
      images: [
        "https://images.unsplash.com/photo-1597089542047-b9873d82d8ec?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 6,
      category: "농업로봇",
    },
    {
      name: "펫케어 로봇 플래피",
      price: 789000,
      description:
        "반려동물 돌봄 전용 로봇. 자동 급식, 놀이, 건강 모니터링까지 한 번에!",
      images: [
        "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500",
      ],
      stock: 34,
      category: "펫케어로봇",
    },
    {
      name: "휴머노이드 아시모 2.0",
      price: 12900000,
      description:
        "차세대 휴머노이드 로봇. 인간과 유사한 움직임과 상호작용이 가능한 미래형 로봇입니다.",
      images: [
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=500",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500",
      ],
      stock: 3,
      category: "휴머노이드",
    },
    {
      name: "바리스타 로봇 카페마스터",
      price: 1890000,
      description:
        "완벽한 커피를 내려주는 바리스타 로봇. 라떼아트까지 가능한 프로페셔널 로봇입니다.",
      images: [
        "https://images.unsplash.com/photo-1527430253228-e93688616381?w=500",
      ],
      stock: 15,
      category: "서비스로봇",
    },
    {
      name: "미니 드론로봇 버디",
      price: 329000,
      description:
        "실내용 미니 드론 로봇. 귀여운 외형과 다양한 기능으로 온 가족이 즐길 수 있습니다.",
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
      ],
      stock: 67,
      category: "드론로봇",
    },
    {
      name: "의료지원 로봇 케어플러스",
      price: 5690000,
      description:
        "병원과 요양원을 위한 의료지원 로봇. 환자 모니터링과 기본적인 의료 보조 업무를 수행합니다.",
      images: [
        "https://images.unsplash.com/photo-1717347424091-08275b73c918?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fCVFQiVBMSU5QyVFQiVCNCU4N3xlbnwwfHwwfHx8MA%3D%3D?w=500",
      ],
      stock: 9,
      category: "의료로봇",
    },
    {
      name: "창고로봇 로지스틱스 프로",
      price: 2390000,
      description:
        "물류창고 자동화를 위한 AGV 로봇. 효율적인 상품 이동과 재고관리를 제공합니다.",
      images: [
        "https://images.unsplash.com/photo-1589254066213-a0c9dc853511?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 18,
      category: "물류로봇",
    },
    {
      name: "댄싱로봇 리듬이",
      price: 599000,
      description:
        "음악에 맞춰 춤추는 엔터테인먼트 로봇. 파티와 이벤트를 더욱 즐겁게 만들어줍니다.",
      images: [
        "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500",
      ],
      stock: 52,
      category: "엔터테인먼트",
    },
    {
      name: "스마트홈 허브로봇 홈이",
      price: 889000,
      description:
        "집안의 모든 IoT 기기를 제어하는 중앙 허브 로봇. 음성 명령으로 스마트홈을 완성하세요.",
      images: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
      ],
      stock: 41,
      category: "스마트홈",
    },
    {
      name: "배달로봇 딜리버리 원",
      price: 1490000,
      description:
        "무인 배달 서비스를 위한 자율주행 배달로봇. 안전하고 신속한 배달을 보장합니다.",
      images: [
        "https://plus.unsplash.com/premium_photo-1756908689167-fc8d92b3a9e1?q=80&w=2167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      ],
      stock: 23,
      category: "배달로봇",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`🤖 ${products.length}개의 로봇 상품이 생성되었습니다.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
