"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Boxes, CheckCircle2, ClipboardCheck, PackagePlus, RefreshCcw, Route, ShieldCheck, TriangleAlert, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ScenarioStatusSummary = {
  status: string;
  count: number;
  sampleOrderId: number | null;
  sampleProductName: { ko?: string; en?: string } | null;
};

type ScenarioReadinessResponse = {
  ok: boolean;
  generatedAt: string;
  summary: {
    totalOrders: number;
    trackingReadyOrderId: number | null;
    deliveredOrderId: number | null;
    claimOrderId: number | null;
  };
  statuses: ScenarioStatusSummary[];
};

export default function DemoGuidePage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [scenario, setScenario] = useState<ScenarioReadinessResponse | null>(null);
  const [isScenarioLoading, setIsScenarioLoading] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
      setIsScenarioLoading(true);

      try {
        const response = await fetch("/api/demo/scenario-readiness", { cache: "no-store" });
        if (!response.ok) {
          setScenario(null);
          return;
        }

        const data = (await response.json()) as ScenarioReadinessResponse;
        setScenario(data);
      } finally {
        setIsScenarioLoading(false);
      }
    };

    void fetchScenario();
  }, []);

  const refreshScenario = async () => {
    setIsScenarioLoading(true);

    try {
      const response = await fetch("/api/demo/scenario-readiness", { cache: "no-store" });
      if (!response.ok) {
        setScenario(null);
        return;
      }

      const data = (await response.json()) as ScenarioReadinessResponse;
      setScenario(data);
    } finally {
      setIsScenarioLoading(false);
    }
  };

  const customerFlow = [
    t("demoGuide.customer.steps.1"),
    t("demoGuide.customer.steps.2"),
    t("demoGuide.customer.steps.3"),
    t("demoGuide.customer.steps.4"),
  ];

  const opsFlow = [
    t("demoGuide.ops.steps.1"),
    t("demoGuide.ops.steps.2"),
    t("demoGuide.ops.steps.3"),
    t("demoGuide.ops.steps.4"),
  ];

  const routeItems = [
    { href: "/", label: t("demoGuide.routes.home"), detail: t("demoGuide.routes.homeDetail") },
    {
      href: "/mypage?tab=orders",
      label: t("demoGuide.routes.mypage"),
      detail: t("demoGuide.routes.mypageDetail"),
    },
    {
      href: "/ops-access",
      label: t("demoGuide.routes.opsAccess"),
      detail: t("demoGuide.routes.opsAccessDetail"),
    },
    {
      href: isAdmin ? "/ops/orders" : "/login?callbackUrl=%2Fops%2Forders",
      label: t("demoGuide.routes.opsBoard"),
      detail: t("demoGuide.routes.opsBoardDetail"),
    },
    {
      href: isAdmin ? "/ops/products/new" : "/login?callbackUrl=%2Fops%2Fproducts%2Fnew",
      label: "운영자 상품 등록",
      detail: "상품 등록 화면입니다.",
    },
    {
      href: "/dev/orders",
      label: t("demoGuide.routes.devBoard"),
      detail: t("demoGuide.routes.devBoardDetail"),
    },
  ];

  return (
    <div className="-mx-4 bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#f8fafc_100%)] sm:-mx-6 lg:-mx-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.75)] md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-white/15 bg-white/10 px-3 py-1 text-white">
              <ClipboardCheck className="mr-2 h-3.5 w-3.5" />
              {t("demoGuide.badge")}
            </Badge>
            <Badge className="border border-white/15 bg-white/5 px-3 py-1 text-slate-200">
              {t("demoGuide.badgeSecondary")}
            </Badge>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">
            {t("demoGuide.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            {t("demoGuide.description")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/mypage?tab=orders">
              <Button size="lg" className="w-full sm:w-auto">
                {t("demoGuide.primaryCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/ops-access">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                {t("demoGuide.secondaryCta")}
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/ops/products/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  상품 등록 보기
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                {t("demoGuide.customer.title")}
              </CardTitle>
              <CardDescription>{t("demoGuide.customer.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {customerFlow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("demoGuide.stepLabel", { step: index + 1 })}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                {t("demoGuide.ops.title")}
              </CardTitle>
              <CardDescription>{t("demoGuide.ops.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {opsFlow.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("demoGuide.stepLabel", { step: index + 1 })}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                  {t("demoGuide.scenarioTitle")}
                </CardTitle>
                <CardDescription>{t("demoGuide.scenarioDescription")}</CardDescription>
              </div>

              <Button variant="outline" size="sm" onClick={refreshScenario} disabled={isScenarioLoading}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${isScenarioLoading ? "animate-spin" : ""}`} />
                {t("demoGuide.scenarioRefresh")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!scenario && !isScenarioLoading && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {t("demoGuide.scenarioEmpty")}
              </div>
            )}

            {isScenarioLoading && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {t("demoGuide.scenarioLoading")}
              </div>
            )}

            {scenario && (
              <>
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {t("demoGuide.scenarioStats.total")}
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{scenario.summary.totalOrders}</p>
                  </div>

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      {t("demoGuide.scenarioStats.tracking")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {scenario.summary.trackingReadyOrderId
                        ? `#${scenario.summary.trackingReadyOrderId}`
                        : t("demoGuide.notReady")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {t("demoGuide.scenarioStats.delivered")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {scenario.summary.deliveredOrderId
                        ? `#${scenario.summary.deliveredOrderId}`
                        : t("demoGuide.notReady")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                      {t("demoGuide.scenarioStats.claim")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {scenario.summary.claimOrderId
                        ? `#${scenario.summary.claimOrderId}`
                        : t("demoGuide.notReady")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {scenario.statuses.map((item) => (
                    <div
                      key={item.status}
                      className={`rounded-2xl border p-4 ${
                        item.count > 0
                          ? "border-slate-200 bg-white"
                          : "border-rose-200 bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        {item.count > 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TriangleAlert className="h-4 w-4 text-rose-600" />
                        )}
                        {item.status}
                      </div>

                      <p className="mt-2 text-2xl font-black text-slate-950">{item.count}</p>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.sampleOrderId
                          ? t("demoGuide.scenarioSample", { id: item.sampleOrderId })
                          : t("demoGuide.scenarioNoSample")}
                      </p>

                      {item.sampleOrderId && (
                        <div className="mt-3 flex flex-col gap-2">
                          <Link
                            href={`/mypage/orders/${item.sampleOrderId}`}
                            className="text-sm font-medium text-[color:var(--link-accent)] underline underline-offset-4"
                          >
                            {t("demoGuide.scenarioOpenCustomer")}
                          </Link>
                          {isAdmin && (
                            <Link
                              href={`/ops/orders/${item.sampleOrderId}`}
                              className="text-sm font-medium text-[color:var(--link-accent)] underline underline-offset-4"
                            >
                              {t("demoGuide.scenarioOpenOps")}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                {t("demoGuide.routesTitle")}
              </CardTitle>
              <CardDescription>{t("demoGuide.routesDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {routeItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-white"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                {t("demoGuide.talkingPointsTitle")}
              </CardTitle>
              <CardDescription>{t("demoGuide.talkingPointsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {t("demoGuide.talkingPoints.point1")}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {t("demoGuide.talkingPoints.point2")}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {t("demoGuide.talkingPoints.point3")}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
