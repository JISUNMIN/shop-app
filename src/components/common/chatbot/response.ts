// response.ts
import { ROBOT_CATEGORY_KEYS } from "./constants";

export type BotReply = {
  textKey: string;
  suggestions?: string[];
};

export type RobotCategoryKey = (typeof ROBOT_CATEGORY_KEYS)[number];
export type TFn = (key: string, options?: Record<string, any>) => string;

const includesAny = (text: string, keywords: string[]) => {
  return keywords.some((k) => k && text.includes(k));
};

const splitKeywords = (...parts: string[]) =>
  parts
    .flatMap((p) => (p || "").toLowerCase().split("|"))
    .map((v) => v.trim())
    .filter(Boolean);

const isCategoryKey = (v: string): v is RobotCategoryKey => {
  return (ROBOT_CATEGORY_KEYS as readonly string[]).includes(v);
};

const categoryToAnswerKey = (categoryKey: RobotCategoryKey) => {
  const base = categoryKey.replace(/^category_/, "");
  return `chatbot.answer_${base}`;
};

export const getBotResponse = (userMessage: string, t: TFn): BotReply => {
  const message = userMessage.trim();
  const lower = message.toLowerCase();

  if (isCategoryKey(message)) {
    return { textKey: categoryToAnswerKey(message) };
  }

  const shippingKeywords = splitKeywords(
    t("chatbot.keyword_shipping"),
    t("chatbot.keyword_delivery"),
    t("chatbot.keyword_shipping_time")
  );

  const recommendKeywords = splitKeywords(
    t("chatbot.keyword_recommend"),
    t("chatbot.keyword_suggest")
  );

  const paymentKeywords = splitKeywords(
    t("chatbot.keyword_payment"),
    t("chatbot.keyword_pay_method")
  );

  const returnKeywords = splitKeywords(t("chatbot.keyword_return"), t("chatbot.keyword_exchange"));

  const priceKeywords = splitKeywords(t("chatbot.keyword_price"), t("chatbot.keyword_discount"));

  const greetingKeywords = splitKeywords(t("chatbot.keyword_hello"), "hello", "hi");
  const thanksKeywords = splitKeywords(t("chatbot.keyword_thanks"));

  if (includesAny(lower, shippingKeywords)) {
    return { textKey: "chatbot.shipping_answer" };
  }

  if (includesAny(lower, recommendKeywords)) {
    return {
      textKey: "chatbot.recommend_prompt",
      suggestions: [...ROBOT_CATEGORY_KEYS],
    };
  }

  if (includesAny(lower, paymentKeywords)) {
    return { textKey: "chatbot.payment_answer" };
  }

  if (includesAny(lower, returnKeywords)) {
    return { textKey: "chatbot.return_exchange_answer" };
  }

  if (includesAny(lower, priceKeywords)) {
    return { textKey: "chatbot.price_discount_answer" };
  }

  if (includesAny(lower, greetingKeywords)) {
    return { textKey: "chatbot.greeting_answer" };
  }

  if (includesAny(lower, thanksKeywords)) {
    return { textKey: "chatbot.thanks_answer" };
  }

  return { textKey: "chatbot.unknown_answer" };
};
