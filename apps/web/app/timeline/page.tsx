import { prisma } from "@pkos/database";
import { Zap, Brain, FileText, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

export default async function TimelinePage() {
  const entities = await prisma.entityState.findMany({
    include: {
      entity: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <div className="relative h-full flex flex-col items-center justify-start p-8 overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30">
      
      <div className="z-10 w-full max-w-4xl space-y-6 mt-8 pb-32">
        <div className="flex items-center space-x-4 mb-16 border-b border-neutral-800/50 pb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-white tracking-wide">
              Universal Timeline
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Your expanding knowledge graph, chronologically ordered.</p>
          </div>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-neutral-800 before:via-neutral-800 before:to-transparent">
          {entities.map((state) => {
            const isProcessing = state.status === "Captured";
            return (
              <div key={state.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Center Node on Timeline */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-4 border-neutral-950 bg-neutral-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-shadow ${isProcessing ? 'shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 'group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'}`}>
                  {state.entity.kind === "UNKNOWN" ? <FileText className="w-3 h-3 text-neutral-400" /> : <Brain className="w-3 h-3 text-indigo-400" />}
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 backdrop-blur-xl hover:bg-neutral-900/80 transition-all cursor-pointer group-hover:border-indigo-500/30 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 bg-neutral-950 px-2 py-1 rounded-md border border-neutral-800">{state.entity.kind}</span>
                    <time className="text-xs text-neutral-500 font-mono">{timeAgo(state.createdAt)}</time>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">{state.title || "Untitled Capture"}</h3>
                  <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                    {/* @ts-ignore - rawCapture exists in our Prisma model but might not be typed depending on generation */}
                    {state.rawCapture}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/50">
                    <div className="flex items-center space-x-2 text-xs font-medium">
                      {isProcessing ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span className="text-amber-400">Processing in background</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{state.status || "Enriched"}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {entities.length === 0 && (
            <div className="text-center text-neutral-500 pt-12 font-light text-lg">
              No captures found. Try adding something to the Universal Inbox!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
