import { Worker } from "bullmq";
import { collapseEngine } from "./engine/collapseEngine";
import { getCandidateEntities } from "./input/getCandidateEntities";
import { processCollapseResult } from "./output/processCollapseResult";
import { chunk } from "lodash";

export const collapseWorker = new Worker(
  "pkos-collapse-queue",
  async (job) => {
    if (job.name !== "RUN_MEMORY_COLLAPSE_CYCLE") return;

    const { windowDays, maxCandidates } = job.data.payload;

    const candidates = await getCandidateEntities({
      windowDays,
      limit: maxCandidates,
    });

    for (const batch of chunk(candidates, 50)) {
      const results = await collapseEngine(batch);

      for (const result of results) {
        await processCollapseResult(result);
      }
    }
  },
  {
    concurrency: 2,
  }
);
