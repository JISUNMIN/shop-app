import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { issueWelcomeCouponToUser } from "@/utils/coupon";

type AppRole = "USER" | "ADMIN";
type AuthShape = {
  userId?: string | null;
  phone?: string | null;
  role?: AppRole | null;
};

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
        const dbUser = user as (typeof user & AuthShape) | null;

        if (!dbUser?.password) return null;

        const ok = await bcrypt.compare(password, dbUser.password);
        if (!ok) return null;

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          userId: dbUser.userId,
          phone: dbUser.phone,
          role: dbUser.role ?? "USER",
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
        const authUser = user as typeof user & AuthShape;
        token.id = user.id;
        token.userId = authUser.userId;
        token.phone = authUser.phone;
        token.role = authUser.role ?? token.role;
      }

      if (token.id && !token.role) {
        const dbUser = (await prisma.user.findUnique({
          where: { id: token.id as string },
        })) as ({ role?: AppRole | null } & { id: string }) | null;
        token.role = dbUser?.role ?? "USER";
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.id) return session;

      const sessionUser = session.user as typeof session.user & {
        id: string;
        userId?: string | null;
        provider?: string | null;
        phone?: string | null;
        role?: AppRole | null;
      };
      sessionUser.id = token.id;
      sessionUser.userId = token.userId;
      sessionUser.provider = token.provider;
      sessionUser.phone = token.phone;
      sessionUser.role = token.role as AppRole | null | undefined;

      return session;
    },
  },
});
