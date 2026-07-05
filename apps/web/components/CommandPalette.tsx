"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, Sparkles, FolderPlus, Compass, Terminal, FileText, ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    
    // Also listen for custom event to trigger from sidebar
    const handleOpenCommandPalette = () => setOpen(true);
    window.addEventListener("open-command-palette", handleOpenCommandPalette);
    
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", handleOpenCommandPalette);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-[#0A0A0A] border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <Command className="flex flex-col w-full text-slate-200">
          <div className="flex items-center px-4 py-4 border-b border-slate-800/80">
            <Search className="w-5 h-5 text-slate-500 mr-3" />
            <Command.Input 
              autoFocus 
              placeholder="Capture, search, ask PKOS, or run a command..." 
              className="flex-1 bg-transparent border-0 outline-none placeholder:text-slate-500 text-lg"
            />
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
            <Command.Empty className="py-6 text-center text-slate-500">No results found.</Command.Empty>

            <Command.Group heading="Global Actions" className="text-xs font-semibold text-slate-500 px-2 py-2 uppercase tracking-wider">
              <Command.Item 
                onSelect={() => runCommand(() => {})}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-indigo-500/20 data-[selected=true]:text-white group"
              >
                <Sparkles className="w-4 h-4 mr-3 text-indigo-400 group-data-[selected=true]:text-indigo-300" />
                Ask PKOS
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/capture'))}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-slate-800/80 data-[selected=true]:text-white group"
              >
                <FileText className="w-4 h-4 mr-3 text-slate-400" />
                Capture Knowledge
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Context Sessions" className="text-xs font-semibold text-slate-500 px-2 py-2 uppercase tracking-wider mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => {})}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-slate-800/80 data-[selected=true]:text-white group"
              >
                <Compass className="w-4 h-4 mr-3 text-slate-400" />
                Switch Context
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => {})}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-slate-800/80 data-[selected=true]:text-white group"
              >
                <FolderPlus className="w-4 h-4 mr-3 text-slate-400" />
                Create Context
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Maintenance" className="text-xs font-semibold text-slate-500 px-2 py-2 uppercase tracking-wider mt-2">
              <Command.Item 
                onSelect={() => runCommand(() => router.push('/inbox'))}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-slate-800/80 data-[selected=true]:text-white group"
              >
                <ArrowRightCircle className="w-4 h-4 mr-3 text-amber-500" />
                Review AI Inbox
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => {})}
                className="flex items-center px-3 py-3 mt-1 rounded-lg cursor-pointer text-sm font-medium text-slate-300 data-[selected=true]:bg-slate-800/80 data-[selected=true]:text-white group"
              >
                <Terminal className="w-4 h-4 mr-3 text-slate-400" />
                Restart Resource Sync
              </Command.Item>
            </Command.Group>
          </Command.List>
          
          <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-800/80 text-xs text-slate-500 flex justify-between">
            <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-sans mr-1">↑</kbd><kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-sans">↓</kbd> to navigate</span>
            <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-sans mr-1">Enter</kbd> to select</span>
            <span><kbd className="bg-slate-800 border border-slate-700 rounded px-1 py-0.5 font-sans mr-1">Esc</kbd> to close</span>
          </div>
        </Command>
      </div>
    </Command.Dialog>
  );
}
