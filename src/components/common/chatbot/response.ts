import { robotCategories } from "./constants";

export type BotReply = {
  text: string;
  suggestions?: string[];
};

export const getBotResponse = (userMessage: string): BotReply => {
  const message = userMessage.toLowerCase();

  if (message.includes("배송") || message.includes("기간")) {
    return {
      text: "배송은 주문 후 2-3일 정도 소요됩니다. 일부 지역은 추가 시간이 걸릴 수 있습니다. 무료배송은 50만원 이상 구매 시 적용됩니다.",
    };
  }

  if (message.includes("추천") || message.includes("어떤")) {
    return {
      text: "원하시는 로봇 종류를 선택해보세요!",
      suggestions: robotCategories,
    };
  }

  if (message.includes("결제") || message.includes("방법")) {
    return {
      text: "신용카드, 체크카드, 계좌이체, 무통장입금을 지원합니다. 최대 12개월 무이자 할부도 가능합니다.",
    };
  }

  if (message.includes("반품") || message.includes("교환")) {
    return {
      text: "상품 수령 후 7일 이내 반품/교환이 가능합니다. 단, 제품 사용 흔적이 있거나 포장이 훼손된 경우 반품이 어려울 수 있습니다.",
    };
  }

  if (message.includes("가격") || message.includes("할인")) {
    return {
      text: "현재 전 상품 신규 회원 10% 할인 이벤트 진행 중입니다! 상품 페이지에서 자세한 가격을 확인하실 수 있습니다.",
    };
  }

  if (message.includes("안녕") || message.includes("hello") || message.includes("hi")) {
    return {
      text: "안녕하세요! RoboShop 고객지원 봇입니다. 무엇을 도와드릴까요?",
    };
  }

  if (message.includes("감사") || message.includes("고마")) {
    return {
      text: "천만에요! 더 궁금하신 점이 있으시면 언제든지 물어보세요. 😊",
    };
  }

  return {
    text: "죄송합니다. 정확한 답변을 드리기 어렵습니다. 고객센터(1234-5678)로 연락주시면 더 자세한 상담이 가능합니다.",
  };
};
