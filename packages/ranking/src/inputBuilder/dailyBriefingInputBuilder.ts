import { PrismaClient } from "@prisma/client";

export interface DailyBriefingInput {
  contextId: string;
  dateRange: {
    from: Date;
    to: Date;
  };

  anchors: AnchorEntity[];
  entities: EntityNode[];
  relationships: RelationshipEdge[];
  observations: ObservationNode[];
  recentEvents: TimelineEventNode[];

  metadata: {
    totalEntitiesSeen: number;
    totalRelationshipsSeen: number;
    pruningStats: {
      entityLimitHit: boolean;
      relationshipLimitHit: boolean;
    };
  };
}

export interface AnchorEntity {
  id: string;
  name: string;
  type: string;
  score: number;
  reason: "RECENT_ACTIVITY" | "HIGH_CONNECTIONS" | "USER_CONTEXT" | "MEMORY_CARD";
}

export interface EntityNode {
  id: string;
  name: string;
  type: string;
  lastUpdated: Date;
  confidence: number;
  relationshipCount: number;
}

export interface RelationshipEdge {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: string;
  confidence: number;
  createdAt: Date;
}

export interface ObservationNode {
  id: string;
  entityId: string;
  text: string;
  confidence: number;
  createdAt: Date;
}

export interface TimelineEventNode {
  id: string;
  type: string;
  aggregateId: string;
  timestamp: Date;
  summary: string;
}

/**
 * HARD CONSTRAINTS (non-negotiable runtime bounds)
 */
const MAX_ANCHORS = 10;
const MAX_ENTITIES = 80;
const MAX_RELATIONSHIPS = 120;
const MAX_OBSERVATIONS = 60;
const MAX_EVENTS = 40;
const MAX_HOPS = 2;

/**
 * Daily Briefing Input Builder
 * 
 * Purpose:
 * Converts a potentially massive knowledge graph into a tightly bounded,
 * high-signal context window for ranking.
 */
export class DailyBriefingInputBuilder {
  constructor(private readonly db: PrismaClient) {}

  async build(contextId: string, date: Date): Promise<DailyBriefingInput> {
    const from = new Date(date);
    from.setDate(from.getDate() - 1);

    const to = new Date(date);

    /**
     * STEP 1: Pull initial anchor candidates (cheap + indexed queries only)
     */
    const anchorCandidates = await this.fetchAnchorCandidates(contextId, from, to);

    const anchors = this.selectTopAnchors(anchorCandidates, MAX_ANCHORS);

    /**
     * STEP 2: BFS expansion from anchors (bounded graph crawl)
     */
    const { entities, relationships } = await this.boundedGraphExpansion(
      anchors,
      contextId
    );

    /**
     * STEP 3: Pull observations (secondary signal layer)
     */
    const observations = await this.fetchObservations(
      entities.map(e => e.id),
      contextId
    );

    /**
     * STEP 4: Recent timeline events (temporal signal layer)
     */
    const recentEvents = await this.fetchRecentEvents(contextId, from, to);

    return {
      contextId,
      dateRange: { from, to },
      anchors,
      entities,
      relationships,
      observations,
      recentEvents,
      metadata: {
        totalEntitiesSeen: entities.length,
        totalRelationshipsSeen: relationships.length,
        pruningStats: {
          entityLimitHit: entities.length >= MAX_ENTITIES,
          relationshipLimitHit: relationships.length >= MAX_RELATIONSHIPS
        }
      }
    };
  }

  /**
   * STEP 1: Anchor Selection (low-cost query, highly indexed fields only)
   */
  private async fetchAnchorCandidates(contextId: string, from: Date, to: Date) {
    const [recentEntities, highActivityEvents, memoryCards] = await Promise.all([
      this.db.entity.findMany({
        where: { contextId },
        orderBy: { lastUpdated: "desc" },
        take: 50
      }),

      // Assuming a TimelineEvent table derived from PKOSEvent
      (this.db as any).timelineEvent.findMany({
        where: {
          contextId,
          timestamp: { gte: from, lte: to }
        },
        orderBy: { timestamp: "desc" },
        take: 50
      }),

      // Assuming MemoryCard table exists
      (this.db as any).memoryCard.findMany({
        where: { contextId },
        orderBy: { lastAccessed: "desc" },
        take: 20
      })
    ]);

    return { recentEntities, highActivityEvents, memoryCards };
  }

