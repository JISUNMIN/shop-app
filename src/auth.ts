import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { issueWelcomeCouponToUser } from "@/utils/coupon";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        userId: { label: "UserId", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userId = typeof credentials?.userId === "string" ? credentials.userId.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!userId || !password) return null;

        const user = await prisma.user.findUnique({ where: { userId } });

        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          userId: user.userId,
          phone: user.phone,
        };
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: { prompt: "login", scope: "profile_nickname" },
      },
    }),

    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],

  events: {
    async createUser({ user }) {
      await issueWelcomeCouponToUser(prisma, user.id);
    },
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) token.provider = account.provider; // "kakao" | "naver" | "credentials"

      if (user) {
        token.id = user.id;
        token.userId = (user as any).userId;
        token.phone = (user as any).phone;
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.id) return session;

      (session.user as any).id = token.id;
      (session.user as any).userId = token.userId;
      (session.user as any).provider = token.provider;
      (session.user as any).phone = token.phone;

      return session;
    },
  },
});
