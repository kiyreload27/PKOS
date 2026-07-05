import { prisma } from "@pkos/database";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, BrainCircuit, GitMerge, FileText, Activity } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InboxPage() {
  const items = await prisma.inboxProjection.findMany({
    orderBy: { generatedAt: "desc" },
    take: 50
  });

  function getIconForType(type: string) {
    if (type.includes("MERGE")) return <GitMerge className="h-5 w-5 text-purple-400" />;
    if (type.includes("OBSERVATION")) return <BrainCircuit className="h-5 w-5 text-blue-400" />;
    if (type.includes("RELATIONSHIP")) return <Activity className="h-5 w-5 text-green-400" />;
    if (type.includes("SUMMARY")) return <FileText className="h-5 w-5 text-orange-400" />;
    return <AlertCircle className="h-5 w-5 text-slate-400" />;
  }

  function formatPayload(payload: any) {
    if (!payload) return "";
    if (payload.statement) return payload.statement;
    if (payload.short) return payload.short;
    if (payload.reason) return payload.reason;
    if (payload.targetEntityId) return `Suggested merge with Entity ${payload.targetEntityId.substring(0,8)}...`;
    return JSON.stringify(payload).substring(0, 100);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-200 font-sans p-8 pt-24 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <BrainCircuit className="h-8 w-8 text-indigo-400" />
        <h1 className="text-3xl font-light text-white tracking-tight">AI Inbox</h1>
        <span className="ml-auto bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium border border-indigo-500/20">
          {items.length} items needing review
        </span>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-slate-800/50 rounded-2xl bg-slate-900/20">
            <BrainCircuit className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Your AI Inbox is clear. All knowledge is processed.</p>
          </div>
        ) : (
          items.map((item: any) => {
            const data = item.data as any;
            return (
              <div 
                key={item.id} 
                className="group p-5 border border-slate-800/60 rounded-xl bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-700/60 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getIconForType(data.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-200">
                        {data.type.replace(/_/g, " ")}
                      </h3>
                      <time className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(new Date(data.timestamp), { addSuffix: true })}
                      </time>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed truncate">
                      {formatPayload(data.payload)}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium rounded-md transition-colors">
                      Review
                    </button>
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-md transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
