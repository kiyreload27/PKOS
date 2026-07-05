"use client";

import { useState } from "react";
import { useDailyBriefing } from "@/lib/hooks/useDailyBriefing";
import { ExplainabilityDrawer } from "@/components/ExplainabilityDrawer";

function getCategoryStyle(category: string) {
  switch (category) {
    case "attention":
      return "border-l-blue-500";
    case "change":
      return "border-l-yellow-500";
    case "memory":
      return "border-l-purple-500";
    case "relationship":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
}

export default function DailyBriefingPage() {
  const contextId = "context-alpha"; // later wired to real context switcher
  const { items, snapshot, isLoading } = useDailyBriefing(contextId);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 text-white/60">
        Loading Daily Briefing...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Daily Briefing
        </h1>

        <p className="text-sm text-white/50">
          {snapshot
            ? `Generated ${new Date(snapshot.generatedAt).toLocaleString()}`
            : "No data available"}
        </p>
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="text-white/40 border border-white/10 p-4 rounded-lg">
          No briefing data yet. Run Golden Path ingestion.
        </div>
      )}

      {/* FEED */}
      <div className="space-y-3">
        {items.map((item: any) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item.id)}
            className={`border-l-4 ${getCategoryStyle(
              item.category
            )} bg-white/5 p-4 rounded-md cursor-pointer hover:bg-white/10 transition-colors`}
          >
            <div className="flex justify-between">
              <div className="font-medium">
                {item.title}
              </div>

              <div className="text-xs text-white/40">
                {item.category}
              </div>
            </div>

            {item.subtitle && (
              <div className="text-sm text-white/60 mt-1">
                {item.subtitle}
              </div>
            )}

            <div className="text-xs text-white/30 mt-2">
              Rank: {item.rank.toFixed(3)}
            </div>
          </div>
        ))}
      </div>

      <ExplainabilityDrawer
        itemId={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
