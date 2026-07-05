import { Timestamp } from "../value-objects/Timestamp.js";
import { AnalysisOutput } from "../services/CaptureAnalysisService.js";

export enum CaptureStatus {
  RECEIVING = "Receiving",
  QUEUED = "Queued",
  ANALYSING = "Analysing",
  EXTRACTING = "Extracting",
  CREATING_RESOURCES = "CreatingResources",
  CREATING_ENTITIES = "CreatingEntities",
  DISCOVERING_RELATIONSHIPS = "DiscoveringRelationships",
  GENERATING_OBSERVATIONS = "GeneratingObservations",
  PROJECTING = "Projecting",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled"
}

export interface Capture {
  readonly id: string;
  readonly content: string;
  readonly source: string;
  readonly status: CaptureStatus;
  readonly analysis?: AnalysisOutput;
  readonly receivedAt: Timestamp;
}
