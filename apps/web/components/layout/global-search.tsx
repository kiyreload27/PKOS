"use client";

import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Search, Settings, User, Database, Gamepad2, FileText, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search anything... (Entities, Projects, Prompts)" 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>{loading ? "Searching..." : "No results found."}</CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup heading="Knowledge Graph">
            {results.map((res: any) => (
              <CommandItem key={res.id} onSelect={() => runCommand(() => router.push(`/entity/${res.id}`))}>
                <FileText className="mr-2 h-4 w-4 text-indigo-400" />
                <div className="flex flex-col">
                  <span className="font-medium">{res.title}</span>
                  {res.snippet && <span className="text-xs text-neutral-500 truncate">{res.snippet}</span>}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="System">
          <CommandItem onSelect={() => runCommand(() => router.push("/capture"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search web</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/timeline"))}>
            <Zap className="mr-2 h-4 w-4 text-amber-400" />
            <span>Universal Timeline</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/projects/gaming"))}>
            <Gamepad2 className="mr-2 h-4 w-4" />
            <span>Black Ops 7 Strategies</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Preferences</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
