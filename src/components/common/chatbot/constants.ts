// constants.ts
export const ROBOT_CATEGORY_KEYS = [
  "category_delivery_robot",
  "category_cleaning_robot",
  "category_smart_home_robot",
  "category_entertainment_robot",
  "category_logistics_robot",
  "category_medical_robot",
  "category_drone_robot",
  "category_service_robot",
  "category_humanoid",
  "category_pet_care_robot",
  "category_agriculture_robot",
  "category_education_robot",
  "category_security_robot",
  "category_companion_robot",
] as const;

export const initialBotText = "chatbot.initial_bot_text";

export const QUICK_REPLY_KEYS = [
  "chatbot.quickreply_shipping_time",
  "chatbot.quickreply_recommend_robot",
  "chatbot.quickreply_payment_methods",
  "chatbot.quickreply_return_exchange_policy",
] as const;
