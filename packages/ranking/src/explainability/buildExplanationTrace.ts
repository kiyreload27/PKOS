import { PrismaClient } from "@prisma/client";

export interface ExplainabilityTrace {
  itemId: string;

  entity?: {
    id: string;
    name: string;
  };

  contributingSignals: {
    type: "EVENT" | "RELATIONSHIP" | "OBSERVATION" | "ANCHOR";
    id: string;
    weight: number;
    summary: string;
  }[];

  scoreBreakdown: {
    attention: number;
    memory: number;
    relationships: number;
    recency: number;
  };

  finalScore: number;
}

export class ExplainabilityBuilder {
  constructor(private readonly db: PrismaClient) {}

  async build(item: any): Promise<ExplainabilityTrace> {
    const contributingSignals: ExplainabilityTrace["contributingSignals"] =
      [];

    let attention = 0;
    let memory = 0;
    let relationships = 0;
    let recency = 0;

    /**
     * 1. ENTITY SIGNALS
     */
    if (item.entityId) {
      const entity = await this.db.entity.findUnique({
        where: { id: item.entityId }
      });

      if (entity) {
        attention += 0.4;

        contributingSignals.push({
          type: "ANCHOR",
          id: entity.id,
          weight: 0.4,
          summary: `Entity "${entity.id}" is a high-importance anchor` // Replaced entity.name with entity.id for now
        });
      }

      /**
       * 2. OBSERVATIONS (memory signal)
       */
      const observations = await this.db.observation.findMany({
        where: { entityId: item.entityId },
        take: 5,
        orderBy: { createdAt: "desc" }
      });

      for (const obs of observations) {
        memory += 0.1;

        contributingSignals.push({
          type: "OBSERVATION",
          id: obs.id,
          weight: 0.1,
          summary: obs.statement.slice(0, 80) // Replaced text with statement based on schema
        });
      }

      /**
       * 3. RELATIONSHIPS
       */
      const relationshipsDb = await this.db.relationship.findMany({
        where: {
          OR: [
            { sourceId: item.entityId },
            { targetId: item.entityId }
          ]
        },
        take: 5
      });

      for (const r of relationshipsDb) {
        relationships += 0.1;

        contributingSignals.push({
          type: "RELATIONSHIP",
          id: r.id,
          weight: 0.1,
          summary: `${r.typeId} connection` // Replaced r.type with r.typeId
        });
      }
    }

    /**
     * 4. TIMELINE EVENTS (recency pressure)
     */
    // Fallback to PKOSEvent since TimelineEvent is derived
    const events = await this.db.pKOSEvent.findMany({
      where: { aggregateId: item.entityId },
      orderBy: { timestamp: "desc" },
      take: 3
    });

    for (const e of events) {
      recency += 0.15;

      contributingSignals.push({
        type: "EVENT",
        id: e.id,
        weight: 0.15,
        summary: e.type // Summary not implicitly on PKOSEvent schema, fallback to type
      });
    }

    const finalScore =
      attention + memory + relationships + recency;

    return {
      itemId: item.id,
      entity: item.entityId
        ? await this.db.entity.findUnique({
            where: { id: item.entityId }
          }).then(e => e ? { id: e.id, name: e.id } : undefined)
        : undefined,

      contributingSignals,
      scoreBreakdown: {
        attention,
        memory,
        relationships,
        recency
      },

      finalScore
    };
  }
}
