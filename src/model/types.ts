export type Tool = "none" | "ramp" | "landing" | "delete";

export type ObjectKind = "ramp" | "landing" | "stairs";

export type MeasurementState = {
  enabled: { L: boolean; W: boolean; H: boolean; E: boolean };
  sides?: { L?: "one" | "both"; W?: "one" | "both" };
};

export type BaseObj = {
  id: string;
  kind: ObjectKind;
  xMm: number;
  yMm: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  elevationMm: number;
  rotationDeg: number;
  locked: boolean;
  measurements: MeasurementState;
};

export type RampObj = BaseObj & {
  kind: "ramp";
  showArrow: boolean;
  hasLeftWing?: boolean;
  leftWingSizeMm?: number;
  hasRightWing?: boolean;
  rightWingSizeMm?: number;
  runMm: number;
};

export type LandingObj = BaseObj & {
  kind: "landing";
};

export type Object2D = RampObj | LandingObj;

export type Snapshot = {
  snapOn: boolean;
  objects: Object2D[];
  selectedId: string | null;
};
