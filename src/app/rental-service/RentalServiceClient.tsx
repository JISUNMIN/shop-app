"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/utils/helper";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type RentalProduct = {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
};

type RentalServiceClientProps = {
  products: RentalProduct[];
};

const STORAGE_KEY = "roboshop-rental-draft";

const CONTRACT_OPTIONS = [
  { months: 12, ratio: 0.096, depositRate: 0.14 },
  { months: 24, ratio: 0.054, depositRate: 0.1 },
  { months: 36, ratio: 0.038, depositRate: 0.08 },
] as const;

const SUPPORT_OPTIONS = [
  { id: "basic", label: "기본 케어", monthlyFee: 0 },
  { id: "standard", label: "정기 점검", monthlyFee: 59000 },
  { id: "premium", label: "프리미엄 케어", monthlyFee: 129000 },
] as const;

type SupportOptionId = (typeof SUPPORT_OPTIONS)[number]["id"];

export default function RentalServiceClient({ products }: RentalServiceClientProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? 0);
  const [selectedMonths, setSelectedMonths] = useState<(typeof CONTRACT_OPTIONS)[number]["months"]>(
    24,
  );
  const [supportOption, setSupportOption] = useState<SupportOptionId>("standard");
  const [companyName, setCompanyName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const draft = JSON.parse(saved) as {
        selectedProductId?: number;
        selectedMonths?: number;
        supportOption?: SupportOptionId;
        companyName?: string;
        contact?: string;
        notes?: string;
      };

      if (draft.selectedProductId) setSelectedProductId(draft.selectedProductId);
      if (draft.selectedMonths === 12 || draft.selectedMonths === 24 || draft.selectedMonths === 36) {
        setSelectedMonths(draft.selectedMonths);
      }
      if (
        draft.supportOption === "basic" ||
        draft.supportOption === "standard" ||
        draft.supportOption === "premium"
      ) {
        setSupportOption(draft.supportOption);
      }
      setCompanyName(draft.companyName ?? "");
      setContact(draft.contact ?? "");
      setNotes(draft.notes ?? "");
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((product) => product.id === selectedProductId) ?? products[0];
  }, [products, selectedProductId]);

  const selectedContract = useMemo(() => {
    return CONTRACT_OPTIONS.find((option) => option.months === selectedMonths) ?? CONTRACT_OPTIONS[1];
  }, [selectedMonths]);

  const selectedSupport = useMemo(() => {
    return SUPPORT_OPTIONS.find((option) => option.id === supportOption) ?? SUPPORT_OPTIONS[1];
  }, [supportOption]);

  const estimate = useMemo(() => {
    if (!selectedProduct) return null;

    const monthlyBase = Math.round(selectedProduct.price * selectedContract.ratio);
    const monthlyFee = monthlyBase + selectedSupport.monthlyFee;
    const deposit = Math.round(selectedProduct.price * selectedContract.depositRate);
    const contractTotal = monthlyFee * selectedContract.months + deposit;

    return {
      monthlyBase,
      monthlyFee,
      deposit,
      contractTotal,
    };
  }, [selectedContract, selectedProduct, selectedSupport.monthlyFee]);

  const handleSaveDraft = () => {
    if (!selectedProduct || !estimate) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedProductId: selectedProduct.id,
        selectedMonths,
        supportOption,
        companyName,
        contact,
        notes,
      }),
    );

    toast.success("렌탈 상담 초안을 저장했습니다.", {
      description: `${selectedProduct.name} / ${selectedMonths}개월 / 월 ${formatPrice(
        estimate.monthlyFee,
        "ko",
      )}원`,
    });
  };

  if (!selectedProduct || !estimate) {
    return null;
  }

  return (
    <div className="space-y-8 py-8">
      <section className="overflow-hidden rounded-[2rem] bg-[#0c1b2e] text-white shadow-[0_26px_70px_-34px_rgba(12,27,46,0.82)]">
        <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-10">
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9dd0ff]">
                Rental Service
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] md:text-5xl">
                구매가 부담될 때,
                <br />
                월 렌탈로 먼저 시작하세요
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 md:text-base">
                메인에서 보이던 렌탈 서비스를 실제 견적 흐름으로 연결했습니다. 제품, 계약 기간,
                케어 옵션을 고르면 월 요금과 보증금을 바로 비교할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82">
                <Clock3 className="h-4 w-4 text-[#9dd0ff]" />
                12 · 24 · 36개월 비교
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82">
                <ShieldCheck className="h-4 w-4 text-[#9dd0ff]" />
                정기 점검 옵션 선택
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82">
                <CheckCircle2 className="h-4 w-4 text-[#9dd0ff]" />
                상담 초안 저장 가능
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/48">
              Quick Estimate
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/92 p-4 text-slate-900">
                <p className="text-xs font-medium text-slate-500">선택 제품</p>
                <p className="mt-1 text-lg font-bold">{selectedProduct.name}</p>
                <p className="mt-1 text-sm text-slate-500">{selectedProduct.category}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#13263c] p-4">
                <p className="text-sm text-white/60">예상 월 렌탈료</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.03em] text-white">
                  {formatPrice(estimate.monthlyFee, "ko")}원
                </p>
                <p className="mt-2 text-sm text-white/56">
                  보증금 {formatPrice(estimate.deposit, "ko")}원 / {selectedMonths}개월 기준
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200 bg-white py-0 shadow-sm">
            <CardContent className="p-5 md:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Rental Catalog
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                    렌탈 가능 모델
                  </h2>
                </div>
                <Link href="/?sort=price_desc" className="text-sm font-medium text-[color:var(--link-accent)]">
                  전체 상품 보기
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {products.map((product) => {
                  const active = product.id === selectedProductId;
                  const previewMonthly = Math.round(product.price * selectedContract.ratio);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className={cn(
                        "overflow-hidden rounded-[1.35rem] border text-left transition-all duration-200",
                        active
                          ? "border-[color:var(--link-accent)] shadow-[0_20px_45px_-28px_rgba(55,138,221,0.55)]"
                          : "border-slate-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_-28px_rgba(15,23,42,0.18)]",
                      )}
                    >
                      <div className="relative aspect-[4/3] bg-slate-100">
                        <Image
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                        <Badge className="absolute left-3 top-3 border-0 bg-white/92 text-slate-900">
                          렌탈 가능
                        </Badge>
                      </div>
                      <div className="space-y-2 p-4">
                        <p className="line-clamp-2 text-base font-semibold text-slate-950">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.category}</p>
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs text-slate-400">구매가</p>
                            <p className="text-sm font-semibold text-slate-700">
                              {formatPrice(product.price, "ko")}원
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400">{selectedMonths}개월 예상</p>
                            <p className="text-lg font-black text-[color:var(--link-accent)]">
                              월 {formatPrice(previewMonthly, "ko")}원~
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-slate-200 bg-white py-0 shadow-sm">
            <CardContent className="grid gap-6 p-5 md:grid-cols-3 md:p-6">
              {[
                {
                  title: "빠른 도입",
                  body: "초기 구매비를 낮추고 현장 테스트 후 확장 여부를 판단할 수 있습니다.",
                },
                {
                  title: "운영 케어 포함",
                  body: "계약 기간 동안 점검 주기와 지원 범위를 패키지별로 고를 수 있습니다.",
                },
                {
                  title: "구매 전환 판단",
                  body: "렌탈 이후 실제 사용 데이터를 바탕으로 재구매나 교체 결정을 설명하기 좋습니다.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.2rem] bg-slate-50 p-4">
                  <p className="text-base font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[1.5rem] border-slate-200 bg-white py-0 shadow-sm">
            <CardContent className="space-y-5 p-5 md:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Estimate Builder
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">
                  렌탈 견적 구성
                </h2>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">계약 기간</p>
                <div className="grid grid-cols-3 gap-2">
                  {CONTRACT_OPTIONS.map((option) => (
                    <button
                      key={option.months}
                      type="button"
                      onClick={() => setSelectedMonths(option.months)}
                      className={cn(
                        "rounded-2xl border px-3 py-3 text-sm font-medium transition-colors",
                        selectedMonths === option.months
                          ? "border-[color:var(--link-accent)] bg-[color-mix(in_oklch,var(--button-bg)_10%,transparent)] text-[var(--button-bg)]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {option.months}개월
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">케어 옵션</p>
                <div className="space-y-2">
                  {SUPPORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSupportOption(option.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                        supportOption === option.id
                          ? "border-[color:var(--link-accent)] bg-[color-mix(in_oklch,var(--button-bg)_8%,transparent)]"
                          : "border-slate-200 hover:bg-slate-50",
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {option.monthlyFee === 0
                            ? "기본 기술 지원 포함"
                            : `월 ${formatPrice(option.monthlyFee, "ko")}원 추가`}
                        </p>
                      </div>
                      {supportOption === option.id && (
                        <CheckCircle2 className="h-4 w-4 text-[color:var(--link-accent)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.3rem] bg-slate-950 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/58">선택 제품</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/58">월 기본 렌탈료</span>
                    <span>{formatPrice(estimate.monthlyBase, "ko")}원</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/58">케어 옵션</span>
                    <span>{selectedSupport.label}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/58">보증금</span>
                    <span>{formatPrice(estimate.deposit, "ko")}원</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-white/58">예상 월 납부액</p>
                        <p className="mt-1 text-2xl font-black tracking-[-0.03em]">
                          {formatPrice(estimate.monthlyFee, "ko")}원
                        </p>
                      </div>
                      <div className="text-right text-xs text-white/50">
                        총 계약금액
                        <br />
                        {formatPrice(estimate.contractTotal, "ko")}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.5rem] border-slate-200 bg-white py-0 shadow-sm">
            <CardContent className="space-y-4 p-5 md:p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Draft Inquiry
                </p>
                <h2 className="mt-2 text-xl font-black tracking-[-0.03em] text-slate-950">
                  상담 초안 저장
                </h2>
              </div>

              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="회사명 또는 담당자명"
              />
              <Input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="연락처 또는 이메일"
              />
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="설치 장소, 필요한 시기, 비교 중인 모델 등을 적어두면 다음에 이어서 보기 쉽습니다."
                className="min-h-28"
              />

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleSaveDraft}
                  className="h-11 bg-[color:var(--button-bg)] text-white hover:bg-[color:var(--button-bg-hover)]"
                >
                  렌탈 상담 초안 저장
                </Button>

                <Link href="/support" className="w-full">
                  <Button variant="outline" className="h-11 w-full">
                    고객지원으로 이어서 문의하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href={`/product/${selectedProduct.id}`} className="text-sm font-medium text-[color:var(--link-accent)]">
                  선택한 제품 상세 보기
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
