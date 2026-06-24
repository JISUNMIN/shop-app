import { auth } from "@/auth";
import type { Session } from "next-auth";

export async function getOperatorSession() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id) {
    return {
      ok: false as const,
      status: 401,
      message: "Unauthorized",
      session: null,
    };
  }

  if (role !== "ADMIN") {
    return {
      ok: false as const,
      status: 403,
      message: "Operator access required",
      session: session as Session,
    };
  }

  return {
    ok: true as const,
    status: 200,
    message: null,
    session: session as Session,
  };
}
