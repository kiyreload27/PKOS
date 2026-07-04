"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Clipboard, Image as ImageIcon, Mic, Paperclip, CheckCircle2, ChevronRight, Zap, Folder, ChevronDown } from "lucide-react";
import { LocalDetectionEngine, DetectionResult } from "@/lib/detection-engine";
import * as LucideIcons from "lucide-react";

// Mock Focus Bar Data
const currentFocus = {
  topic: "Black Ops 7",
  stats: ["12 captures", "3 new strategies"],
};

export default function MagicalCaptureDashboard() {
  const [input, setInput] = useState("");
  const [engine] = useState(() => new LocalDetectionEngine());
  const [detection, setDetection] = useState<DetectionResult>({ status: "idle", confidence: 0, detectedType: "", entities: [], suggestions: [], capabilities: [] });
  
  // Pipeline State
  const [pipelineState, setPipelineState] = useState<"idle" | "capturing" | "summarizing" | "relating" | "complete">("idle");
  const [nodes, setNodes] = useState<{ id: number; x: number; y: number }[]>([
    { id: 1, x: 20, y: 30 }, { id: 2, x: 80, y: 70 }, { id: 3, x: 50, y: 15 }
  ]);

  // Project State
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(data => setProjects(data.projects || []));
  }, []);

  // Handle Input Changes & progressive detection
  useEffect(() => {
    if (!input.trim()) {
      setDetection({ status: "idle", confidence: 0, detectedType: "", entities: [], suggestions: [], capabilities: [] });
      return;
    }
    
    engine.analyze(input, (partial) => {
      setDetection(partial);
    }).then((final) => setDetection(final));
    
  }, [input, engine]);

  const handleCapture = async () => {
    if (!input.trim()) return;
    
    // Simulate Action Pipeline UI Flow
    setPipelineState("capturing");
    
    // Background POST to actual API
    fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input, projectId: selectedProjectId }),
    }).catch(console.error);

    // UI Pipeline Animation
    setTimeout(() => setPipelineState("summarizing"), 800);
    setTimeout(() => setPipelineState("relating"), 1600);
    setTimeout(() => {
      setPipelineState("complete");
      // Add a node to the constellation to signify new knowledge
      setNodes(prev => [...prev, { id: Date.now(), x: Math.random() * 90 + 5, y: Math.random() * 90 + 5 }]);
    }, 2500);
    setTimeout(() => {
      setInput("");
      setPipelineState("idle");
    }, 4000);
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-start p-8 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* 1. Subtle Constellation Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
         {nodes.map(node => (
           <motion.div 
             key={node.id}
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: [0.5, 1, 0.5] }}
             transition={{ opacity: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" } }}
             className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_12px_3px_rgba(99,102,241,0.6)]"
             style={{ left: `${node.x}%`, top: `${node.y}%` }}
           />
         ))}
      </div>

      {/* 2. The Focus Bar */}
      <div className="z-10 w-full max-w-5xl flex justify-between items-center mb-16 border-b border-neutral-800/50 pb-4 mt-2">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Current Focus</span>
            <div className="flex items-center space-x-3 text-white">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-lg font-medium">{currentFocus.topic}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-neutral-800"></div>
          <div className="flex space-x-6 text-sm text-neutral-400">
            {currentFocus.stats.map(s => <span key={s}>{s}</span>)}
          </div>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center transition-colors">
          Continue <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* 3. The Command Center */}
      <div className="z-10 w-full max-w-3xl space-y-6 mt-8">
        
        {/* Title */}
        <h1 className="text-3xl font-light text-white tracking-wide text-center mb-10">
          Universal Capture
        </h1>

        {/* Input Area */}
        <div className="relative group transition-all duration-500">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${detection.status === 'detected' ? 'from-indigo-500/30 to-fuchsia-500/30' : 'from-neutral-800 to-neutral-700'} rounded-2xl blur opacity-70 group-focus-within:opacity-100 transition duration-700`}></div>
          <div className="relative bg-neutral-950/80 border border-neutral-800/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
            
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pipelineState !== "idle"}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCapture();
                }
              }}
              placeholder="Paste anything... (URLs, Compose Files, Strategies)"
              className="min-h-[160px] w-full resize-none border-0 bg-transparent text-xl placeholder:text-neutral-600 focus-visible:ring-0 p-6 leading-relaxed disabled:opacity-50"
            />

            {/* Toolbar */}
            <div className="flex items-center space-x-5 px-5 py-4 bg-neutral-900/50 border-t border-neutral-800/50 text-xs text-neutral-500 font-medium">
              
              {/* Project Selector */}
              <div className="relative">
                <button 
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="flex items-center px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-md hover:text-white transition-colors text-neutral-300"
                >
                  <Folder className="w-3.5 h-3.5 mr-2" />
                  <span className="truncate max-w-[100px]">
                    {selectedProjectId ? projects.find(p => p.id === selectedProjectId)?.name : "No Project"}
                  </span>
                  <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                </button>

                {isProjectDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1 z-50 overflow-hidden">
                    <button 
                        onClick={() => { setSelectedProjectId(null); setIsProjectDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors text-sm"
                      >
                        No Project
                    </button>
                    {projects.map(p => {
                      const Icon = (LucideIcons as any)[p.icon || "Folder"] || Folder;
                      return (
                        <button 
                          key={p.id}
                          onClick={() => { setSelectedProjectId(p.id); setIsProjectDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center text-sm"
                        >
                          <Icon className="w-3.5 h-3.5 mr-3 opacity-50" />
                          <span className="truncate">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-neutral-800"></div>

              <button className="flex items-center hover:text-white transition-colors"><Clipboard className="w-4 h-4 mr-2"/> Paste</button>
              <button className="flex items-center hover:text-white transition-colors"><Paperclip className="w-4 h-4 mr-2"/> Drop Files</button>
              
              <div className="flex-1"></div>
              {pipelineState === "idle" && <span className="text-neutral-600 tracking-wider">READY</span>}
            </div>
          </div>
        </div>

        {/* Detection Engine Result & Action Pipeline */}
        <AnimatePresence mode="wait">
          
          {pipelineState !== "idle" ? (
            // Action Pipeline
            <motion.div 
              key="pipeline"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8 bg-neutral-900/60 rounded-2xl border border-indigo-500/20 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col space-y-5">
                <PipelineStep active={pipelineState === "capturing" || pipelineState === "summarizing" || pipelineState === "relating" || pipelineState === "complete"} label="Captured ✓" />
                <PipelineStep active={pipelineState === "summarizing" || pipelineState === "relating" || pipelineState === "complete"} label="Creating Entity..." />
                <PipelineStep active={pipelineState === "relating" || pipelineState === "complete"} label="Generating Summary..." />
                <PipelineStep active={pipelineState === "complete"} label="Finding Relationships..." />
                
                {pipelineState === "complete" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-3 text-emerald-400 font-medium flex items-center text-lg">
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Complete
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : detection.status === "detected" && detection.confidence > 0.4 ? (
            // Detection Panel
            <motion.div 
              key="detection"
              initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              className="p-2 space-y-6"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-base tracking-wide">PKOS {detection.confidence < 0.9 ? 'thinks this is' : 'understands'}</span>
                  <strong className="text-white text-base ml-2">{detection.detectedType}</strong>
                </div>
                <div className="text-neutral-400 text-xs bg-neutral-900/80 px-3 py-1.5 rounded-md border border-neutral-800">
                  Confidence <span className="text-indigo-400 font-mono ml-2">{(detection.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Progressive Entities */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {detection.entities.map((ent, i) => (
                  <motion.div 
                    key={ent.type}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                    className="flex flex-col p-4 bg-neutral-900/60 border border-neutral-800/80 rounded-xl"
                  >
                    <span className="text-[10px] uppercase text-neutral-500 mb-2 font-medium tracking-wider">{ent.type}</span>
                    <span className="text-sm text-neutral-200 flex items-center font-medium">
                      <span className="mr-2 text-base">{ent.icon}</span> {ent.value}
                    </span>
                  </motion.div>
                ))}
              </div>
              
              {/* Contextual Quick Actions */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: detection.entities.length * 0.2 + 0.3 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {detection.capabilities.map((cap, i) => (
                  <button 
                    key={cap.label} 
                    onClick={() => {
                      if (cap.action === "save") {
                        handleCapture();
                      } else if (cap.action === "tag") {
                        setIsProjectDropdownOpen(true);
                      } else {
                        handleCapture();
                      }
                    }}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${i === 0 ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50'}`}
                  >
                    {cap.label}
                  </button>
                ))}
              </motion.div>

            </motion.div>
          ) : null}

        </AnimatePresence>
      </div>

    </div>
  );
}

function PipelineStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={`flex items-center space-x-4 transition-colors duration-500 ${active ? 'text-white' : 'text-neutral-600'}`}>
      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-indigo-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.5)]' : 'bg-neutral-700'}`} />
      <span className="text-lg tracking-wide font-light">{label}</span>
    </div>
  );
}
