// app/providers/SessionProvider.tsx

"use client";
import { SessionProvider as AuthSessionProvider, SessionProviderProps } from "next-auth/react";

export default function SessionProvider({ children, session }: SessionProviderProps) {
  return <AuthSessionProvider session={session}>{children}</AuthSessionProvider>;
}
