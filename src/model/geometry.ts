import { Object2D } from "./types";

export type BoundingBoxMm = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
};

export const ALIGN_THRESHOLD_MM = 10;

const degToRad = (deg: number): number => (deg * Math.PI) / 180;

const rotatePoint = (x: number, y: number, rotationDeg: number): { x: number; y: number } => {
  if (rotationDeg === 0) {
    return { x, y };
  }
  const rad = degToRad(rotationDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
};

const getObjectDimensionsMm = (obj: Object2D): { widthMm: number; heightMm: number } => {
  if (obj.kind === "ramp") {
    return { widthMm: obj.runMm, heightMm: obj.widthMm };
  }
  return { widthMm: obj.lengthMm, heightMm: obj.widthMm };
};

export const computeBoundingBoxMm = (obj: Object2D, at?: { xMm: number; yMm: number }): BoundingBoxMm => {
  const { widthMm, heightMm } = getObjectDimensionsMm(obj);
  const halfW = widthMm / 2;
  const halfH = heightMm / 2;
  const centerX = at?.xMm ?? obj.xMm;
  const centerY = at?.yMm ?? obj.yMm;

  const corners = [
    rotatePoint(-halfW, -halfH, obj.rotationDeg),
    rotatePoint(halfW, -halfH, obj.rotationDeg),
    rotatePoint(halfW, halfH, obj.rotationDeg),
    rotatePoint(-halfW, halfH, obj.rotationDeg),
  ].map(({ x, y }) => ({ x: x + centerX, y: y + centerY }));

  const xs = corners.map((corner) => corner.x);
  const ys = corners.map((corner) => corner.y);

  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
    centerX,
    centerY,
  };
};

export const findAlignmentDeltasMm = (
  movingObj: Object2D,
  candidate: { xMm: number; yMm: number },
  others: Object2D[],
  thresholdMm = ALIGN_THRESHOLD_MM,
): { bestDx: number | null; bestDy: number | null } => {
  const movingBox = computeBoundingBoxMm(movingObj, candidate);
  const movingLinesX = [movingBox.left, movingBox.centerX, movingBox.right];
  const movingLinesY = [movingBox.top, movingBox.centerY, movingBox.bottom];

  let bestDx: number | null = null;
  let bestDy: number | null = null;

  const updateBest = (delta: number, current: number | null): number | null => {
    if (Math.abs(delta) > thresholdMm) return current;
    if (current === null || Math.abs(delta) < Math.abs(current)) return delta;
    return current;
  };

  others.forEach((other) => {
    if (other.id === movingObj.id) return;
    const otherBox = computeBoundingBoxMm(other);
    const otherLinesX = [otherBox.left, otherBox.centerX, otherBox.right];
    const otherLinesY = [otherBox.top, otherBox.centerY, otherBox.bottom];

    movingLinesX.forEach((line) => {
      otherLinesX.forEach((otherLine) => {
        bestDx = updateBest(otherLine - line, bestDx);
      });
    });

    movingLinesY.forEach((line) => {
      otherLinesY.forEach((otherLine) => {
        bestDy = updateBest(otherLine - line, bestDy);
      });
    });
  });

  return { bestDx, bestDy };
};
