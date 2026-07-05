import { computeCollapseScore } from "../math/computeCollapseScore";

export async function collapseEngine(entities: any[]) {
  const results = [];

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const a = entities[i];
      const b = entities[j];

      const score = computeCollapseScore(a, b);

      if (score < 0.7) continue;

      if (score >= 0.7 && score < 0.8) {
        results.push({
          type: "PROPOSE_MERGE",
          entities: [a, b],
          score,
        });
      }

      if (score >= 0.8 && score < 0.9) {
        results.push({
          type: "SOFT_COLLAPSE",
          entities: [a, b],
          score,
        });
      }

      if (score >= 0.9) {
        results.push({
          type: "HARD_COLLAPSE",
          entities: [a, b],
          score,
        });
      }
    }
  }

  return results;
}
