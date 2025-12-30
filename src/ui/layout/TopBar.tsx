import React from "react";

type TopBarProps = {
  is3DMode: boolean;
  onToggleMode: () => void;
};

export const TopBar: React.FC<TopBarProps> = ({ is3DMode, onToggleMode }) => {
  const toggleLabel = is3DMode ? "Edit in 2D" : "Edit in 3D";

  return (
    <header className="top-bar">
      <div className="brand">Occupational Builder</div>
      <button className="mode-toggle" onClick={onToggleMode}>
        {toggleLabel}
      </button>
    </header>
  );
};
