import { DailyBriefingInput } from "../inputBuilder/dailyBriefingInputBuilder";

export interface RankedItem {
  entityId?: string;
  type: string;
  title: string;
  subtitle?: string;
  rank: number;
  category: "attention" | "change" | "memory" | "relationship" | "context";
  payload: any;
}

export interface ECMOverlay {
  mode: "OFF" | "ASSISTED" | "ACTIVE";
  attentionRebalance: Record<string, number>; 
  suppressedEntities: Set<string>;
  boostedEntities: Set<string>;
  reasoning: {
    entityId: string;
    reason: "REDUCE_CONFLICT" | "REINFORCE_MEMORY" | "STABILIZE_IDENTITY";
  }[];
}

function computeBaseSignals(input: DailyBriefingInput): RankedItem[] {
  const items: RankedItem[] = [];

  /**
   * 1. ATTENTION LAYER (high signal entities)
   */
  for (const e of input.entities) {
    const rank =
      e.confidence * 0.4 +
      Math.min(e.relationshipCount / 10, 1) * 0.3 +
      (Date.now() - e.lastUpdated.getTime()) < 86400000 ? 0.3 : 0;

    items.push({
      entityId: e.id,
      type: "entity",
      title: e.name,
      rank,
      category: "attention",
      payload: e
    });
  }

  /**
   * 2. CHANGE LAYER (timeline + events)
   */
  for (const ev of input.recentEvents) {
    items.push({
      type: "event",
      title: ev.summary ?? ev.type,
      rank: 0.5,
      category: "change",
      payload: ev
    });
  }

  /**
   * 3. MEMORY LAYER (memory cards surfaced via evidence)
   */
  const memorySignals = new Map<string, number>();

  for (const o of input.observations) {
    memorySignals.set(
      o.entityId,
      (memorySignals.get(o.entityId) ?? 0) + o.confidence
    );
  }

  for (const [entityId, score] of memorySignals.entries()) {
    items.push({
      entityId,
      type: "memory",
      title: "Memory Signal",
      rank: Math.min(score / 3, 1),
      category: "memory",
      payload: { score }
    });
  }

  /**
   * 4. RELATIONSHIP SURFACING (graph tension)
   */
  for (const r of input.relationships) {
    items.push({
      type: "relationship",
      title: `${r.type}`,
      rank: r.confidence * 0.6,
      category: "relationship",
      payload: r
    });
  }

  return items;
}

export function applyECMOverlay(
  items: RankedItem[],
  ecm: ECMOverlay
): RankedItem[] {
  if (ecm.mode === "OFF") return items;

  return items.map((item) => {
    if (!item.entityId) return item;
    
    const delta = ecm.attentionRebalance[item.entityId] ?? 0;
    const suppressed = ecm.suppressedEntities.has(item.entityId);

    return {
      ...item,
      rank: suppressed
        ? item.rank * 0.1
        : item.rank * (1 + delta),
    };
  });
}

/**
 * Pure Ranking Core with ECM Overlay
 */
export function rankDailyBriefing(
  input: DailyBriefingInput,
  ecm?: ECMOverlay
): RankedItem[] {
  const defaultEcm: ECMOverlay = {
    mode: "OFF",
    attentionRebalance: {},
    suppressedEntities: new Set(),
    boostedEntities: new Set(),
    reasoning: []
  };

  const base = computeBaseSignals(input);
  const withECM = applyECMOverlay(base, ecm ?? defaultEcm);

  /**
   * FINAL SORT + NORMALIZATION LAYER
   */
  return withECM
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 50)
    .map((item, index) => ({
      ...item,
      rank: item.rank * (1 - index * 0.01) // slight decay to prevent domination
    }));
}
