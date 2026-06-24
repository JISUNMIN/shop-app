import { NextRequest, NextResponse } from "next/server";
import { getOpsOrdersDashboard } from "@/lib/opsOrders";
import { getOperatorSession } from "@/lib/operatorAuth";

export async function GET(request: NextRequest) {
  try {
    const operator = await getOperatorSession();
    if (!operator.ok) {
      return NextResponse.json({ error: operator.message }, { status: operator.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const dashboard = await getOpsOrdersDashboard({ status, search });
    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch operator orders", detail: String(error) },
      { status: 500 },
    );
  }
}
