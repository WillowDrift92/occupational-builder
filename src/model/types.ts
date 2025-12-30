export type Tool = "select" | "ramp" | "platform" | "delete";

export interface BaseObj {
  id: string;
  type: "ramp" | "platform";
  xMm: number;
  yMm: number;
  rotationDeg: number;
  elevationMm: number;
  locked: boolean;
}

export interface RampObj extends BaseObj {
  runMm: number;
  widthMm: number;
  heightMm: number;
  showArrow: boolean;
}

export interface PlatformObj extends BaseObj {
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
}

export type Object2D = RampObj | PlatformObj;
