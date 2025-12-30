import React from "react";

export const Toolbox: React.FC = () => {
  return (
    <div className="panel">
      <h2 className="panel-title">Toolbox</h2>
      <div className="tool-group">
        <button className="tool-button">Ramp</button>
        <button className="tool-button">Platform</button>
        <button className="tool-button">Select / Move</button>
        <button className="tool-button">Delete</button>
        <label className="tool-option">
          <input type="checkbox" /> Snap
        </label>
      </div>
    </div>
  );
};
