import { useMemo } from "react";
import { Group, Line, Text } from "react-konva";
import type { DimensionSegment, LeaderDimensionSegment, PlanDimensionSegment } from "../../model/geometry/dimensions";
import { DIMENSION_HIT_STROKE_MM, DIMENSION_STROKE_WIDTH_MM, DIMENSION_TEXT_GAP_MM, DIMENSION_TEXT_SIZE_MM, DIMENSION_TICK_LENGTH_MM } from "../../model/geometry/dimensions";
import { MeasurementKey, Object2D } from "../../model/types";
import { mmToPx } from "../../model/units";

type Dimensions2DProps = {
  objects: Object2D[];
  dimensions: DimensionSegment[];
  cameraScale: number;
  selectedId: string | null;
  selectedMeasurementKey: MeasurementKey | null;
  onSelect: (id: string) => void;
  onSelectMeasurement: (id: string, key: MeasurementKey) => void;
  onBeginDrag: (segment: PlanDimensionSegment) => void;
  onHoverCursor: (cursor: string | null) => void;
};

const measureTextWidth = (text: string, fontSize: number) => text.length * fontSize * 0.6;

type PlanDimensionLineProps = PlanDimensionSegment & {
  color: string;
  textColor: string;
  isSelected: boolean;
  onPointerDown: () => void;
  onHoverCursor: (cursor: string | null) => void;
};

const PlanDimensionLine = ({
  startMm,
  endMm,
  orientation,
  label,
  tickLengthMm,
  outwardNormal,
  offsetMm,
  color,
  textColor,
  isSelected,
  onPointerDown,
  onHoverCursor,
}: PlanDimensionLineProps) => {
  void isSelected;
  const strokeWidth = mmToPx(DIMENSION_STROKE_WIDTH_MM);
  const hitStrokeWidth = mmToPx(DIMENSION_HIT_STROKE_MM);
  const fontSize = mmToPx(DIMENSION_TEXT_SIZE_MM);
  const gapPx = mmToPx(DIMENSION_TEXT_GAP_MM);
  const startPx = { x: mmToPx(startMm.xMm), y: mmToPx(startMm.yMm) };
  const endPx = { x: mmToPx(endMm.xMm), y: mmToPx(endMm.yMm) };
  const tickHalf = mmToPx(tickLengthMm) / 2;
  const centerPx = { x: (startPx.x + endPx.x) / 2, y: (startPx.y + endPx.y) / 2 };
  const labelPx = { x: centerPx.x + outwardNormal.xMm * gapPx, y: centerPx.y + outwardNormal.yMm * gapPx };
  const labelWidth = measureTextWidth(label, fontSize);
  const labelHeight = fontSize;

  const cursor = orientation === "horizontal" ? "ns-resize" : "ew-resize";

  const handlePointerDown = (evt: any) => {
    evt.cancelBubble = true;
    onPointerDown();
  };

  const handlePointerEnter = () => onHoverCursor(cursor);
  const handlePointerLeave = () => onHoverCursor(null);

  const strokeColor = isSelected ? color : color;

  return (
    <Group onPointerDown={handlePointerDown} listening onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <Line
        points={[startPx.x, startPx.y, endPx.x, endPx.y]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        hitStrokeWidth={hitStrokeWidth}
        lineCap="butt"
      />
      {orientation === "horizontal" ? (
        <>
          <Line
            points={[startPx.x, startPx.y - tickHalf, startPx.x, startPx.y + tickHalf]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            hitStrokeWidth={hitStrokeWidth}
          />
          <Line
            points={[endPx.x, endPx.y - tickHalf, endPx.x, endPx.y + tickHalf]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            hitStrokeWidth={hitStrokeWidth}
          />
        </>
      ) : (
        <>
          <Line
            points={[startPx.x - tickHalf, startPx.y, startPx.x + tickHalf, startPx.y]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            hitStrokeWidth={hitStrokeWidth}
          />
          <Line
            points={[endPx.x - tickHalf, endPx.y, endPx.x + tickHalf, endPx.y]}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            hitStrokeWidth={hitStrokeWidth}
          />
        </>
      )}
      <Text
        x={labelPx.x - labelWidth / 2}
        y={labelPx.y - labelHeight / 2}
        text={label}
        fontSize={fontSize}
        fill={textColor}
        align="center"
        width={labelWidth}
      />
    </Group>
  );
};

type LeaderDimensionProps = LeaderDimensionSegment & {
  color: string;
  textColor: string;
};

const LeaderDimension = ({ pointsMm, textAnchorMm, label, color, textColor }: LeaderDimensionProps) => {
  const strokeWidth = mmToPx(DIMENSION_STROKE_WIDTH_MM);
  const fontSize = mmToPx(DIMENSION_TEXT_SIZE_MM);
  const pointsPx = pointsMm.flatMap((pt) => [mmToPx(pt.xMm), mmToPx(pt.yMm)]);
  const textX = mmToPx(textAnchorMm.xMm + 10);
  const textY = mmToPx(textAnchorMm.yMm);
  const labelWidth = measureTextWidth(label, fontSize);
  const labelHeight = fontSize;

  return (
    <Group listening={false}>
      <Line points={pointsPx} stroke={color} strokeWidth={strokeWidth} lineCap="round" lineJoin="round" />
      <Text x={textX} y={textY - labelHeight / 2} text={label} fontSize={fontSize} fill={textColor} offsetX={0} />
    </Group>
  );
};

export default function Dimensions2D({
  objects,
  dimensions,
  cameraScale,
  selectedId,
  selectedMeasurementKey,
  onSelect,
  onSelectMeasurement,
  onBeginDrag,
  onHoverCursor,
}: Dimensions2DProps) {
  void cameraScale;
  const dimensionsByObject = useMemo(() => {
    return dimensions.reduce<Record<string, DimensionSegment[]>>((acc, segment) => {
      acc[segment.objectId] = acc[segment.objectId] ? [...acc[segment.objectId], segment] : [segment];
      return acc;
    }, {});
  }, [dimensions]);

  return (
    <Group>
      {objects.map((obj) => {
        const lines = dimensionsByObject[obj.id] ?? [];
        if (lines.length === 0) return null;
        const color = "#2563eb";
        const textColor = "#0f172a";
        return (
          <Group key={`dim-${obj.id}`}>
            {lines.map((line, idx) => {
              if (line.kind === "leader") {
                return (
                  <LeaderDimension
                    key={`${obj.id}-${line.measurementKey}-${idx}`}
                    {...(line as LeaderDimensionSegment)}
                    color={color}
                    textColor={textColor}
                  />
                );
              }

              const planLine = line as PlanDimensionSegment;
              return (
                <PlanDimensionLine
                  key={`${obj.id}-${planLine.measurementKey}-${idx}`}
                  {...planLine}
                  tickLengthMm={planLine.tickLengthMm || DIMENSION_TICK_LENGTH_MM}
                  color={color}
                  textColor={textColor}
                  isSelected={selectedMeasurementKey === planLine.measurementKey && selectedId === obj.id}
                  onPointerDown={() => {
                    onSelect(obj.id);
                    onSelectMeasurement(obj.id, planLine.measurementKey);
                    onBeginDrag(planLine);
                  }}
                  onHoverCursor={onHoverCursor}
                />
              );
            })}
          </Group>
        );
      })}
    </Group>
  );
}
