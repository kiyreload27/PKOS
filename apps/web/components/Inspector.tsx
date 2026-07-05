"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Network, Clock, ListChecks, Database, Beaker, History, Zap, Settings, BrainCircuit, ShieldAlert } from "lucide-react";
import { useState } from "react";

export type InspectorObject = {
  id: string;
  type: string; // e.g., 'Repository', 'Entity', 'Observation'
  title: string;
  capabilities: string[]; // e.g., ['HasTimeline', 'HasRelationships', 'HasEvidence', 'HasAI']
  data: any;
};

interface UniversalInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  object: InspectorObject | null;
}

export function UniversalInspector({ isOpen, onClose, object }: UniversalInspectorProps) {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  if (!object) return null;

  const tabs = [
    { id: "Overview", icon: Database, show: true },
    { id: "Timeline", icon: Clock, show: object.capabilities.includes("HasTimeline") },
    { id: "Relationships", icon: Network, show: object.capabilities.includes("HasRelationships") },
    { id: "Evidence", icon: ShieldAlert, show: object.capabilities.includes("HasEvidence") },
    { id: "Knowledge", icon: Beaker, show: object.capabilities.includes("HasKnowledge") },
    { id: "History", icon: History, show: object.capabilities.includes("HasHistory") },
    { id: "Resources", icon: Settings, show: object.capabilities.includes("HasResources") },
    { id: "Context", icon: ListChecks, show: object.capabilities.includes("HasContext") },
    { id: "Actions", icon: Zap, show: object.capabilities.includes("HasActions") },
    { id: "AI", icon: BrainCircuit, show: object.capabilities.includes("HasAI") },
  ].filter(t => t.show);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0A0A0A] border-l border-slate-800/80 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/20">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mb-1 block">
                  {object.type}
                </span>
                <h2 className="text-2xl font-light text-white tracking-tight">{object.title}</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-900 rounded-md border border-slate-800 hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation */}
            <div className="px-6 border-b border-slate-800/80 flex space-x-6 overflow-x-auto no-scrollbar bg-slate-900/10">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? "border-indigo-500 text-indigo-400" 
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.id}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 text-slate-300">
              {activeTab === "Overview" && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/50">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Intrinsic Properties</h3>
                    <pre className="text-sm text-slate-400 font-mono whitespace-pre-wrap">
                      {JSON.stringify(object.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              {activeTab !== "Overview" && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Beaker className="w-12 h-12 text-slate-700 mb-4" />
                  <h3 className="text-lg font-medium text-slate-300">{activeTab}</h3>
                  <p className="text-slate-500 mt-2">Section implementation details are handled by plugins or generic renderers.</p>
                </div>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
