export class SummaryEngine {
  async generateSummaries(entityId: string, content: string): Promise<{ short: string; medium: string; technical: string }> {
    // Stub deterministic logic
    return {
      short: "A captured document.",
      medium: "A captured document containing unstructured text.",
      technical: `Length: ${content.length} chars. Stubbed technical summary.`
    };
  }
}
