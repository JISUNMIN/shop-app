"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { ArrowRight, PackagePlus, Sparkles } from "lucide-react";
import axiosSession from "@/lib/axiosSession";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProductSummary = {
  id: number;
  name: { ko: string; en: string };
  category: { ko: string; en: string } | null;
  price: number;
  stock: number;
};

type OpsProductCreateClientProps = {
  recentProducts: ProductSummary[];
};

const INITIAL_FORM = {
  nameKo: "",
  nameEn: "",
  categoryKo: "",
  categoryEn: "",
  descriptionKo: "",
  descriptionEn: "",
  price: "",
  stock: "",
  imageUrl: "",
};

export default function OpsProductCreateClient({ recentProducts }: OpsProductCreateClientProps) {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: keyof typeof INITIAL_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fillDemoData = () => {
    setForm({
      nameKo: "로보 케어 스테이션 X",
      nameEn: "Robo Care Station X",
      categoryKo: "스마트홈",
      categoryEn: "Smart Home",
      descriptionKo: "실내 순찰과 모니터링, 음성 안내를 결합한 스마트홈 로봇입니다.",
      descriptionEn: "A smart home robot combining indoor patrol, monitoring, and voice guidance.",
      price: "1890000",
      stock: "12",
      imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=1200&q=80",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosSession.post("/ops/products", {
        name: {
          ko: form.nameKo,
          en: form.nameEn,
        },
        category: {
          ko: form.categoryKo,
          en: form.categoryEn,
        },
        description: {
          ko: form.descriptionKo,
          en: form.descriptionEn,
        },
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.imageUrl
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      toast.success("운영자 상품 등록이 완료되었습니다.");
      setForm(INITIAL_FORM);
      router.refresh();
      router.push(`/product/${response.data.productId}`);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      toast.error(message ?? "상품 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="-mx-4 bg-white sm:-mx-6 lg:-mx-8">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#132238_52%,#1f4b6e_100%)] p-6 text-white shadow-[0_30px_80px_-34px_rgba(15,23,42,0.6)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                  <PackagePlus className="h-3.5 w-3.5" />
                  운영자 상품 등록
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-4xl">
                  새 상품을 바로 등록하고
                  <br />
                  메인 카탈로그에 반영하세요
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  운영 보드에서 주문 처리만 보여주는 대신, 실제로 상품 데이터를 추가하는 흐름까지
                  연결해 포트폴리오의 운영 범위를 더 명확하게 보여줄 수 있게 했습니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/ops/orders">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                    운영 보드로 돌아가기
                  </Button>
                </Link>
                <Button onClick={fillDemoData} className="bg-white text-slate-950 hover:bg-slate-100">
                  <Sparkles className="mr-2 h-4 w-4" />
                  샘플 데이터 채우기
                </Button>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>상품 입력 폼</CardTitle>
                <CardDescription>국문/영문 이름, 카테고리, 가격, 재고, 이미지 URL을 입력합니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input value={form.nameKo} onChange={(e) => updateField("nameKo", e.target.value)} placeholder="상품명 (국문)" />
                    <Input value={form.nameEn} onChange={(e) => updateField("nameEn", e.target.value)} placeholder="Product name (EN)" />
                    <Input value={form.categoryKo} onChange={(e) => updateField("categoryKo", e.target.value)} placeholder="카테고리 (국문)" />
                    <Input value={form.categoryEn} onChange={(e) => updateField("categoryEn", e.target.value)} placeholder="Category (EN)" />
                    <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="가격" inputMode="numeric" />
                    <Input value={form.stock} onChange={(e) => updateField("stock", e.target.value)} placeholder="재고 수량" inputMode="numeric" />
                  </div>

                  <Textarea value={form.descriptionKo} onChange={(e) => updateField("descriptionKo", e.target.value)} placeholder="상품 설명 (국문)" className="min-h-24" />
                  <Textarea value={form.descriptionEn} onChange={(e) => updateField("descriptionEn", e.target.value)} placeholder="Product description (EN)" className="min-h-24" />
                  <Textarea
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    placeholder="이미지 URL 1개 이상 입력, 여러 개는 쉼표로 구분"
                    className="min-h-24"
                  />

                  <Button type="submit" disabled={isSubmitting} className="h-11 rounded-full px-6">
                    {isSubmitting ? "등록 중..." : "상품 등록하기"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>최근 등록 상품</CardTitle>
                <CardDescription>운영자가 최근에 등록한 상품 흐름을 바로 확인할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{product.name.ko}</p>
                        <p className="mt-1 text-xs text-slate-500">{product.name.en}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {(product.category?.ko ?? "미분류")} · {product.price.toLocaleString("ko-KR")}원 · 재고 {product.stock}개
                        </p>
                      </div>
                      <Link href={`/product/${product.id}`} className="text-sm font-medium text-[color:var(--link-accent)]">
                        보기
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
