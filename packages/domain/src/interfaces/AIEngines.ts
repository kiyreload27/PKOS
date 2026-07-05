export interface AIProvider {
  name: string;
}

export interface Summariser {
  summarize(content: string, type: "short" | "medium" | "technical"): Promise<string>;
}

export interface Classifier {
  classify(content: string): Promise<{ primaryType: string; confidence: number; traits: string[] }>;
}

export interface Embedder {
  embed(text: string): Promise<number[]>;
}

export interface Reasoner {
  evaluate(hypothesis: string, context: string): Promise<{ supported: boolean; confidence: number; evidenceExcerpt: string }>;
}
