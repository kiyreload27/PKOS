export type EntityId = string;

export interface Entity {
  id: EntityId;
  name: string;
  type: string;
}

export interface Relationship {
  from: EntityId;
  to: EntityId;
  type: string;
  timestamp: number;
  confidence: number;
  changeCount: number;
}

export interface Observation {
  id: string;
  entityId: EntityId;
  text: string;
  timestamp: number;
}

export interface Event {
  type: string;
  timestamp: number;
  payload: any;
}

export interface GraphSnapshot {
  entities: Entity[];
  relationships: Relationship[];
  observations: Observation[];
  events: Event[];
}
