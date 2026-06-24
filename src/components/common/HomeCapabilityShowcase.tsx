"use client";

import Link from "next/link";
import { Activity, ArrowRight, Boxes, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const capabilityIconMap = [Boxes, Activity, ShieldCheck] as const;

export default function HomeCapabilityShowcase() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const capabilities = [
    {
      title: t("homeShowcase.cards.statusMachine.title"),
      description: t("homeShowcase.cards.statusMachine.description"),
    },
    {
      title: t("homeShowcase.cards.opsBoard.title"),
      description: t("homeShowcase.cards.opsBoard.description"),
    },
    {
      title: t("homeShowcase.cards.claimFlow.title"),
      description: t("homeShowcase.cards.claimFlow.description"),
    },
  ];

  const proofItems = [
    t("homeShowcase.proof.statuses"),
    t("homeShowcase.proof.timeline"),
    t("homeShowcase.proof.live"),
    t("homeShowcase.proof.sla"),
  ];

  return (
    <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.05),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)] lg:items-stretch">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.65)] md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-0 bg-white/10 px-3 py-1 text-white">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {t("homeShowcase.badge")}
              </Badge>
              <Badge className="border border-white/15 bg-white/5 px-3 py-1 text-slate-200">
                {t("homeShowcase.badgeSecondary")}
              </Badge>
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              {t("homeShowcase.title")}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              {t("homeShowcase.description")}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {t("homeShowcase.stats.statusesLabel")}
                </p>
                <p className="mt-3 text-2xl font-bold text-white">
                  {t("homeShowcase.stats.statusesValue")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {t("homeShowcase.stats.claimsLabel")}
                </p>
                <p className="mt-3 text-2xl font-bold text-white">
                  {t("homeShowcase.stats.claimsValue")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {t("homeShowcase.stats.opsLabel")}
                </p>
                <p className="mt-3 text-2xl font-bold text-white">
                  {t("homeShowcase.stats.opsValue")}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/mypage?tab=orders">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("homeShowcase.primaryCta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href={isAdmin ? "/ops/orders" : "/support"}>
                <Button size="lg" variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto">
                  {isAdmin ? t("homeShowcase.secondaryCtaAdmin") : t("homeShowcase.secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {capabilities.map((item, index) => {
              const Icon = capabilityIconMap[index];

              return (
                <Card
                  key={item.title}
                  className="overflow-hidden border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklch, var(--button-bg) 18%, white), color-mix(in oklch, var(--button-bg) 4%, white))",
                        border: "1px solid color-mix(in oklch, var(--button-bg) 18%, transparent)",
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: "var(--button-bg)" }} />
                    </div>

                    <div>
                      <p className="text-base font-bold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card className="border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ClipboardCheck className="h-4 w-4" style={{ color: "var(--button-bg)" }} />
                {t("homeShowcase.proofTitle")}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {proofItems.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full border-slate-200 px-3 py-1 text-slate-700">
                    {item}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
