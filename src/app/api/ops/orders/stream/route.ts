import { NextRequest, NextResponse } from "next/server";
import { getOpsOrdersDashboard, getOpsOrdersStreamFingerprint } from "@/lib/opsOrders";
import { getOperatorSession } from "@/lib/operatorAuth";

const encoder = new TextEncoder();

function createSseEvent(event: string, data: string) {
  return encoder.encode(`event: ${event}\ndata: ${data}\n\n`);
}

export async function GET(request: NextRequest) {
  const operator = await getOperatorSession();
  if (!operator.ok) {
    return NextResponse.json({ error: operator.message }, { status: operator.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  const stream = new ReadableStream({
    async start(controller) {
      let lastFingerprint = "";
      let closed = false;

      const pushSnapshot = async () => {
        const dashboard = await getOpsOrdersDashboard({ status, search });
        const fingerprint = getOpsOrdersStreamFingerprint(dashboard);

        if (fingerprint !== lastFingerprint) {
          lastFingerprint = fingerprint;
          controller.enqueue(
            createSseEvent(
              "dashboard-update",
              JSON.stringify({
                generatedAt: dashboard.generatedAt,
                summary: dashboard.summary,
                statusCounts: dashboard.statusCounts,
                orderCount: dashboard.orders.length,
              }),
            ),
          );
        } else {
          controller.enqueue(
            createSseEvent(
              "heartbeat",
              JSON.stringify({
                generatedAt: new Date().toISOString(),
              }),
            ),
          );
        }
      };

      try {
        controller.enqueue(
          createSseEvent(
            "ready",
            JSON.stringify({
              generatedAt: new Date().toISOString(),
            }),
          ),
        );
        await pushSnapshot();
      } catch (error) {
        controller.enqueue(
          createSseEvent(
            "stream-error",
            JSON.stringify({
              message: String(error),
            }),
          ),
        );
      }

      const interval = setInterval(async () => {
        if (closed) return;

        try {
          await pushSnapshot();
        } catch (error) {
          controller.enqueue(
            createSseEvent(
              "stream-error",
              JSON.stringify({
                message: String(error),
              }),
            ),
          );
        }
      }, 5000);

      const abort = () => {
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Ignore close after abort race.
        }
      };

      request.signal.addEventListener("abort", abort);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
