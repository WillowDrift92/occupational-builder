import { useMemo } from "react";
import { Group, Line, Rect } from "react-konva";
import { GRID_STEP_MM, mmToPx, pxToMm } from "../../model/units";

type Grid2DProps = {
  width: number;
  height: number;
  view: { scale: number; offset: { x: number; y: number } };
  worldBounds: { minX: number; maxX: number; minY: number; maxY: number };
};

const MINOR_SPACING_MM = GRID_STEP_MM;
const MAJOR_SPACING_MM = GRID_STEP_MM * 10;
const SUPER_SPACING_CANDIDATES_MM = [5000, 10000];

const worldMmToScreenPx = (view: Grid2DProps["view"], point: { xMm: number; yMm: number }): { x: number; y: number } => ({
  x: view.offset.x + mmToPx(point.xMm) * view.scale,
  y: view.offset.y + mmToPx(point.yMm) * view.scale,
});

const screenPxToWorldMm = (view: Grid2DProps["view"], point: { xPx: number; yPx: number }): { xMm: number; yMm: number } => ({
  xMm: pxToMm((point.xPx - view.offset.x) / view.scale),
  yMm: pxToMm((point.yPx - view.offset.y) / view.scale),
});

const getVisibleWorldBoundsMm = (view: Grid2DProps["view"], viewport: { width: number; height: number }) => {
  const topLeft = screenPxToWorldMm(view, { xPx: 0, yPx: 0 });
  const bottomRight = screenPxToWorldMm(view, { xPx: viewport.width, yPx: viewport.height });
  return {
    minX: Math.min(topLeft.xMm, bottomRight.xMm),
    maxX: Math.max(topLeft.xMm, bottomRight.xMm),
    minY: Math.min(topLeft.yMm, bottomRight.yMm),
    maxY: Math.max(topLeft.yMm, bottomRight.yMm),
  };
};

export default function Grid2D({ width, height, view, worldBounds }: Grid2DProps) {
  const { background, lines, workspaceOutline } = useMemo(() => {
    const visible = getVisibleWorldBoundsMm(view, { width, height });
    const clamped = {
      minX: Math.max(worldBounds.minX, visible.minX),
      maxX: Math.min(worldBounds.maxX, visible.maxX),
      minY: Math.max(worldBounds.minY, visible.minY),
      maxY: Math.min(worldBounds.maxY, visible.maxY),
    };

    const minorSpacingPx = mmToPx(MINOR_SPACING_MM) * view.scale;
    const majorSpacingPx = mmToPx(MAJOR_SPACING_MM) * view.scale;

    const drawMinor = minorSpacingPx >= 4;
    const drawMajor = majorSpacingPx >= 8;
    const drawSuper = !drawMajor;

    const superSpacingMm =
      SUPER_SPACING_CANDIDATES_MM.find((candidate) => mmToPx(candidate) * view.scale >= 8) ?? SUPER_SPACING_CANDIDATES_MM[SUPER_SPACING_CANDIDATES_MM.length - 1];

    const nodes: JSX.Element[] = [];

    const addLines = (spacingMm: number, color: string, skipPredicate?: (value: number) => boolean) => {
      const startX = Math.ceil(clamped.minX / spacingMm) * spacingMm;
      const endX = Math.floor(clamped.maxX / spacingMm) * spacingMm;
      for (let xMm = startX; xMm <= endX; xMm += spacingMm) {
        if (skipPredicate?.(xMm)) continue;
        const screenX = worldMmToScreenPx(view, { xMm, yMm: 0 }).x;
        if (screenX < -1 || screenX > width + 1) continue;
        const alignedX = Math.round(screenX) + 0.5;
        nodes.push(
          <Line
            key={`gx-${xMm}`}
            points={[alignedX, 0, alignedX, height]}
            stroke={color}
            strokeWidth={1}
            strokeScaleEnabled={false}
            listening={false}
          />,
        );
      }

      const startY = Math.ceil(clamped.minY / spacingMm) * spacingMm;
      const endY = Math.floor(clamped.maxY / spacingMm) * spacingMm;
      for (let yMm = startY; yMm <= endY; yMm += spacingMm) {
        if (skipPredicate?.(yMm)) continue;
        const screenY = worldMmToScreenPx(view, { xMm: 0, yMm }).y;
        if (screenY < -1 || screenY > height + 1) continue;
        const alignedY = Math.round(screenY) + 0.5;
        nodes.push(
          <Line
            key={`gy-${yMm}`}
            points={[0, alignedY, width, alignedY]}
            stroke={color}
            strokeWidth={1}
            strokeScaleEnabled={false}
            listening={false}
          />,
        );
      }
    };

    if (drawMinor) {
      addLines(MINOR_SPACING_MM, "rgba(148, 163, 184, 0.18)", (value) => value % MAJOR_SPACING_MM === 0);
    }
    if (drawMajor) {
      addLines(MAJOR_SPACING_MM, "rgba(148, 163, 184, 0.28)");
    } else if (drawSuper) {
      addLines(superSpacingMm, "rgba(148, 163, 184, 0.35)");
    }

    const worldTopLeft = worldMmToScreenPx(view, { xMm: worldBounds.minX, yMm: worldBounds.minY });
    const worldBottomRight = worldMmToScreenPx(view, { xMm: worldBounds.maxX, yMm: worldBounds.maxY });
    const outline = (
      <Rect
        x={Math.round(worldTopLeft.x) + 0.5}
        y={Math.round(worldTopLeft.y) + 0.5}
        width={Math.round(worldBottomRight.x - worldTopLeft.x)}
        height={Math.round(worldBottomRight.y - worldTopLeft.y)}
        stroke="rgba(15, 23, 42, 0.15)"
        strokeWidth={1}
        strokeScaleEnabled={false}
        listening={false}
      />
    );

    const bg = <Rect width={width} height={height} fill="#f8fbff" listening={false} />;

    return { background: bg, lines: nodes, workspaceOutline: outline };
  }, [height, view, width, worldBounds]);

  return (
    <Group listening={false}>
      {background}
      {lines}
      {workspaceOutline}
    </Group>
  );
}
