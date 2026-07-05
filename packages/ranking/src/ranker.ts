import { GraphSnapshot } from "./types";
import { buildCandidates } from "./candidates";
import { normalize } from "./normalize";
import { diversify } from "./diversify";

export interface BriefingItem {
  entityId: string;
  score: number;
  category: string;
  reason: string;
}

export interface DailyBriefing {
  whatChanged: BriefingItem[];
  whatMatters: BriefingItem[];
  whatIsUnstable: BriefingItem[];
  whatToRemember: BriefingItem[];
  whatIsConnected: BriefingItem[];
}

export function generateDailyBriefing(snapshot: GraphSnapshot, now: number): DailyBriefing {
  const candidates = buildCandidates(snapshot, now);
  const normalized = normalize(candidates);
  const final = diversify(normalized);

  const whatChanged = final.filter(c => c.category === "change").slice(0, 4);
  const whatMatters = final.filter(c => c.category === "attention").slice(0, 4);
  const whatIsUnstable = final.filter(c => c.category === "conflict").slice(0, 3);
  const whatToRemember = final.filter(c => c.category === "memory").slice(0, 3);
  const whatIsConnected = final.filter(c => c.category === "insight").slice(0, 4);

  return {
    whatChanged,
    whatMatters,
    whatIsUnstable,
    whatToRemember,
    whatIsConnected
  };
}
