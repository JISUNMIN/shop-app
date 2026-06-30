"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { CheckCircle2, KeyRound, RefreshCcw, ShieldCheck, TriangleAlert, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ReadinessCheck = {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
};

type ReadinessResponse = {
  ok: boolean;
  generatedAt: string;
  checks: ReadinessCheck[];
};

export default function OpsAccessGuide() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = status === "authenticated";
  const isDevelopment = process.env.NODE_ENV !== "production";
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [isReadinessLoading, setIsReadinessLoading] = useState(false);

  useEffect(() => {
    if (!isDevelopment) return;

    const fetchReadiness = async () => {
      setIsReadinessLoading(true);

      try {
        const response = await fetch("/api/demo/ops-readiness", { cache: "no-store" });
        if (!response.ok) {
          setReadiness(null);
          return;
        }

        const data = (await response.json()) as ReadinessResponse;
        setReadiness(data);
      } finally {
        setIsReadinessLoading(false);
      }
    };

    void fetchReadiness();
  }, [isDevelopment]);

  const refreshReadiness = async () => {
    setIsReadinessLoading(true);

    try {
      const response = await fetch("/api/demo/ops-readiness", { cache: "no-store" });
      if (!response.ok) {
        setReadiness(null);
        return;
      }

      const data = (await response.json()) as ReadinessResponse;
      setReadiness(data);
    } finally {
      setIsReadinessLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.75)] md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="border border-white/15 bg-white/10 px-3 py-1 text-white">
              <UserCog className="mr-2 h-3.5 w-3.5" />
              {t("opsAccess.badge")}
            </Badge>
            <Badge className="border border-white/15 bg-white/5 px-3 py-1 text-slate-200">
              {t("opsAccess.badgeSecondary")}
            </Badge>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
            {t("opsAccess.title")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            {t("opsAccess.description")}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isAdmin ? (
              <Link href="/ops/orders">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("opsAccess.ctaGoOps")}
                </Button>
              </Link>
            ) : (
              <Link href="/login?callbackUrl=%2Fops%2Forders">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("opsAccess.ctaLogin")}
                </Button>
              </Link>
            )}

            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                {t("opsAccess.ctaHome")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>{t("opsAccess.flowTitle")}</CardTitle>
              <CardDescription>{t("opsAccess.flowDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("opsAccess.step1Label")}
                </p>
                <p className="mt-2 text-sm text-slate-700">{t("opsAccess.step1Description")}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("opsAccess.step2Label")}
                </p>
                <p className="mt-2 text-sm text-slate-700">{t("opsAccess.step2Description")}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {t("opsAccess.step3Label")}
                </p>
                <p className="mt-2 text-sm text-slate-700">{t("opsAccess.step3Description")}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>{t("opsAccess.currentStateTitle")}</CardTitle>
                <CardDescription>{t("opsAccess.currentStateDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{t("opsAccess.sessionLabel")}</p>
                  <p className="mt-2">
                    {isLoggedIn
                      ? t("opsAccess.sessionLoggedIn", {
                          userId: session?.user?.userId ?? "-",
                          role: session?.user?.role ?? "USER",
                        })
                      : t("opsAccess.sessionLoggedOut")}
                  </p>
                </div>

                {!isAdmin && isLoggedIn && (
                  <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/ops-access" })}>
                    {t("opsAccess.signOutCta")}
                  </Button>
                )}
              </CardContent>
            </Card>

            {isDevelopment && (
              <Card className="border-amber-200 bg-amber-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <KeyRound className="h-4 w-4" />
                    {t("opsAccess.devGuideTitle")}
                  </CardTitle>
                  <CardDescription className="text-amber-800">
                    {t("opsAccess.devGuideDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-amber-900">
                  <div className="rounded-2xl border border-amber-200 bg-white/70 p-4">
                    <p className="font-semibold">{t("opsAccess.devAccountTitle")}</p>
                    <p className="mt-2 break-all">{t("opsAccess.devAccountId")}</p>
                    <p className="mt-1 break-all">{t("opsAccess.devAccountPassword")}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-white/70 p-4">
                    <p className="font-semibold">{t("opsAccess.devSeedTitle")}</p>
                    <p className="mt-2 whitespace-pre-line">{t("opsAccess.devSeedDescription")}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isDevelopment && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{t("opsAccess.readinessTitle")}</CardTitle>
                      <CardDescription>{t("opsAccess.readinessDescription")}</CardDescription>
                    </div>

                    <Button variant="outline" size="sm" onClick={refreshReadiness} disabled={isReadinessLoading}>
                      <RefreshCcw className={`mr-2 h-4 w-4 ${isReadinessLoading ? "animate-spin" : ""}`} />
                      {t("opsAccess.readinessRefresh")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!readiness && !isReadinessLoading && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      {t("opsAccess.readinessEmpty")}
                    </div>
                  )}

                  {isReadinessLoading && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      {t("opsAccess.readinessLoading")}
                    </div>
                  )}

                  {readiness && (
                    <>
                      <div
                        className={`rounded-2xl border p-4 text-sm ${
                          readiness.ok
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          {readiness.ok ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <TriangleAlert className="h-4 w-4" />
                          )}
                          {readiness.ok
                            ? t("opsAccess.readinessHealthy")
                            : t("opsAccess.readinessNeedsAttention")}
                        </div>
                        <p className="mt-2 text-sm">
                          {t("opsAccess.readinessGeneratedAt", { date: readiness.generatedAt })}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {readiness.checks.map((check) => (
                          <div
                            key={check.key}
                            className={`rounded-2xl border p-4 ${
                              check.ok
                                ? "border-emerald-200 bg-emerald-50/70"
                                : "border-rose-200 bg-rose-50/70"
                            }`}
                          >
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              {check.ok ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <TriangleAlert className="h-4 w-4 text-rose-600" />
                              )}
                              {check.label}
                            </div>
                            <p className="mt-2 text-sm text-slate-700">{check.detail}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                  {t("opsAccess.whyTitle")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-slate-700">
                {t("opsAccess.whyDescription")}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
