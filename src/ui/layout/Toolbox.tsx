import { useState } from "react";

const tools = [
  { id: "select", label: "Select / Move" },
  { id: "ramp", label: "Ramp" },
  { id: "platform", label: "Platform" },
  { id: "delete", label: "Delete" },
];

function Toolbox() {
  const [activeTool, setActiveTool] = useState<string>(tools[0].id);
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);

  return (
    <section className="card" aria-labelledby="toolbox-title">
      <h2 id="toolbox-title">Toolbox</h2>
      <div className="button-row" role="toolbar" aria-label="Placement tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            aria-pressed={activeTool === tool.id}
            onClick={() => setActiveTool(tool.id)}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <label className="toolbar" aria-label="Snap to grid toggle">
        <span>Snap to grid</span>
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={(event) => setSnapEnabled(event.target.checked)}
        />
      </label>
      <p className="tag">Placement units: millimeters (mm)</p>
    </section>
  );
}

export default Toolbox;
