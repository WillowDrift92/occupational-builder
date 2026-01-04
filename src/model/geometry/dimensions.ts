import { DEFAULT_DIMENSION_OFFSET_MM, DEFAULT_MEASUREMENT_OFFSET_MM } from "../defaults";
import { MeasurementAnchor, MeasurementKey, Object2D, RampObj } from "../types";
import { getObjectBoundingBoxMm, topLeftFromCenterMm, type PointMm } from "../geometry";

export type DimensionSegmentVariant = "length" | "width" | "wing" | "height" | "elevation";

export type PlanDimensionSegment = {
  kind: "plan";
  measurementKey: MeasurementKey;
  objectId: string;
  startMm: PointMm;
  endMm: PointMm;
  orientation: "horizontal" | "vertical";
  label: string;
  variant: DimensionSegmentVariant;
  tickLengthMm: number;
  outwardNormal: { xMm: number; yMm: number };
  offsetMm: number;
};

export type LeaderDimensionSegment = {
  kind: "leader";
  measurementKey: MeasurementKey;
  objectId: string;
  pointsMm: PointMm[];
  textAnchorMm: PointMm;
  label: string;
  variant: "height" | "elevation";
};

export type DimensionSegment = PlanDimensionSegment | LeaderDimensionSegment;

export const DIMENSION_STROKE_WIDTH_MM = 10;
export const DIMENSION_TICK_LENGTH_MM = 60;
export const DIMENSION_TEXT_SIZE_MM = 120;
export const DIMENSION_TEXT_GAP_MM = 60;
export const DIMENSION_HIT_STROKE_MM = 40;
export const DEFAULT_DIMENSION_OFFSET = DEFAULT_DIMENSION_OFFSET_MM;

const HEIGHT_LEADER_LENGTH_MM = 200;
const HEIGHT_TAIL_LENGTH_MM = 250;
const LEADER_STACK_GAP_MM = 120;

const defaultAnchor: MeasurementAnchor = { offsetMm: DEFAULT_MEASUREMENT_OFFSET_MM, orientation: "auto" };

const formatMm = (valueMm: number) => `${Math.round(valueMm)}mm`;

const normaliseRotationDeg = (rotationDeg: number) => {
  const wrapped = rotationDeg % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
};

const isLengthVertical = (rotationDeg: number) => {
  const normalised = normaliseRotationDeg(rotationDeg);
  return Math.abs(normalised % 180) === 90;
};

const getAnchor = (obj: Object2D, key: MeasurementKey): MeasurementAnchor => obj.measurementAnchors?.[key] ?? defaultAnchor;

const getOffsetMm = (obj: Object2D, key: MeasurementKey): number => {
  const dimensionOffset = obj.dimensionOffsetsMm?.[key];
  const anchorOffset = obj.measurementAnchors?.[key]?.offsetMm ?? DEFAULT_MEASUREMENT_OFFSET_MM;
  const chosen = typeof dimensionOffset === "number" ? dimensionOffset : anchorOffset;
  return Math.max(DEFAULT_DIMENSION_OFFSET_MM, chosen);
};

const rotatePointMm = (point: { xMm: number; yMm: number }, rotationDeg: number) => {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    xMm: point.xMm * cos - point.yMm * sin,
    yMm: point.xMm * sin + point.yMm * cos,
  };
};

const normaliseVector = (vec: { xMm: number; yMm: number }): { xMm: number; yMm: number } => {
  const mag = Math.hypot(vec.xMm, vec.yMm);
  if (mag === 0) return { xMm: 0, yMm: 0 };
  return { xMm: vec.xMm / mag, yMm: vec.yMm / mag };
};

