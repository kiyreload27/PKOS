import { Entity, Relationship, GraphSnapshot } from "./types";

const LAMBDA = 0.0025;

export function recencyScore(timestamp: number, now: number): number {
  const age = now - timestamp;
  return Math.exp(-LAMBDA * age);
}

export function connectivityScore(entityId: string, relationships: Relationship[]): number {
  let degree = 0;
  for (const r of relationships) {
    if (r.from === entityId || r.to === entityId) degree++;
  }
  return Math.log(1 + degree);
}

export function importanceScore(entityId: string, snapshot: GraphSnapshot): number {
  const relScore = connectivityScore(entityId, snapshot.relationships);
  const obsScore = snapshot.observations.filter(o => o.entityId === entityId).length;
  return relScore + Math.log(1 + obsScore);
}

export function conflictPressure(entityId: string, relationships: Relationship[]): number {
  let pressure = 0;
  const map = new Map<string, number>();

  for (const r of relationships) {
    if (r.from === entityId || r.to === entityId) {
      const key = r.type;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
  }

  // contradiction = repeated role changes / edge churn
  for (const count of map.values()) {
    if (count > 1) pressure += count;
  }

  return pressure;
}

export function memoryWeight(entityId: string, snapshot: GraphSnapshot): number {
  const appearances = snapshot.events.filter(e =>
    JSON.stringify(e).includes(entityId)
  ).length;

  return Math.log(1 + appearances);
}
