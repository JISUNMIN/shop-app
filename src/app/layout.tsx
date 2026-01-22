// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "@/context/TranslationContext";
import I18nProvider from "@/i18n/I18nextProvider";
import ClientLayout from "@/components/layout/ClientLayout";

import { auth } from "@/auth";
import SessionProvider from "@/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoboShop - 스마트 로봇 전문몰",
  description: "미래를 여는 스마트 로봇들을 만나보세요. 반려로봇부터 산업용 로봇까지!",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <TranslationProvider>
            <QueryProvider>
              <I18nProvider>
                <div className="flex min-h-screen flex-col items-center">
                  <Header />
                  <main className="flex-1 w-full max-w-6xl px-4">{children}</main>
                </div>
                <ClientLayout />
                <Toaster />
              </I18nProvider>
            </QueryProvider>
          </TranslationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
