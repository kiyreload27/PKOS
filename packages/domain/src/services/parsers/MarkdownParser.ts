import { CaptureParser, ParserResult } from "./CaptureParser.js";

export class MarkdownParser implements CaptureParser {
  parse(content: string): ParserResult {
    const trimmed = content.trim();
    if (trimmed.startsWith("# ") || trimmed.includes("\n## ") || trimmed.includes("\n- [ ]")) {
      return {
        type: "Markdown",
        confidence: 0.8,
      };
    }
    return { type: "Markdown", confidence: 0 };
  }
}
