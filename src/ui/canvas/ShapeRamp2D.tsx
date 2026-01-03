import { Group, Line, Arrow } from "react-konva";
import { RampObj, Tool } from "../../model/types";
import { mmToPx } from "../../model/units";

type Props = {
  obj: RampObj;
  selected: boolean;
  hover: boolean;
  activeTool: Tool;
  draggable: boolean;
  dragBoundFunc?: (pos: any) => any;
  ghost?: boolean;
  onPointerDown?: (evt: any) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onDragStart?: () => void;
  onDragEnd?: (evt: any) => void;
};

export default function ShapeRamp2D({
  obj,
  selected,
  hover,
  activeTool,
  draggable,
  dragBoundFunc,
  ghost = false,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDragEnd,
}: Props) {
  const leftWingMm = obj.hasLeftWing ? obj.leftWingSizeMm : 0;
  const rightWingMm = obj.hasRightWing ? obj.rightWingSizeMm : 0;

  const widthPx = mmToPx(obj.runMm);
  const bodyHeightPx = mmToPx(obj.widthMm);
  const fill = ghost ? "rgba(59,130,246,0.25)" : "#e5e7eb";
  const stroke =
    activeTool === "delete" && hover
      ? "#ef4444"
      : selected
        ? "#2563eb"
        : hover
          ? "#64748b"
          : "#0f172a";
  const opacity = ghost ? 0.35 : 1;
  const strokeWidth = selected ? 3 : 2;
  const rectX = -widthPx / 2;
  const halfBodyHeightPx = bodyHeightPx / 2;
  const topY = -halfBodyHeightPx;
  const bottomY = halfBodyHeightPx;
  const lowLeftCorner = { x: rectX, y: topY };
  const highLeftCorner = { x: widthPx / 2, y: topY };
  const highRightCorner = { x: widthPx / 2, y: bottomY };
  const lowRightCorner = { x: rectX, y: bottomY };
  const lowLeftOuter = { x: rectX, y: topY - mmToPx(leftWingMm) };
  const lowRightOuter = { x: rectX, y: bottomY + mmToPx(rightWingMm) };

  const outlinePoints = [
    obj.hasLeftWing ? lowLeftOuter : lowLeftCorner,
    highLeftCorner,
    highRightCorner,
    obj.hasRightWing ? lowRightOuter : lowRightCorner,
    ...(obj.hasLeftWing || obj.hasRightWing ? [lowLeftCorner] : []),
  ];

  const outlinePointArray = outlinePoints.flatMap((point) => [point.x, point.y]);
  const arrowStartX = -widthPx / 2 + widthPx * 0.1;
  const arrowEndX = widthPx / 2 - widthPx * 0.1;

  return (
    <Group
      x={mmToPx(obj.xMm)}
      y={mmToPx(obj.yMm)}
      draggable={draggable && !ghost}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      dragBoundFunc={dragBoundFunc}
      rotation={obj.rotationDeg}
      listening={!ghost}
    >
      <Line
        points={outlinePointArray}
        closed
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {obj.showArrow && (
        <Arrow
          points={[arrowStartX, 0, arrowEndX, 0]}
          pointerLength={14}
          pointerWidth={14}
          stroke={stroke}
          fill={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      )}
    </Group>
  );
}
