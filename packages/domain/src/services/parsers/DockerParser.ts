import { CaptureParser, ParserResult } from "./CaptureParser.js";

export class DockerParser implements CaptureParser {
  parse(content: string): ParserResult {
    const trimmed = content.trim();
    
    // Simple heuristic for docker-compose.yml
    if (trimmed.includes("services:") && (trimmed.includes("version:") || trimmed.includes("image:"))) {
      return {
        type: "DockerCompose",
        confidence: 0.95,
        detectedTechnologies: ["Docker"],
        metadata: {
          containsServices: true
        }
      };
    }

    if (trimmed.startsWith("FROM ") && trimmed.includes("RUN ")) {
      return {
        type: "Dockerfile",
        confidence: 0.90,
        detectedTechnologies: ["Docker"]
      };
    }

    return { type: "Docker", confidence: 0 };
  }
}
