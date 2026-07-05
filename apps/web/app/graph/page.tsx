import { Network } from "lucide-react";

export default function GraphPage() {
  return (
    <div className="p-8 pt-24 max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-slate-200">
      <div className="flex flex-col items-center p-12 bg-slate-900/30 border border-slate-800/50 rounded-2xl">
        <Network className="w-16 h-16 text-indigo-500/50 mb-6" />
        <h1 className="text-3xl font-light text-white mb-2">Global Knowledge Graph</h1>
        <p className="text-slate-400 text-center max-w-md">
          The interactive visualization of your knowledge graph is currently under construction.
        </p>
      </div>
    </div>
  );
}
