import { CaptureParser, ParserResult } from "./CaptureParser.js";

export class GitHubParser implements CaptureParser {
  parse(content: string): ParserResult {
    const trimmed = content.trim();
    // Basic heuristic for github URLs
    if (trimmed.startsWith("https://github.com/") || trimmed.startsWith("git@github.com:")) {
      return {
        type: "GitHubRepository",
        confidence: 0.99,
        metadata: {
          url: trimmed
        }
      };
    }
    
    // Heuristic for github issue or PR mention, low confidence
    if (trimmed.includes("github.com")) {
      return {
        type: "GitHubRepository",
        confidence: 0.4,
      };
    }

    return { type: "GitHubRepository", confidence: 0 };
  }
}
