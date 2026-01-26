import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MypageButton() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="icon" onClick={() => router.push("mypage")}>
      <User className="w-5 h-5" />
    </Button>
  );
}
