// Mocks for emitting events and updating DB
async function emitEvent(event: any) {
  console.log("EMIT EVENT", event.type);
}

async function updateAliasTable(payload: any) {
  console.log("UPDATE ALIAS", payload);
}

function pickCanonical(a: any, b: any) {
  return (a.memoryCardScore ?? 0) > (b.memoryCardScore ?? 0) ? a.id : b.id;
}

function createClusterId(a: any, b: any) {
  return `cluster-${a.id}-${b.id}`;
}

export async function processCollapseResult(result: any) {
  const [a, b] = result.entities;

  switch (result.type) {
    case "PROPOSE_MERGE":
      await emitEvent({
        type: "ENTITY_MERGE_PROPOSED",
        aggregateId: a.id,
        payload: {
          targetEntityId: b.id,
          score: result.score,
        },
      });
      break;

    case "SOFT_COLLAPSE":
      await emitEvent({
        type: "MEMORY_CLUSTER_FORMED",
        aggregateId: createClusterId(a, b),
        payload: {
          entityIds: [a.id, b.id],
          score: result.score,
        },
      });
      break;

    case "HARD_COLLAPSE":
      const canonicalId = pickCanonical(a, b);

      await updateAliasTable({
        aliases: [a.id, b.id],
        canonicalId,
        confidence: result.score,
      });

      await emitEvent({
        type: "ENTITY_COLLAPSED",
        aggregateId: canonicalId,
        payload: {
          mergedEntityIds: [a.id, b.id],
          score: result.score,
          method: "HARD",
        },
      });

      break;
  }
}
