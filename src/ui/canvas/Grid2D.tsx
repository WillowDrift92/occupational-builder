function Grid2D() {
  return (
    <div className="card">
      <h3>2D Grid</h3>
      <p>Use the canvas to lay out elements with millimeter precision.</p>
      <div
        aria-hidden
        style={{
          height: "200px",
          backgroundSize: "20px 20px",
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          borderRadius: "0.5rem",
        }}
      />
    </div>
  );
}

export default Grid2D;
