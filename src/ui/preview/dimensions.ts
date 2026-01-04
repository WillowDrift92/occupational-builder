import { DIMENSION_TICK_LENGTH_MM, type DimensionSegment } from "../../model/geometry/dimensions";

export type PreviewDimensionOverlay = {
  segments: DimensionSegment[];
  tickLengthMm: number;
};

export const createPreviewDimensionOverlay = (
  segments: DimensionSegment[],
  tickLengthMm: number = DIMENSION_TICK_LENGTH_MM,
): PreviewDimensionOverlay => ({
  segments,
  tickLengthMm,
});
