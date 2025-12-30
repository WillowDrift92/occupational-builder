import { useMemo } from "react";
import { Group, Line } from "react-konva";

type Grid2DProps = {
  width: number;
  height: number;
};

const MILLIMETRES_PER_PIXEL = 10;
const MINOR_GRID_SPACING_MM = 100;
const MAJOR_GRID_SPACING_MM = 500;

const MINOR_SPACING_PX = MINOR_GRID_SPACING_MM / MILLIMETRES_PER_PIXEL;
const MAJOR_SPACING_PX = MAJOR_GRID_SPACING_MM / MILLIMETRES_PER_PIXEL;
const MAJOR_INTERVAL = MAJOR_SPACING_PX / MINOR_SPACING_PX;

export default function Grid2D({ width, height }: Grid2DProps) {
  const lines = useMemo(() => {
    const nodes: JSX.Element[] = [];

    let columnIndex = 0;
    for (let x = 0; x <= width; x += MINOR_SPACING_PX) {
      const isMajor = columnIndex % MAJOR_INTERVAL === 0;
      nodes.push(
        <Line
          key={`v-${columnIndex}`}
          points={[x, 0, x, height]}
          stroke={isMajor ? "rgba(148, 163, 184, 0.75)" : "rgba(203, 213, 225, 0.55)"}
          strokeWidth={isMajor ? 1.25 : 1}
          listening={false}
        />,
      );
      columnIndex += 1;
    }

    let rowIndex = 0;
    for (let y = 0; y <= height; y += MINOR_SPACING_PX) {
      const isMajor = rowIndex % MAJOR_INTERVAL === 0;
      nodes.push(
        <Line
          key={`h-${rowIndex}`}
          points={[0, y, width, y]}
          stroke={isMajor ? "rgba(148, 163, 184, 0.75)" : "rgba(203, 213, 225, 0.55)"}
          strokeWidth={isMajor ? 1.25 : 1}
          listening={false}
        />,
      );
      rowIndex += 1;
    }

    return nodes;
  }, [height, width]);

  return <Group listening={false}>{lines}</Group>;
}
