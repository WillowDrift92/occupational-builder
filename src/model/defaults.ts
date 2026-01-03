import { LandingObj, MeasurementState, RampObj } from "./types";

export const makeId = (): string => `obj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const defaultMeasurements = (): MeasurementState => ({
  enabled: { L: true, W: true, H: true, E: true },
});

export const DEFAULT_RAMP_RUN_MM = 1800;
export const DEFAULT_RAMP_WIDTH_MM = 1000;
export const DEFAULT_RAMP_HEIGHT_MM = 300;

export const newRampAt = (xMm: number, yMm: number): RampObj => ({
  id: makeId(),
  kind: "ramp",
  xMm,
  yMm,
  lengthMm: DEFAULT_RAMP_RUN_MM,
  widthMm: DEFAULT_RAMP_WIDTH_MM,
  heightMm: DEFAULT_RAMP_HEIGHT_MM,
  elevationMm: 0,
  rotationDeg: 0,
  locked: false,
  measurements: defaultMeasurements(),
  runMm: DEFAULT_RAMP_RUN_MM,
  showArrow: true,
});

export const DEFAULT_LANDING_LENGTH_MM = 1200;
export const DEFAULT_LANDING_WIDTH_MM = 1200;
export const DEFAULT_LANDING_HEIGHT_MM = 50;

export const newLandingAt = (xMm: number, yMm: number): LandingObj => ({
  id: makeId(),
  kind: "landing",
  xMm,
  yMm,
  lengthMm: DEFAULT_LANDING_LENGTH_MM,
  widthMm: DEFAULT_LANDING_WIDTH_MM,
  heightMm: DEFAULT_LANDING_HEIGHT_MM,
  elevationMm: 0,
  rotationDeg: 0,
  locked: false,
  measurements: defaultMeasurements(),
});
