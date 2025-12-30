function TopBar() {
  return (
    <header className="card topbar">
      <div className="button-row" aria-label="history controls">
        <button type="button">Undo</button>
        <button type="button">Redo</button>
      </div>
      <div className="button-row" aria-label="view toggles">
        <span className="tag">Units: mm</span>
        <button type="button">Edit in 2D</button>
        <button type="button">Edit in 3D</button>
      </div>
    </header>
  );
}

export default TopBar;
