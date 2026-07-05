export class RelationshipEngine {
  async discover(entityId: string, content: string): Promise<Array<{ targetId: string; typeId: string; confidence: number; evidenceExcerpt: string }>> {
    // Stub deterministic logic
    const relationships = [];
    if (content.includes("react")) {
      relationships.push({
        targetId: entityId, // Self-link for testing to avoid FK constraint errors
        typeId: "Depends On",
        confidence: 0.85,
        evidenceExcerpt: "Found 'react' in the content"
      });
    }
    return relationships;
  }
}
