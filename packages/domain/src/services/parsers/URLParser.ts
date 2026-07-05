import { CaptureParser, ParserResult } from "./CaptureParser.js";

export class URLParser implements CaptureParser {
  parse(content: string): ParserResult {
    const trimmed = content.trim();
    try {
      const url = new URL(trimmed);
      return {
        type: "Website",
        confidence: 0.9,
        metadata: {
          hostname: url.hostname
        }
      };
    } catch {
      return { type: "Website", confidence: 0 };
    }
  }
}
