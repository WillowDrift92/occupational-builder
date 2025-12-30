import { Group, Rect } from "react-konva";
import { ActiveTool, PlatformObj } from "../../model/types";

type Props = {
  obj: PlatformObj;
  selected: boolean;
  hover: boolean;
  activeTool: ActiveTool;
  draggable: boolean;
  ghost?: boolean;
  mmToPx: (mm: number) => number;
  onPointerDown?: (evt: any) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onDragEnd?: (evt: any) => void;
};

export default function ShapePlatform2D({
  obj,
  selected,
  hover,
  activeTool,
  draggable,
  ghost = false,
  mmToPx,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
  onDragEnd,
}: Props) {
  const widthPx = mmToPx(obj.lengthMm);
  const heightPx = mmToPx(obj.widthMm);
  const fill = ghost ? "rgba(16,185,129,0.25)" : "#e8f5e9";
  const stroke =
    activeTool === "delete" && hover
      ? "#ef4444"
      : selected
        ? "#10b981"
        : hover
          ? "#059669"
          : "#065f46";
  const opacity = ghost ? 0.35 : 1;

  return (
    <Group
      x={mmToPx(obj.xMm)}
      y={mmToPx(obj.yMm)}
      draggable={draggable && !ghost}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragEnd={onDragEnd}
      offsetX={widthPx / 2}
      offsetY={heightPx / 2}
      rotation={obj.rotationDeg}
      listening={!ghost}
    >
      <Rect
        width={widthPx}
        height={heightPx}
        fill={fill}
        stroke={stroke}
        strokeWidth={selected ? 3 : 2}
        cornerRadius={8}
        opacity={opacity}
      />
    </Group>
  );
}
