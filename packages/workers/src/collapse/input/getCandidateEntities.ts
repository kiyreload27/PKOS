import { PrismaClient, Entity } from "@prisma/client";

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function getCandidateEntities({
  windowDays,
  limit,
}: {
  windowDays: number;
  limit: number;
}) {
  return prisma.entity.findMany({
    where: {
      updatedAt: { // Swapped lastSeenAt for updatedAt
        gte: daysAgo(windowDays),
      },
    },
    include: {
      observations: true,
      // aliases: true, // Alias not mapped explicitly on Entity schema yet, we use externalIds for now
      // memoryCard: true, // Assuming memory card relation exists or is external
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });
}
