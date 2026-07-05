import { Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { prisma } from "@pkos/database";
import { CaptureProjectionHandler, InboxProjectionHandler, MemoryCardProjectionHandler } from "@pkos/projections";
import {
  ClassificationEngine,
  EmbeddingEngine,
  IdentityEngine,
  MemoryEngine,
  ObservationEngine,
  RelationshipEngine,
  SummaryEngine
} from "@pkos/domain";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const captureProjectionHandler = new CaptureProjectionHandler();
const inboxProjectionHandler = new InboxProjectionHandler();
const memoryCardProjectionHandler = new MemoryCardProjectionHandler();

// Engines
const classificationEngine = new ClassificationEngine();
const embeddingEngine = new EmbeddingEngine();
const identityEngine = new IdentityEngine();
const memoryEngine = new MemoryEngine();
const observationEngine = new ObservationEngine();
const relationshipEngine = new RelationshipEngine();
const summaryEngine = new SummaryEngine();

console.log("🚀 Background Worker Pipeline starting (Phase C)...");

async function recordMetric(name: string, value: number, tags: any = {}) {
  await prisma.platformMetric.create({
    data: { id: crypto.randomUUID(), name, value, tags }
  });
}

async function getNextVersion(aggregateId: string) {
  const count = await prisma.pKOSEvent.count({ where: { aggregateId } });
  return count + 1;
}

async function emitEvent(aggregateId: string, captureId: string, type: string, payload: any) {
  const version = await getNextVersion(aggregateId);
  const event = await prisma.pKOSEvent.create({
    data: {
      id: crypto.randomUUID(),
      aggregateId,
      captureId,
      type,
      version,
      payload
    }
  });
  await captureProjectionHandler.handle(event as any);
  await inboxProjectionHandler.handle(event as any);
  await memoryCardProjectionHandler.handle(event as any);
  return event;
}

async function handleCapturePipeline(job: Job) {
  const { captureId, content, analysis } = job.data;
  const startTime = Date.now();

  try {
    console.log(`[Job ${job.id}] Phase B Pipeline Start: Capture ${captureId}`);

    // 1. Identity Resolution (Non-blocking)
    await prisma.capture.update({ where: { id: captureId }, data: { status: "IdentityResolution", lastAttempt: new Date() }});
    const identityResult = await identityEngine.resolveIdentity(captureId, content, analysis?.primaryType || "");
    
    // Always create a Provisional Entity so the user gets immediate value
    const entityId = crypto.randomUUID();
    const resourceId = crypto.randomUUID();
    
    await prisma.entity.create({
      data: { id: entityId, typeId: "Provisional", owner: "User", externalIds: [], aliases: ["Generated Entity"], traits: [], capabilities: [] }
    });
    
    await prisma.resource.create({
      data: { id: resourceId, entityId, captureId, type: analysis?.primaryType || "PlainText", uri: `capture://${captureId}`, status: "ACTIVE", health: 100, source: "Universal Capture" }
    });
    
    await emitEvent(entityId, captureId, "ENTITY_CREATED", { isProvisional: true });

    if (identityResult.action === "MERGE_CANDIDATE") {
      await emitEvent(entityId, captureId, "MERGE_SUGGESTION_CREATED", { targetEntityId: identityResult.targetEntityId });
    }

    // 2. Classification
    await prisma.capture.update({ where: { id: captureId }, data: { status: "Classification" }});
    const classification = await classificationEngine.classify(content);
    await prisma.entity.update({
      where: { id: entityId },
      data: { typeId: classification.primaryType, traits: classification.traits }
    });
    await emitEvent(entityId, captureId, "CLASSIFICATION_COMPLETED", classification);

    // 3. Relationship Discovery
    await prisma.capture.update({ where: { id: captureId }, data: { status: "RelationshipDiscovery" }});
    const relationships = await relationshipEngine.discover(entityId, content);
    for (const rel of relationships) {
      const evidenceId = crypto.randomUUID();
      await prisma.evidence.create({
        data: { id: evidenceId, entityId, sourceCaptureId: captureId, type: "RelationshipEvidence", excerpt: rel.evidenceExcerpt, confidence: rel.confidence }
      });
      await prisma.relationship.create({
        data: { id: crypto.randomUUID(), sourceId: entityId, targetId: rel.targetId, typeId: rel.typeId, confidence: rel.confidence, generatedBy: "RelationshipEngine", provenanceSource: "AI", evidenceId }
      });
      await emitEvent(entityId, captureId, "RELATIONSHIP_DISCOVERED", rel);
    }

    // 4. Observation Generation
    await prisma.capture.update({ where: { id: captureId }, data: { status: "ObservationGeneration" }});
    const observations = await observationEngine.generateObservations(entityId, content);
    for (const obs of observations) {
      const evidenceId = crypto.randomUUID();
      await prisma.evidence.create({
        data: { id: evidenceId, entityId, sourceCaptureId: captureId, type: "ObservationEvidence", excerpt: obs.evidenceExcerpt, confidence: obs.confidence }
      });
      await prisma.observation.create({
        data: { id: crypto.randomUUID(), entityId, statement: obs.statement, state: "HYPOTHESIS", confidenceValue: obs.confidence, evidenceId }
      });
      await emitEvent(entityId, captureId, "OBSERVATION_GENERATED", obs);
    }

    // 5. Summary Generation
    await prisma.capture.update({ where: { id: captureId }, data: { status: "SummaryGeneration" }});
    const summaries = await summaryEngine.generateSummaries(entityId, content);
    await prisma.entitySummary.create({
      data: { id: crypto.randomUUID(), entityId, version: 1, short: summaries.short, medium: summaries.medium, technical: summaries.technical }
    });
    await emitEvent(entityId, captureId, "SUMMARY_GENERATED", { version: 1, ...summaries });

    // 6. Embeddings
    await prisma.capture.update({ where: { id: captureId }, data: { status: "Embedding" }});
    const vector = await embeddingEngine.embed(content);
    await prisma.embedding.create({
      data: { id: crypto.randomUUID(), targetId: entityId, model: "stub-embedder", vector }
    });
    // Emit purely for timeline/metrics
    await emitEvent(entityId, captureId, "EMBEDDING_GENERATED", { model: "stub-embedder" });

    // 7. Memory Engine
    await prisma.capture.update({ where: { id: captureId }, data: { status: "MemoryAssociation" }});
    const memories = await memoryEngine.recall(content);
    for (const mem of memories) {
      await emitEvent(entityId, captureId, "MEMORY_RECALLED", mem);
      await emitEvent(entityId, captureId, "MEMORY_SURFACED", mem); // Track surfacing for stats
    }
    
    const curatedCards = await memoryEngine.curateMemoryCards(entityId, observations);
    for (const card of curatedCards) {
      await emitEvent(entityId, captureId, "MEMORY_CARD_CREATED", card);
    }

    // 8. Projecting
    await prisma.capture.update({ where: { id: captureId }, data: { status: "Projecting" }});
    // In a real system, other projections run here

    // 9. Completed
    await prisma.capture.update({ where: { id: captureId }, data: { status: "Completed" }});
    
    const latency = Date.now() - startTime;
    await recordMetric("capture_pipeline_latency", latency, { captureId });

    console.log(`✅ [Job ${job.id}] Pipeline Completed in ${latency}ms`);
  } catch (error: any) {
    console.error(`❌ [Job ${job.id}] Pipeline Failed:`, error.message);
    
    await prisma.capture.update({ 
      where: { id: captureId }, 
      data: { 
        status: "Failed", 
        failureReason: error.message,
        retryCount: { increment: 1 } 
      }
    });

    await recordMetric("capture_pipeline_failure", 1, { captureId, error: error.message });
    throw error;
  }
}

const worker = new Worker(
  "pkos-workflows",
  async (job) => {
    if (job.name === "process-capture") {
      await handleCapturePipeline(job);
    }
  },
  { connection: connection as any }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed.`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err?.message);
});
