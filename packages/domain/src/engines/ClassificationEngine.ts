export class ClassificationEngine {
  async classify(content: string): Promise<{ primaryType: string; confidence: number; traits: string[] }> {
    // Stub deterministic logic
    if (content.includes("docker")) {
      return { primaryType: "DockerConfig", confidence: 0.9, traits: ["Infrastructure", "Configuration"] };
    }
    return { primaryType: "PlainText", confidence: 0.5, traits: ["Unstructured"] };
  }
}
