import { prisma } from "@pkos/database";
import { formatDistanceToNow } from "date-fns";
import { Sparkles, Network, BookOpen, Clock, Activity, FileText } from "lucide-react";

function renderStoryForEvent(event: any) {
  const payload = event.payload as any;
  switch (event.type) {
    case "RELATIONSHIP_DISCOVERED":
      return {
        icon: <Network className="w-5 h-5 text-fuchsia-400" />,
        color: "bg-fuchsia-500/10 border-fuchsia-500/20",
        title: "Connected Knowledge",
        story: `You connected ${payload.sourceId?.substring(0,6) || "an entity"} to ${payload.targetId?.substring(0,6) || "another entity"}.`
      };
    case "OBSERVATION_GENERATED":
      return {
        icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
        color: "bg-indigo-500/10 border-indigo-500/20",
        title: "New Discovery",
        story: `PKOS deduced: "${payload.statement}"`
      };
    case "MEMORY_CARD_CREATED":
      return {
        icon: <BookOpen className="w-5 h-5 text-yellow-400" />,
        color: "bg-yellow-500/10 border-yellow-500/20",
        title: "Memory Preserved",
        story: `Saved a reusable memory: "${payload.title}"`
      };
    case "SUMMARY_GENERATED":
      return {
        icon: <FileText className="w-5 h-5 text-emerald-400" />,
        color: "bg-emerald-500/10 border-emerald-500/20",
        title: "Knowledge Summarized",
        story: `A new summary was generated for your recent capture.`
      };
    default:
      return {
        icon: <Activity className="w-5 h-5 text-slate-400" />,
        color: "bg-slate-500/10 border-slate-500/20",
        title: "System Activity",
        story: `Event recorded: ${event.type.replace(/_/g, " ").toLowerCase()}`
      };
  }
}

export default async function TimelinePage() {
  const events = await prisma.pKOSEvent.findMany({
    where: {
      type: {
        in: ["RELATIONSHIP_DISCOVERED", "OBSERVATION_GENERATED", "MEMORY_CARD_CREATED", "SUMMARY_GENERATED", "CAPTURE_RECEIVED"]
      }
    },
    take: 50,
    orderBy: { timestamp: "desc" }
  });

  return (
    <div className="p-8 pt-24 max-w-3xl mx-auto min-h-screen bg-[#0A0A0A] text-slate-200">
      <div className="flex items-center gap-4 mb-12">
        <Clock className="w-8 h-8 text-indigo-400" />
        <h1 className="text-3xl font-light text-white tracking-tight">Personal Timeline</h1>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {events.map((evt) => {
          const { icon, color, title, story } = renderStoryForEvent(evt);
          
          return (
            <div key={evt.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0A0A0A] ${color} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10`}>
                {icon}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{title}</h4>
                  <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(evt.timestamp), { addSuffix: true })}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{story}</p>
              </div>
              
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-20 text-slate-500 border border-slate-800/50 rounded-2xl bg-slate-900/20">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Your timeline is empty. Start capturing knowledge.</p>
          </div>
        )}
      </div>
    </div>
  );
}
