import { Candidate } from "./candidates";

export function normalize(candidates: Candidate[]): Candidate[] {
  const maxPerCategory = new Map<string, number>();
  const result: Candidate[] = [];

  const sorted = [...candidates].sort((a, b) => b.score - a.score);

  for (const c of sorted) {
    const count = maxPerCategory.get(c.category) ?? 0;

    if (count >= 0.4 * sorted.length) continue;

    maxPerCategory.set(c.category, count + 1);
    result.push(c);
  }

  return result;
}
