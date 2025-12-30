import Grid2D from "./Grid2D";
import ShapePlatform2D from "./ShapePlatform2D";
import ShapeRamp2D from "./ShapeRamp2D";

function Canvas2D() {
  return (
    <section className="card" aria-labelledby="canvas-2d-title">
      <h2 id="canvas-2d-title">Edit in 2D</h2>
      <p>Drop ramps and platforms on the grid. All measurements are in millimeters.</p>
      <Grid2D />
      <div className="button-row">
        <ShapeRamp2D />
        <ShapePlatform2D />
      </div>
    </section>
  );
}

export default Canvas2D;
