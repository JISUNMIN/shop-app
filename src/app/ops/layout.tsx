import { redirect } from "next/navigation";
import { getOperatorSession } from "@/lib/operatorAuth";

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const operator = await getOperatorSession();

  if (!operator.ok) {
    redirect(operator.status === 401 ? "/login" : "/");
  }

  return <>{children}</>;
}
