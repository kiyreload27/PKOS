import { CaptureParser, ParserResult } from "./parsers/CaptureParser.js";
import { GitHubParser } from "./parsers/GitHubParser.js";
import { DockerParser } from "./parsers/DockerParser.js";
import { URLParser } from "./parsers/URLParser.js";
import { MarkdownParser } from "./parsers/MarkdownParser.js";
import { PlainTextParser } from "./parsers/PlainTextParser.js";

export interface AnalysisOutput {
  primaryType: string;
  confidence: number;
  possibleTypes: ParserResult[];
  detectedResources?: string[];
  detectedEntities?: string[];
  detectedLanguages?: string[];
  detectedTechnologies?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
}

export class CaptureAnalysisService {
  private parsers: CaptureParser[] = [];

  constructor() {
    // Dynamic Registration Architecture
    // Plugins and Core must explicitly call registerParser()
  }

  public registerParser(parser: CaptureParser) {
    this.parsers.push(parser);
  }

  public analyze(content: string): AnalysisOutput {
    const results = this.parsers
      .map(p => p.parse(content))
      .filter(r => r.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence);

    const primary = results[0] || { type: "Unknown", confidence: 0 };

    return {
      primaryType: primary.type,
      confidence: primary.confidence,
      possibleTypes: results,
      detectedResources: primary.detectedResources,
      detectedEntities: primary.detectedEntities,
      detectedLanguages: primary.detectedLanguages,
      detectedTechnologies: primary.detectedTechnologies,
      warnings: primary.warnings,
      metadata: primary.metadata,
    };
  }
}
