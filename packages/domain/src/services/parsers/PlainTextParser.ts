import { CaptureParser, ParserResult } from "./CaptureParser.js";

export class PlainTextParser implements CaptureParser {
  parse(content: string): ParserResult {
    // Plaintext is the ultimate fallback
    return {
      type: "Note",
      confidence: 0.1,
    };
  }
}