  private selectTopAnchors(raw: any, limit: number): AnchorEntity[] {
    const anchors: AnchorEntity[] = [];

    for (const e of raw.recentEntities) {
      anchors.push({
        id: e.id,
        name: e.name, // assumes name exists on projection
        type: e.typeId ?? "Unknown", 
        score: this.scoreEntity(e),
        reason: "RECENT_ACTIVITY"
      });
    }

    for (const m of raw.memoryCards) {
      anchors.push({
        id: m.entityId,
        name: m.title,
        type: "MemoryCard",
        score: 0.9,
        reason: "MEMORY_CARD"
      });
    }

    for (const ev of raw.highActivityEvents) {
      anchors.push({
        id: ev.aggregateId,
        name: ev.summary ?? ev.type,
        type: "EventAnchor",
        score: 0.7,
        reason: "USER_CONTEXT"
      });
    }

    return anchors
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * STEP 2: Controlled BFS expansion
   */
  private async boundedGraphExpansion(
    anchors: AnchorEntity[],
    contextId: string
  ): Promise<{ entities: EntityNode[]; relationships: RelationshipEdge[] }> {
    const visited = new Set<string>();
    const entityQueue = [...anchors.map(a => a.id)];

    const entities: EntityNode[] = [];
    const relationships: RelationshipEdge[] = [];

    let hops = 0;

    while (entityQueue.length > 0 && hops < MAX_HOPS) {
      const batch = entityQueue.splice(0, 25);

      const edges = await this.db.relationship.findMany({
        where: {
          OR: [
            { sourceId: { in: batch } },
            { targetId: { in: batch } }
          ],
          // Note: Relationship in schema doesn't have contextId, assuming we're checking something else or omitting it
        },
        take: MAX_RELATIONSHIPS
      });

      for (const edge of edges) {
        if (relationships.length >= MAX_RELATIONSHIPS) break;

        relationships.push({
          id: edge.id,
          fromEntityId: edge.sourceId,
          toEntityId: edge.targetId,
          type: edge.typeId,
          confidence: edge.confidence,
          createdAt: edge.createdAt
        });

        const nextEntity =
          edge.sourceId === batch[0] ? edge.targetId : edge.sourceId;

        if (!visited.has(nextEntity) && entities.length < MAX_ENTITIES) {
          entityQueue.push(nextEntity);
          visited.add(nextEntity);

          const entity = await this.db.entity.findUnique({
            where: { id: nextEntity }
          });

          if (entity) {
            entities.push({
              id: entity.id,
              name: entity.id, // Replace with actual naming logic
              type: entity.typeId,
              lastUpdated: entity.updatedAt,
              confidence: 0.5, // Not currently on entity schema, mock for now
              relationshipCount: 0 // Mock for now
            });
          }
        }
      }

      hops++;
    }

    return { entities, relationships };
  }

  /**
   * STEP 3: Observation fetch (post-graph enrichment layer)
   */
  private async fetchObservations(entityIds: string[], contextId: string) {
    const obs = await this.db.observation.findMany({
      where: {
        entityId: { in: entityIds }
        // contextId mapping if it existed
      },
      orderBy: { createdAt: "desc" },
      take: MAX_OBSERVATIONS
    });
    
    return obs.map(o => ({
      id: o.id,
      entityId: o.entityId,
      text: o.statement,
      confidence: o.confidenceValue,
      createdAt: o.createdAt
    }));
  }

  /**
   * STEP 4: Timeline windowing
   */
  private async fetchRecentEvents(contextId: string, from: Date, to: Date) {
    // Uses PKOSEvent table directly as timeline approximation for now
    const evts = await this.db.pKOSEvent.findMany({
      where: {
        timestamp: { gte: from, lte: to }
      },
      orderBy: { timestamp: "desc" },
      take: MAX_EVENTS
    });
    
    return evts.map(e => ({
      id: e.id,
      type: e.type,
      aggregateId: e.aggregateId,
      timestamp: e.timestamp,
      summary: e.type
    }));
  }

  /**
   * Simple heuristic scoring (kept intentionally dumb)
   */
  private scoreEntity(entity: any): number {
    let score = 0;

    if (entity.updatedAt) score += 0.4;
    if (entity.relationshipCount > 5) score += 0.3;
    if (entity.typeId === "Person") score += 0.2;

    return Math.min(score, 1);
  }
}
