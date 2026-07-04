export interface DetectionResult {
  confidence: number;
  detectedType: string;
  title?: string;
  entities: Array<{ type: string; value: string; icon: string }>;
  suggestions: string[];
  capabilities: Array<{ label: string; action: string }>;
  status: "idle" | "detecting" | "detected";
}

export interface DetectionEngine {
  analyze(text: string, onProgress: (result: DetectionResult) => void): Promise<DetectionResult>;
}

export class LocalDetectionEngine implements DetectionEngine {
  private timeoutId?: NodeJS.Timeout;

  async analyze(text: string, onProgress: (result: DetectionResult) => void): Promise<DetectionResult> {
    if (!text.trim()) {
      return this.emptyResult();
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Simulate progressive understanding delay
    return new Promise((resolve) => {
      onProgress({ ...this.emptyResult(), status: "detecting" });

      this.timeoutId = setTimeout(() => {
        const result = this.runHeuristics(text);
        onProgress(result);
        resolve(result);
      }, 400); // 400ms typing debounce
    });
  }

  private emptyResult(): DetectionResult {
    return {
      confidence: 0,
      detectedType: "unknown",
      entities: [],
      suggestions: [],
      capabilities: [],
      status: "idle",
    };
  }

  private runHeuristics(text: string): DetectionResult {
    const lower = text.toLowerCase();

    // 1. YouTube Detection
    if (lower.includes("youtube.com/watch") || lower.includes("youtu.be/")) {
      return {
        confidence: 0.98,
        detectedType: "YouTube Video",
        title: "Understanding Next.js App Router",
        entities: [
          { type: "Creator", value: "Vercel", icon: "👤" },
          { type: "Duration", value: "14:22", icon: "⏱️" },
        ],
        suggestions: ["Extract Transcript", "Summarize Key Points"],
        capabilities: [
          { label: "Summarise", action: "summarize" },
          { label: "Import Transcript", action: "import_transcript" },
          { label: "Save Video", action: "save" },
          { label: "Watch Later", action: "watch_later" },
        ],
        status: "detected",
      };
    }

    // 2. Docker Compose Detection
    if (lower.includes("version:") && lower.includes("services:")) {
      return {
        confidence: 0.99,
        detectedType: "Docker Compose",
        entities: [
          { type: "Services", value: "4 Services", icon: "🐳" },
          { type: "Networks", value: "2 Networks", icon: "🌐" },
        ],
        suggestions: ["Check for port conflicts"],
        capabilities: [
          { label: "Open Compose Viewer", action: "view" },
          { label: "Deploy Later", action: "deploy" },
          { label: "Tag as Homelab", action: "tag_homelab" },
          { label: "Save", action: "save" },
        ],
        status: "detected",
      };
    }

    // 3. Black Ops 7 Zombies Strategy
    if (lower.includes("bo7") || lower.includes("liberty falls") || lower.includes("ray gun")) {
      return {
        confidence: 0.82,
        detectedType: "Black Ops 7 Strategy",
        entities: [
          { type: "Game", value: "Black Ops 7", icon: "🎮" },
          { type: "Mode", value: "Zombies", icon: "🧟" },
          { type: "Map", value: "Liberty Falls", icon: "🗺️" },
          { type: "Weapon", value: "Ray Gun", icon: "🔫" },
        ],
        suggestions: ["Found 4 related entities in your knowledge base"],
        capabilities: [
          { label: "Create Build", action: "create_build" },
          { label: "Compare Strategy", action: "compare" },
          { label: "Link to Game", action: "link" },
          { label: "Save", action: "save" },
        ],
        status: "detected",
      };
    }

    // 4. Fallback Generic Note
    return {
      confidence: 0.45,
      detectedType: "Text Note",
      entities: [
        { type: "Words", value: `${text.split(" ").length} words`, icon: "📝" },
      ],
      suggestions: ["Extract action items?"],
      capabilities: [
        { label: "Save", action: "save" },
        { label: "Tag", action: "tag" },
      ],
      status: "detected",
    };
  }
}
