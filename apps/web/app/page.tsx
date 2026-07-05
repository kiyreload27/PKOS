import { prisma } from "@pkos/database";
import { formatDistanceToNow, subDays } from "date-fns";
import { Coffee, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, Activity, GitMerge } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DailyBriefingPage() {
  const yesterday = subDays(new Date(), 1);

  // 1. Yesterday's Activity
  const capturesCount = await prisma.capture.count({ where: { receivedAt: { gte: yesterday } } });
  const relationshipsCount = await prisma.relationship.count({ where: { createdAt: { gte: yesterday } } });
  const newEntities = await prisma.entity.count({ where: { createdAt: { gte: yesterday } } });

  // 2. Needs Attention
  const inboxItems = await prisma.inboxProjection.count();
  const unreviewedObservations = await prisma.observation.count({ where: { state: "HYPOTHESIS" } });
  const brokenResources = await prisma.resource.count({ where: { status: "ERROR" } });

  // 3. Proactive Surfacing (Memory)
  // Find an older capture or observation (simulating memory surfacing)
  const oldCapture = await prisma.capture.findFirst({
    where: { receivedAt: { lte: subDays(new Date(), 2) } },
    orderBy: { receivedAt: "desc" }
  });

  const staleObservations = await prisma.observation.findMany({
    where: { state: "SUPPORTED", updatedAt: { lte: subDays(new Date(), 7) } },
    take: 2
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans p-8 pt-24 max-w-4xl mx-auto selection:bg-indigo-500/30">
      
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-4">
          <Coffee className="w-8 h-8 text-emerald-400" />
          Good morning, Ben.
        </h1>
        <p className="text-slate-400 mt-3 text-lg">Here is your personal knowledge briefing for today.</p>
      </div>

      <div className="space-y-12">
        
        {/* Yesterday's Activity */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Yesterday you:
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4 text-lg text-slate-300">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Captured <strong>{capturesCount}</strong> new items
            </li>
            <li className="flex items-center gap-4 text-lg text-slate-300">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
              Created <strong>{relationshipsCount}</strong> relationships
            </li>
            <li className="flex items-center gap-4 text-lg text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Discovered <strong>{newEntities}</strong> new entities
            </li>
          </ul>
        </section>

        <div className="h-px bg-slate-800/50 w-full" />

        {/* Needs Attention */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Things that need attention:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/inbox" className="group p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/50 hover:border-slate-700 transition-all flex items-start gap-4">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <GitMerge className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">AI Inbox</h3>
                <p className="text-sm text-slate-400 mt-1">{inboxItems} items waiting for your review</p>
              </div>
            </Link>

            <div className="group p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/50 hover:border-slate-700 transition-all flex items-start gap-4 cursor-pointer">
              <div className="bg-rose-500/10 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-rose-400 transition-colors">Broken Syncs</h3>
                <p className="text-sm text-slate-400 mt-1">{brokenResources} resources failed to synchronize</p>
              </div>
            </div>

            <div className="group p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/50 hover:border-slate-700 transition-all flex items-start gap-4 cursor-pointer">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">Pending Observations</h3>
                <p className="text-sm text-slate-400 mt-1">{unreviewedObservations} hypotheses need verification</p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-800/50 w-full" />

        {/* You may have forgotten */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            You may have forgotten:
          </h2>
          <div className="space-y-4">
            {oldCapture && (
              <div className="p-4 pl-6 border-l-2 border-slate-700 hover:border-yellow-500/50 transition-colors cursor-pointer">
                <h4 className="text-slate-300 font-medium mb-1">A Capture from {formatDistanceToNow(new Date(oldCapture.receivedAt))} ago</h4>
                <p className="text-sm text-slate-500 line-clamp-1">{oldCapture.content}</p>
              </div>
            )}
            
            {staleObservations.map(obs => (
              <div key={obs.id} className="p-4 pl-6 border-l-2 border-slate-700 hover:border-yellow-500/50 transition-colors cursor-pointer">
                <h4 className="text-slate-300 font-medium mb-1">Observation: {obs.statement}</h4>
                <p className="text-sm text-slate-500">Last updated {formatDistanceToNow(new Date(obs.updatedAt))} ago</p>
              </div>
            ))}

            {!oldCapture && staleObservations.length === 0 && (
              <p className="text-slate-500 italic">No forgotten memories to surface right now.</p>
            )}
          </div>
        </section>

        {/* Suggested Next Action */}
        <section className="pt-8">
          <button className="w-full sm:w-auto flex items-center justify-between gap-6 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 group">
            <span className="text-lg">Review AI Inbox</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

      </div>
    </div>
  );
}
