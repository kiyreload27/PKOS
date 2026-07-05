import { GraphSnapshot } from "./types";
import {
  importanceScore,
  recencyScore,
  conflictPressure,
  memoryWeight
} from "./scoring";

export interface Candidate {
  entityId: string;
  score: number;
  category: "change" | "attention" | "conflict" | "memory" | "insight";
  reason: string;
}

export function buildCandidates(snapshot: GraphSnapshot, now: number): Candidate[] {
  const entityIds = snapshot.entities.map(e => e.id);
  const candidates: Candidate[] = [];

  for (const id of entityIds) {
    const importance = importanceScore(id, snapshot);
    const conflict = conflictPressure(id, snapshot.relationships);
    const memory = memoryWeight(id, snapshot);

    const recency = snapshot.events.length
      ? recencyScore(snapshot.events.at(-1)!.timestamp, now)
      : 0;

    const score =
      0.30 * recency +
      0.25 * importance +
      0.20 * conflict +
      0.15 * memory;

    let category: Candidate["category"] = "attention";

    if (conflict > 2) category = "conflict";
    else if (memory > 2) category = "memory";
    else if (importance > 3) category = "attention";

    candidates.push({
      entityId: id,
      score,
      category,
      reason: `imp=${importance.toFixed(2)} conf=${conflict.toFixed(2)} mem=${memory.toFixed(2)}`
    });
  }

  return candidates;
}