const buildWingDimensionSegment = (obj: RampObj, side: "left" | "right"): PlanDimensionSegment | null => {
  const hasWing = side === "left" ? obj.hasLeftWing : obj.hasRightWing;
  const wingSize = side === "left" ? obj.leftWingSizeMm : obj.rightWingSizeMm;
  const measurementKey: MeasurementKey = side === "left" ? "WL" : "WR";

  if (!hasWing || wingSize <= 0 || !obj.measurements[measurementKey]) {
    return null;
  }

  const verticalLength = isLengthVertical(obj.rotationDeg);
  const orientation: "horizontal" | "vertical" = verticalLength ? "horizontal" : "vertical";
  const anchor = getAnchor(obj, measurementKey);
  const offsetMm = getOffsetMm(obj, measurementKey);

  const halfRun = obj.runMm / 2;
  const halfWidth = obj.widthMm / 2;
  const wingDirection = side === "right" ? 1 : -1;

  const localBase = { xMm: halfRun, yMm: wingDirection * halfWidth };
  const localTip = { xMm: halfRun, yMm: wingDirection * (halfWidth + wingSize) };

  const baseRotated = rotatePointMm(localBase, obj.rotationDeg);
  const tipRotated = rotatePointMm(localTip, obj.rotationDeg);

  const lengthDirection = rotatePointMm({ xMm: 1, yMm: 0 }, obj.rotationDeg);
  const offset = {
    xMm: lengthDirection.xMm * offsetMm,
    yMm: lengthDirection.yMm * offsetMm,
  };

  const baseWorld = { xMm: obj.xMm + baseRotated.xMm + offset.xMm, yMm: obj.yMm + baseRotated.yMm + offset.yMm };
  const tipWorld = { xMm: obj.xMm + tipRotated.xMm + offset.xMm, yMm: obj.yMm + tipRotated.yMm + offset.yMm };

  const startMm = { xMm: baseWorld.xMm, yMm: baseWorld.yMm };
  const endMm =
    orientation === "horizontal" ? { xMm: tipWorld.xMm, yMm: baseWorld.yMm } : { xMm: baseWorld.xMm, yMm: tipWorld.yMm };

  return {
    kind: "plan",
    measurementKey,
    objectId: obj.id,
    startMm,
    endMm,
    orientation,
    label: formatMm(wingSize),
    variant: "wing",
    tickLengthMm: DIMENSION_TICK_LENGTH_MM,
    outwardNormal: normaliseVector(lengthDirection),
    offsetMm,
  };
};

