export class IdentityEngine {
  async resolveIdentity(captureId: string, content: string, uri: string): Promise<{ action: "NEW" | "MERGE_CANDIDATE"; targetEntityId?: string }> {
    // Stub deterministic logic
    if (uri.includes("duplicate") || content.includes("duplicate")) {
      return { action: "MERGE_CANDIDATE", targetEntityId: "existing-entity-id-stub" };
    }
    return { action: "NEW" };
  }
}
