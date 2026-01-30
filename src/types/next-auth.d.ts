import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string | null | undefined;
      userId?: string | null | undefined;
      provider?: string | null | undefined;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    phone?: string | null | undefined;
    userId?: string | null | undefined;
    provider?: string | null | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string | null | undefined;
    userId?: string | null | undefined;
    provider?: string | null | undefined;
  }
}
