"use client";

import { useState } from "react";

export default function IdentitySurgeryRoom() {
  return (
    <div className="p-6 max-w-5xl mx-auto text-white h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Identity Surgery Room</h1>
        <p className="text-sm text-white/50">Resolve high-conflict identity clusters</p>
      </div>
      
      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Left Panel: Conflict Queue */}
        <div className="w-1/3 border-r border-white/10 pr-6 overflow-y-auto">
          <div className="text-lg font-medium mb-4">Conflict Queue</div>
          {/* Mock Conflict Card */}
          <div className="border border-red-500/30 bg-red-500/5 p-4 rounded-md cursor-pointer hover:bg-red-500/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400">⚠️</span>
              <span className="font-semibold">Sarah Identity Conflict (0.87)</span>
            </div>
            <div className="text-sm text-white/60 mb-3">3 competing entities</div>
            <ul className="text-xs text-white/50 space-y-1 mb-3 list-disc pl-4">
              <li>Sarah (Designer)</li>
              <li>Sarah S.</li>
              <li>S. (mentioned in notes)</li>
            </ul>
            <div className="text-xs bg-white/10 w-fit px-2 py-1 rounded">Suggested: MERGE</div>
          </div>
        </div>

        {/* Center Panel: Evidence Graph */}
        <div className="w-1/3 border-r border-white/10 px-6 flex flex-col items-center justify-center">
           <div className="text-white/40 italic">Mini causal graph renders here...</div>
        </div>

        {/* Right Panel: Decision Controls */}
        <div className="w-1/3 pl-6 flex flex-col gap-4">
          <div className="text-lg font-medium mb-2">Decision Controls</div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded w-full font-medium transition-colors">
            Merge Entities
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded w-full font-medium transition-colors">
            Keep Separate
          </button>
          <button className="bg-transparent border border-white/20 hover:bg-white/5 text-white/60 py-2 px-4 rounded w-full text-sm transition-colors">
            Mark as Ambiguous (Deferred)
          </button>
        </div>
      </div>
    </div>
  );
}
