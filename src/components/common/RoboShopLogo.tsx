import Link from "next/link";
import { Bot } from "lucide-react";

interface RoboShopLogoProps {
  className?: string;
  botClassName?: string;
  textClassName?: string;
  hideTextOnMobile?: boolean;
}

export default function RoboShopLogo({
  className = "flex items-center gap-2",
  botClassName = "w-8 h-8",
  textClassName = "text-2xl",
  hideTextOnMobile = false,
}: RoboShopLogoProps) {
  return (
    <Link href="/" className={className}>
      <Bot className={`text-gray-700 ${botClassName}`} />

      <span
        className={`font-extrabold tracking-tight text-gray-900 ${textClassName} ${
          hideTextOnMobile ? "hidden sm:inline-block" : ""
        }`}
      >
        Robo
        <span className="text-[color:var(--button-bg)]">Shop</span>
      </span>
    </Link>
  );
}
