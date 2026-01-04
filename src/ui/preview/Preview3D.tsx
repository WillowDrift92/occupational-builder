import type { PreviewDimensionOverlay } from "./dimensions";

type Preview3DProps = {
  dimensions: PreviewDimensionOverlay;
};

export default function Preview3D({ dimensions }: Preview3DProps) {
  return (
    <div className="ob-canvasHost">
      <div className="canvas-placeholder">
        3D Preview (placeholder)
        <div className="canvas-placeholder__hint">{dimensions.segments.length} dimensions available</div>
      </div>
    </div>
  );
}
