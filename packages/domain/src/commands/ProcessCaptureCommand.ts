import { Command } from "./Command.js";
import { AnalysisOutput } from "../services/CaptureAnalysisService.js";

export interface ProcessCapturePayload {
  captureId: string;
  content: string;
  analysis: AnalysisOutput;
}

export interface ProcessCaptureCommand extends Command<ProcessCapturePayload> {
  readonly type: "PROCESS_CAPTURE";
}
