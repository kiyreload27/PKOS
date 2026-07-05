import { Candidate } from "./candidates";

export function diversify(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  const result: Candidate[] = [];

  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    if (seen.has(c.entityId)) continue;

    seen.add(c.entityId);
    result.push(c);

    if (result.length >= 12) break;
  }

  return result;
}
