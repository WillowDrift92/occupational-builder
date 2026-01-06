import { useEffect, useRef } from "react";
import { Group, Line, Arrow } from "react-konva";
import { getRampOutlinePointsMm, getRampSeamLinesMm } from "../../model/geometry";
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
  onTransformStart?: () => void;
  onTransform?: (evt: any) => void;
  onTransformEnd?: (evt: any) => void;
  nodeRef?: (node: any) => void;
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
  onTransformStart,
  onTransform,
  onTransformEnd,
  nodeRef,
}: Props) {
  const groupRef = useRef<any>(null);

  useEffect(() => {
    const node = groupRef.current as any;
    if (!node) return;
    const halfLengthPx = mmToPx(obj.runMm) / 2;
    const halfWidthPx = mmToPx(obj.widthMm) / 2;
    node.getSelfRect = () => ({
      x: -halfLengthPx,
      y: -halfWidthPx,
      width: halfLengthPx * 2,
      height: halfWidthPx * 2,
    });
  }, [obj.runMm, obj.widthMm]);

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

  const outlinePointsMm = getRampOutlinePointsMm(obj);
  const outlinePointsPx = outlinePointsMm.flatMap((point) => [mmToPx(point.xMm), mmToPx(point.yMm)]);

  const seamLinesPx = getRampSeamLinesMm(obj).map((line) => [
    mmToPx(line.start.xMm),
    mmToPx(line.start.yMm),
    mmToPx(line.end.xMm),
    mmToPx(line.end.yMm),
  ]);

  const lengthPx = mmToPx(obj.runMm);
  const arrowStartX = -lengthPx / 2 + lengthPx * 0.1;
  const arrowEndX = lengthPx / 2 - lengthPx * 0.1;

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
      onTransformStart={onTransformStart}
      onTransform={onTransform}
      onTransformEnd={onTransformEnd}
      ref={(node) => {
        groupRef.current = node;
        nodeRef?.(node);
      }}
      listening={!ghost}
    >
      <Line
        points={outlinePointsPx}
        closed
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
        lineJoin="miter"
      />
      {seamLinesPx.map((points, idx) => (
        <Line key={`seam-${idx}`} points={points} stroke={stroke} strokeWidth={strokeWidth} opacity={opacity} lineCap="butt" />
      ))}
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
