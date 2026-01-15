import type { ReactNode } from "react";

type FullWidthSectionProps = {
  children: ReactNode;
  className?: string; // 배경색 등 추가 클래스
};

export default function FullWidthSection({ children, className = "" }: FullWidthSectionProps) {
  return (
    <div className={`relative w-screen left-1/2 -ml-[50vw] bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}
