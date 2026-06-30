"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent, MessageCircleMore, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomeCapabilityShowcase() {
  const { t } = useTranslation();

  const promoCards = [
    {
      href: "/special-offers",
      tone: "bg-[linear-gradient(135deg,#102033_0%,#1a2a3a_100%)] text-white shadow-[0_22px_50px_-30px_rgba(16,32,51,0.78)]",
      labelClass: "text-white/55",
      titleClass: "text-white",
      linkClass: "text-white/55",
      iconClass: "text-white/35",
      icon: BadgePercent,
      label: t("homeShowcase.promos.sale.label"),
      title: t("homeShowcase.promos.sale.title"),
      cta: t("homeShowcase.promos.sale.cta"),
    },
    {
      href: "/rental-service",
      tone: "bg-[linear-gradient(135deg,#f3faea_0%,#eaf3de_100%)] text-[#3b6d11] shadow-[0_22px_50px_-32px_rgba(99,153,34,0.28)]",
      labelClass: "text-[#639922]",
      titleClass: "text-[#3b6d11]",
      linkClass: "text-[#639922]",
      iconClass: "text-[#3b6d11]/35",
      icon: RefreshCcw,
      label: t("homeShowcase.promos.rental.label"),
      title: t("homeShowcase.promos.rental.title"),
      cta: t("homeShowcase.promos.rental.cta"),
    },
    {
      href: "/support",
      tone: "bg-[linear-gradient(135deg,#f5f3ff_0%,#eeedfe_100%)] text-[#3c3489] shadow-[0_22px_50px_-32px_rgba(83,74,183,0.25)]",
      labelClass: "text-[#534ab7]",
      titleClass: "text-[#3c3489]",
      linkClass: "text-[#534ab7]",
      iconClass: "text-[#3c3489]/35",
      icon: MessageCircleMore,
      label: t("homeShowcase.promos.matching.label"),
      title: t("homeShowcase.promos.matching.title"),
      cta: t("homeShowcase.promos.matching.cta"),
    },
  ];

  return (
    <section className="pb-10">
      <div className="grid gap-3 lg:grid-cols-3">
        {promoCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`flex min-h-[110px] items-center justify-between rounded-[1.5rem] border border-black/5 px-5 py-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_-26px_rgba(15,23,42,0.22)] ${card.tone}`}
            >
              <div className="min-w-0">
                <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${card.labelClass}`}>
                  {card.label}
                </p>
                <p className={`mt-1.5 text-base font-semibold leading-6 ${card.titleClass}`}>
                  {card.title}
                </p>
                <p className={`mt-2 inline-flex items-center gap-1 text-xs ${card.linkClass}`}>
                  {card.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>

              <Icon className={`ml-4 h-8 w-8 shrink-0 ${card.iconClass}`} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
