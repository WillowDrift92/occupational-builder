export type ToolId = "select" | "ramp" | "platform" | "delete";

export interface BuilderElementBase {
  id: string;
  label: string;
  positionMm: { x: number; y: number; z?: number };
}

export interface RampElement extends BuilderElementBase {
  kind: "ramp";
  slopeRatio: number;
}

export interface PlatformElement extends BuilderElementBase {
  kind: "platform";
  heightMm: number;
}

export type BuilderElement = RampElement | PlatformElement;

export interface BuilderState {
  units: "mm";
  elements: BuilderElement[];
  selectedElementId?: string;
  snapToGrid: boolean;
}
