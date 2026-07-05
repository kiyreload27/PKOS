"use client";

import { useState, useEffect } from "react";
import { Home, PlusSquare, Search, Folder, Network, Settings, Plus, Trash2, BrainCircuit, Check, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlusSquare, label: "Capture", href: "/capture" },
  { icon: BrainCircuit, label: "AI Inbox", href: "/inbox" },
  { icon: Search, label: "Search", href: "#", shortcut: "⌘K" },
];

const collections = [
  { icon: Folder, label: "Timeline", href: "/timeline" },
  { icon: Network, label: "Graph", href: "/graph" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newProjectName.trim()) {
      try {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newProjectName, icon: "Folder" })
        });
        if (res.ok) {
          setNewProjectName("");
          setIsCreating(false);
          fetchProjects();
        }
      } catch (e) {
        console.error(e);
      }
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewProjectName("");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDeleteId(null);
        fetchProjects();
        if (pathname === `/projects/${id}`) {
          router.push("/");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className="w-64 bg-neutral-950/80 backdrop-blur-xl border-r border-neutral-800/50 flex flex-col h-full text-sm text-neutral-400 font-medium z-40 relative shrink-0">
      <div className="p-4 flex items-center space-x-3 text-white mb-4 mt-2">
        <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white text-[10px] font-bold">OS</span>
        </div>
        <span className="font-semibold tracking-tight text-lg">PKOS</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-8 pb-4">
        
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isSearch = item.label === "Search";
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                onClick={(e) => {
                  if (isSearch) {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                  pathname === item.href ? "bg-neutral-800/50 text-white" : "hover:bg-neutral-900 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  <span>{item.label}</span>
                </div>
                {item.shortcut && <kbd className="font-sans text-[10px] uppercase bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500 border border-neutral-700/50">{item.shortcut}</kbd>}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600">Projects</h4>
            <button onClick={() => setIsCreating(true)} className="text-neutral-500 hover:text-white transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-0.5">
            {isCreating && (
              <div className="px-3 py-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Project name..."
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  onKeyDown={handleCreateProject}
                  onBlur={() => setIsCreating(false)}
                  className="w-full bg-neutral-900 border border-indigo-500/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none"
                />
              </div>
            )}
            {projects.map((project) => {
              const Icon = (LucideIcons as any)[project.icon || "Folder"] || Folder;
              const href = `/projects/${project.id}`;
              const isActive = pathname === href;
              const isConfirming = confirmDeleteId === project.id;
              
              return (
                <Link key={project.id} href={href} className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                  isActive ? "bg-neutral-800/50 text-white" : "hover:bg-neutral-900 hover:text-white",
                  isConfirming && "bg-red-950/30 border border-red-900/50"
                )}>
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={cn("w-4 h-4 opacity-70 group-hover:opacity-100 flex-shrink-0", isConfirming && "text-red-400 opacity-100")} />
                    <span className="truncate max-w-[110px]">{isConfirming ? "Confirm Delete?" : project.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    {isConfirming ? (
                      <>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteProject(project.id); }} className="text-red-400 hover:text-red-300 px-1 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteId(null); }} className="text-neutral-500 hover:text-neutral-300 px-1 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteId(project.id); }} className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all px-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 mb-2">Collections</h4>
          <div className="space-y-0.5">
            {collections.map((item) => (
              <Link key={item.label} href={item.href} className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                pathname === item.href ? "bg-neutral-800/50 text-white" : "hover:bg-neutral-900 hover:text-white"
              )}>
                <item.icon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <div className="p-3 border-t border-neutral-800/50">
        <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors hover:bg-neutral-900 hover:text-white group">
          <Settings className="w-4 h-4 opacity-70 group-hover:opacity-100" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
