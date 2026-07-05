import { prisma } from "@pkos/database";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let lastEventDate = new Date(0);
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection payload
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: "CONNECTED" })}\n\n`));

      const poll = async () => {
        if (isClosed) return;

        try {
          const events = await prisma.pKOSEvent.findMany({
            where: {
              captureId: id,
              timestamp: { gt: lastEventDate }
            },
            orderBy: { timestamp: 'asc' }
          });

          for (const event of events) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
            lastEventDate = event.timestamp;
            
            // If the worker has finished the pipeline, we can close the stream safely
            if (event.type === "ENRICHMENT_COMPLETED" || event.type === "CAPTURE_FAILED") {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ type: "DONE" })}\n\n`));
              isClosed = true;
              controller.close();
              return;
            }
          }
        } catch (error) {
          console.error("SSE Polling Error", error);
        }

        if (!isClosed) {
          setTimeout(poll, 1000); // Poll every second for new events
        }
      };

      poll();
    },
    cancel() {
      isClosed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}
