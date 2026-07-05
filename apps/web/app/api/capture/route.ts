import { NextResponse } from "next/server";
import { prisma } from "@pkos/database";
import { Queue } from "bullmq";
import { CaptureAnalysisService, GitHubParser, DockerParser, URLParser, MarkdownParser, PlainTextParser } from "@pkos/domain";

const pkosQueue = new Queue("pkos-workflows", {
  connection: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
});

const analyzer = new CaptureAnalysisService();
// Dynamic Registration
analyzer.registerParser(new GitHubParser());
analyzer.registerParser(new DockerParser());
analyzer.registerParser(new URLParser());
analyzer.registerParser(new MarkdownParser());
analyzer.registerParser(new PlainTextParser());

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = body.content || "Empty Capture";
    
    // 1. Instantly analyze the input using pure deterministic parsers
    const analysis = analyzer.analyze(content);
    
    // 2. Persist the Capture immediately to ensure we never lose data
    const captureId = crypto.randomUUID();
    const capture = await prisma.capture.create({
      data: {
        id: captureId,
        content,
        source: "Universal Capture",
        status: "QUEUED",
        analysis: analysis as any,
      },
    });

    // 3. Emit CAPTURE_RECEIVED event
    await prisma.pKOSEvent.create({
      data: {
        id: crypto.randomUUID(),
        aggregateId: captureId,
        captureId,
        type: "CAPTURE_RECEIVED",
        version: 1,
        payload: { content, analysis } as any,
      },
    });

    // 4. Send to Worker Orchestrator
    await pkosQueue.add("process-capture", {
      captureId,
      content,
      analysis,
    });

    // 5. Return rich immediate response
    return NextResponse.json({
      success: true,
      captureId: captureId,
      analysis: {
        primaryType: analysis.primaryType,
        confidence: analysis.confidence,
        possibleTypes: analysis.possibleTypes,
        warnings: analysis.warnings,
      },
      queued: true
    });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
