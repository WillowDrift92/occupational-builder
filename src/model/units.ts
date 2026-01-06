import { SnapIncrementMm } from "./types";

export const DEFAULT_SNAP_INCREMENT_MM: SnapIncrementMm = 100;
export const GRID_STEP_MM = DEFAULT_SNAP_INCREMENT_MM;
export const SNAP_INCREMENT_OPTIONS: SnapIncrementMm[] = [1, 10, 100, 1000];

const MM_PER_PX = 10;

export const mmToPx = (mm: number): number => mm / MM_PER_PX;

export const pxToMm = (px: number): number => px * MM_PER_PX;

export const snapMm = (mm: number, stepMm: number = GRID_STEP_MM): number => Math.round(mm / stepMm) * stepMm;
