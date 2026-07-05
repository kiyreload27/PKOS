export class EmbeddingEngine {
  async embed(content: string): Promise<number[]> {
    // Stub deterministic logic - return a fake embedding vector
    return [0.1, 0.2, 0.3, 0.4, 0.5];
  }
}