const buildEdgeDimensionSegments = (obj: Object2D): PlanDimensionSegment[] => {
  const bbox = getObjectBoundingBoxMm(obj);
  const topLeft = topLeftFromCenterMm({ xMm: obj.xMm, yMm: obj.yMm }, bbox);
  const left = topLeft.xMm;
  const right = left + bbox.widthMm;
  const top = topLeft.yMm;
  const bottom = top + bbox.heightMm;

  const verticalLength = isLengthVertical(obj.rotationDeg);
  const segments: PlanDimensionSegment[] = [];

  if (obj.measurements.L1) {
    const anchor = getAnchor(obj, "L1");
    const offset = getOffsetMm(obj, "L1");
    const orientation = anchor.orientation === "auto" ? (verticalLength ? "vertical" : "horizontal") : anchor.orientation;
    if (orientation === "vertical") {
      const baseStart = { xMm: left, yMm: top };
      const baseEnd = { xMm: left, yMm: bottom };
      const offsetVec = { xMm: -offset, yMm: 0 };
      segments.push({
        kind: "plan",
        measurementKey: "L1",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "vertical",
        label: formatMm(bottom - top),
        variant: "length",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    } else {
      const baseStart = { xMm: left, yMm: top };
      const baseEnd = { xMm: right, yMm: top };
      const offsetVec = { xMm: 0, yMm: -offset };
      segments.push({
        kind: "plan",
        measurementKey: "L1",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "horizontal",
        label: formatMm(right - left),
        variant: "length",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    }
  }

  if (obj.measurements.L2) {
    const anchor = getAnchor(obj, "L2");
    const offset = getOffsetMm(obj, "L2");
    const orientation = anchor.orientation === "auto" ? (verticalLength ? "vertical" : "horizontal") : anchor.orientation;
    if (orientation === "vertical") {
      const baseStart = { xMm: right, yMm: top };
      const baseEnd = { xMm: right, yMm: bottom };
      const offsetVec = { xMm: offset, yMm: 0 };
      segments.push({
        kind: "plan",
        measurementKey: "L2",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "vertical",
        label: formatMm(bottom - top),
        variant: "length",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    } else {
      const baseStart = { xMm: left, yMm: bottom };
      const baseEnd = { xMm: right, yMm: bottom };
      const offsetVec = { xMm: 0, yMm: offset };
      segments.push({
        kind: "plan",
        measurementKey: "L2",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "horizontal",
        label: formatMm(right - left),
        variant: "length",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    }
  }

  if (obj.measurements.W1) {
    const anchor = getAnchor(obj, "W1");
    const offset = getOffsetMm(obj, "W1");
    const orientation = anchor.orientation === "auto" ? (verticalLength ? "horizontal" : "vertical") : anchor.orientation;
    if (orientation === "horizontal") {
      const baseStart = { xMm: left, yMm: top };
      const baseEnd = { xMm: right, yMm: top };
      const offsetVec = { xMm: 0, yMm: -offset };
      segments.push({
        kind: "plan",
        measurementKey: "W1",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "horizontal",
        label: formatMm(right - left),
        variant: "width",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    } else {
      const baseStart = { xMm: left, yMm: top };
      const baseEnd = { xMm: left, yMm: bottom };
      const offsetVec = { xMm: -offset, yMm: 0 };
      segments.push({
        kind: "plan",
        measurementKey: "W1",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "vertical",
        label: formatMm(bottom - top),
        variant: "width",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    }
  }

  if (obj.measurements.W2) {
    const anchor = getAnchor(obj, "W2");
    const offset = getOffsetMm(obj, "W2");
    const orientation = anchor.orientation === "auto" ? (verticalLength ? "horizontal" : "vertical") : anchor.orientation;
    if (orientation === "horizontal") {
      const baseStart = { xMm: left, yMm: bottom };
      const baseEnd = { xMm: right, yMm: bottom };
      const offsetVec = { xMm: 0, yMm: offset };
      segments.push({
        kind: "plan",
        measurementKey: "W2",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "horizontal",
        label: formatMm(right - left),
        variant: "width",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    } else {
      const baseStart = { xMm: right, yMm: top };
      const baseEnd = { xMm: right, yMm: bottom };
      const offsetVec = { xMm: offset, yMm: 0 };
      segments.push({
        kind: "plan",
        measurementKey: "W2",
        objectId: obj.id,
        startMm: { xMm: baseStart.xMm + offsetVec.xMm, yMm: baseStart.yMm + offsetVec.yMm },
        endMm: { xMm: baseEnd.xMm + offsetVec.xMm, yMm: baseEnd.yMm + offsetVec.yMm },
        orientation: "vertical",
        label: formatMm(bottom - top),
        variant: "width",
        tickLengthMm: DIMENSION_TICK_LENGTH_MM,
        outwardNormal: normaliseVector(offsetVec),
        offsetMm: offset,
      });
    }
  }

  if (obj.kind === "ramp") {
    const leftWingSegment = buildWingDimensionSegment(obj, "left");
    const rightWingSegment = buildWingDimensionSegment(obj, "right");
    if (leftWingSegment) segments.push(leftWingSegment);
    if (rightWingSegment) segments.push(rightWingSegment);
  }

  return segments;
};

const buildHeightLeaderSegments = (obj: Object2D): LeaderDimensionSegment[] => {
  const shouldShowHeight = obj.measurements.H;
  const shouldShowElevation = obj.measurements.E && obj.elevationMm > 0;

  if (!shouldShowHeight && !shouldShowElevation) {
    return [];
  }

  const length = obj.kind === "ramp" ? obj.runMm : obj.lengthMm;
  const width = obj.widthMm;

  const localAnchor = { xMm: length / 2, yMm: -width / 2 };
  const leaderDirLocal = normaliseVector({ xMm: 1, yMm: -1 });

  const leaderEndLocal = {
    xMm: localAnchor.xMm + leaderDirLocal.xMm * HEIGHT_LEADER_LENGTH_MM,
    yMm: localAnchor.yMm + leaderDirLocal.yMm * HEIGHT_LEADER_LENGTH_MM,
  };
  const tailEndLocal = { xMm: leaderEndLocal.xMm + HEIGHT_TAIL_LENGTH_MM, yMm: leaderEndLocal.yMm };

  const toWorld = (pt: PointMm): PointMm => {
    const rotated = rotatePointMm(pt, obj.rotationDeg);
    return { xMm: obj.xMm + rotated.xMm, yMm: obj.yMm + rotated.yMm };
  };

  const anchorWorld = toWorld(localAnchor);
  const leaderEndWorld = toWorld(leaderEndLocal);
  const tailEndWorld = toWorld(tailEndLocal);

  const segments: LeaderDimensionSegment[] = [];

  const basePoints = [anchorWorld, leaderEndWorld, tailEndWorld];

  if (shouldShowHeight) {
    segments.push({
      kind: "leader",
      measurementKey: "H",
      objectId: obj.id,
      pointsMm: basePoints,
      textAnchorMm: tailEndWorld,
      label: formatMm(obj.heightMm),
      variant: "height",
    });
  }

  if (shouldShowElevation) {
    const stackedTextAnchor = toWorld({ xMm: tailEndLocal.xMm, yMm: tailEndLocal.yMm - LEADER_STACK_GAP_MM });
    segments.push({
      kind: "leader",
      measurementKey: "E",
      objectId: obj.id,
      pointsMm: basePoints,
      textAnchorMm: stackedTextAnchor,
      label: formatMm(obj.elevationMm),
      variant: "elevation",
    });
  }

  return segments;
};

export const generateDimensionsForObject = (obj: Object2D): DimensionSegment[] => [
  ...buildEdgeDimensionSegments(obj),
  ...buildHeightLeaderSegments(obj),
];

export const generateDimensions = (objects: Object2D[]): DimensionSegment[] => objects.flatMap(generateDimensionsForObject);
