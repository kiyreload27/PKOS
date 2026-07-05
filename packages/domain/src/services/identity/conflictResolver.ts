export async function emitEvent(event: any) {
  // Mock event emitter
  console.log("EMIT EVENT", event.type);
}

export function resolveConflictDecision(
  decision: "MERGE" | "SPLIT" | "IGNORE",
  clusterId: string,
  selectedPrimaryId?: string
) {
  switch (decision) {
    case "MERGE":
      return emitEvent({
        type: "ENTITY_MERGE_APPROVED",
        payload: {
          clusterId,
          primary: selectedPrimaryId
        }
      });

    case "SPLIT":
      return emitEvent({
        type: "ENTITY_SPLIT_CONFIRMED",
        payload: { clusterId }
      });

    case "IGNORE":
      return emitEvent({
        type: "CONFLICT_DISMISSED",
        payload: { clusterId }
      });
  }
}
