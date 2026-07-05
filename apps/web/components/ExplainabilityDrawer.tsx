"use client";

import { useExplainability } from "@/lib/hooks/useExplainability";

export function ExplainabilityDrawer({
  itemId,
  onClose
}: {
  itemId: string | null;
  onClose: () => void;
}) {
  const { explanation } = useExplainability(itemId ?? undefined);

  if (!itemId) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-black border-l border-white/10 p-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-white/60 text-sm mb-4"
      >
        Close
      </button>

      {!explanation && (
        <div className="text-white/40">
          Loading explanation...
        </div>
      )}

      {explanation && (
        <>
          {/* HEADER */}
          <div className="mb-4">
            <div className="text-lg font-semibold text-white">
              Why this item appears
            </div>

            <div className="text-sm text-white/40">
              Entity: {explanation.entity?.name}
            </div>

            <div className="text-xs text-white/30 mt-1">
              Final score: {explanation.finalScore.toFixed(3)}
            </div>
          </div>

          {/* SCORE BREAKDOWN */}
          <div className="mb-6 text-xs text-white/60 space-y-1">
            <div>Attention: {explanation.scoreBreakdown.attention}</div>
            <div>Memory: {explanation.scoreBreakdown.memory}</div>
            <div>
              Relationships: {explanation.scoreBreakdown.relationships}
            </div>
            <div>Recency: {explanation.scoreBreakdown.recency}</div>
          </div>

          {/* SIGNALS */}
          <div className="space-y-3">
            {explanation.contributingSignals.map((s: any) => (
              <div
                key={s.id}
                className="border border-white/10 p-2 rounded"
              >
                <div className="text-xs text-white/50">
                  {s.type} • weight {s.weight}
                </div>

                <div className="text-sm text-white/80">
                  {s.summary}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
