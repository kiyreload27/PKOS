import { prisma } from "@pkos/database";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Use Context instead of Space
  const space = await prisma.context.findUnique({
    where: { id },
  });

  if (!space) {
    notFound();
  }

  // Use Entity instead of EntityState
  const entities = await prisma.entity.findMany({
    where: { spaceId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{space.name}</h1>
      <p className="text-gray-500 mb-8">{space.type}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <div key={entity.id} className="p-4 border rounded-xl shadow-sm bg-white">
            <h3 className="font-semibold">{entity.aliases[0] || "Untitled"}</h3>
            <p className="text-sm text-gray-500 mt-2">
              Type: {entity.typeId}
            </p>
          </div>
        ))}
        {entities.length === 0 && (
          <p className="text-gray-500 col-span-3">No entities found in this context.</p>
        )}
      </div>
    </div>
  );
}
