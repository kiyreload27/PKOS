import { prisma } from "@pkos/database";
import { formatDistanceToNow } from "date-fns";

export default async function TimelinePage() {
  const events = await prisma.pKOSEvent.findMany({
    take: 50,
    orderBy: { timestamp: "desc" },
    include: {
      entity: true,
    },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Timeline</h1>

      <div className="space-y-8">
        {events.map((evt) => (
          <div key={evt.id} className="flex gap-4 relative">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0 z-10">
              <span className="text-blue-600 font-bold">⚡</span>
            </div>
            
            {/* Timeline connector line */}
            <div className="absolute top-12 left-6 bottom-[-32px] w-[2px] bg-gray-200 -z-0"></div>

            <div className="pt-2">
              <p className="text-sm text-gray-500 mb-1">
                {formatDistanceToNow(new Date(evt.timestamp), { addSuffix: true })}
              </p>
              <div className="bg-white border rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold">{evt.type}</h4>
                <p className="text-gray-600 mt-1">
                  Entity: {evt.entity.aliases[0] || evt.entity.id}
                </p>
                <pre className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(evt.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-gray-500 text-center py-12">No events recorded yet.</p>
        )}
      </div>
    </div>
  );
}
