"use client";

import { Cpu, ListTree, HeartPulse, Compass } from "lucide-react";

export function StatusDock() {
  return (
    <div className="absolute bottom-6 right-6 z-50">
      <div className="flex items-center space-x-3 bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 p-2 rounded-full shadow-2xl text-xs text-neutral-400 font-medium">
        
        {/* Active Context */}
        <div className="flex items-center space-x-2 px-3 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/20 transition-colors" title="Active Context (Manual)">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-400 font-semibold">PKOS Development</span>
        </div>

        <div className="w-px h-4 bg-neutral-800"></div>

        <div className="flex items-center space-x-2 px-3">
          <div className="relative flex h-2 w-2 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <span className="text-emerald-500">Idle</span>
        </div>

        <div className="w-px h-4 bg-neutral-800"></div>

        <div className="flex items-center space-x-2 px-2 hover:text-white transition-colors cursor-default" title="Worker Queue">
          <Cpu className="w-3.5 h-3.5" />
          <span>3 Jobs</span>
        </div>

        <div className="w-px h-4 bg-neutral-800"></div>

        <div className="flex items-center space-x-2 px-2 hover:text-white transition-colors cursor-default" title="Entities">
          <ListTree className="w-3.5 h-3.5" />
          <span>847</span>
        </div>

        <div className="w-px h-4 bg-neutral-800"></div>

        <div className="flex items-center space-x-2 px-2 pr-3 hover:text-white transition-colors cursor-default" title="System Memory">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Healthy</span>
        </div>
        
      </div>
    </div>
  );
}
