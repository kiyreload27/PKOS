export interface ParserResult {
  type: string;
  confidence: number;
  detectedResources?: string[];
  detectedEntities?: string[];
  detectedLanguages?: string[];
  detectedTechnologies?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
}

export interface CaptureParser {
  /**
   * Evaluates the raw input content and returns a score and analysis.
   */
  parse(content: string): ParserResult;
}
