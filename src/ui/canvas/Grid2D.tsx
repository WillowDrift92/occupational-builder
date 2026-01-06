import { useMemo } from "react";
import { Group, Line, Rect } from "react-konva";
import { mmToPx } from "../../model/units";

type Grid2DProps = {
  cameraScale: number;
  workspaceSizeMm: number;
  gridStepMm: number;
};

const toScreenSpacing = (stepMm: number, cameraScale: number) => mmToPx(stepMm) * cameraScale;

export default function Grid2D({ cameraScale, workspaceSizeMm, gridStepMm }: Grid2DProps) {
  const halfWorkspacePx = mmToPx(workspaceSizeMm / 2);

  const { background, lines } = useMemo(() => {
    const nodes: JSX.Element[] = [];
    const minorSpacingMm = gridStepMm;
    const majorSpacingMm = gridStepMm * 10;
    const baseSuperMajorSpacingMm = gridStepMm * 50;
    const baseSuperMajorAltSpacingMm = gridStepMm * 100;
    const drawMinor = toScreenSpacing(minorSpacingMm, cameraScale) >= 6;
    const drawMajor = toScreenSpacing(majorSpacingMm, cameraScale) >= 10;

    const superMajorSpacingMm =
      !drawMajor && toScreenSpacing(baseSuperMajorSpacingMm, cameraScale) >= 10
        ? baseSuperMajorSpacingMm
        : !drawMajor && toScreenSpacing(baseSuperMajorAltSpacingMm, cameraScale) >= 10
          ? baseSuperMajorAltSpacingMm
          : null;

    const strokeWidth = 1 / cameraScale;

    const addLines = (stepMm: number, keyPrefix: string, stroke: string) => {
      const stepPx = mmToPx(stepMm);
      const first = Math.ceil(-halfWorkspacePx / stepPx) * stepPx;
      for (let x = first; x <= halfWorkspacePx; x += stepPx) {
        const alignedX = Math.round(x * cameraScale) / cameraScale;
        nodes.push(
          <Line
            key={`${keyPrefix}-v-${x}`}
            points={[alignedX, -halfWorkspacePx, alignedX, halfWorkspacePx]}
            stroke={stroke}
            strokeWidth={strokeWidth}
            listening={false}
          />,
        );
      }
      for (let y = first; y <= halfWorkspacePx; y += stepPx) {
        const alignedY = Math.round(y * cameraScale) / cameraScale;
        nodes.push(
          <Line
            key={`${keyPrefix}-h-${y}`}
            points={[-halfWorkspacePx, alignedY, halfWorkspacePx, alignedY]}
            stroke={stroke}
            strokeWidth={strokeWidth}
            listening={false}
          />,
        );
      }
    };

    if (drawMinor) {
      addLines(minorSpacingMm, "minor", "rgba(148, 163, 184, 0.16)");
    }
    if (drawMajor) {
      addLines(majorSpacingMm, "major", "rgba(148, 163, 184, 0.32)");
    } else if (superMajorSpacingMm) {
      addLines(superMajorSpacingMm, "super", "rgba(148, 163, 184, 0.38)");
    }

    return {
      background: (
        <Rect
          x={-halfWorkspacePx}
          y={-halfWorkspacePx}
          width={halfWorkspacePx * 2}
          height={halfWorkspacePx * 2}
          fill="#f8fbff"
          stroke="rgba(15, 23, 42, 0.08)"
          strokeWidth={strokeWidth}
          cornerRadius={4}
          listening={false}
        />
      ),
      lines: nodes,
    };
  }, [cameraScale, gridStepMm, halfWorkspacePx]);

  return (
    <Group listening={false} clipX={-halfWorkspacePx} clipY={-halfWorkspacePx} clipWidth={halfWorkspacePx * 2} clipHeight={halfWorkspacePx * 2}>
      {background}
      {lines}
    </Group>
  );
}
