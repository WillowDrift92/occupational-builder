import React, { useState } from "react";
import { Canvas2D } from "../ui/canvas/Canvas2D";
import { Preview3D } from "../ui/preview/Preview3D";
import { Inspector } from "../ui/layout/Inspector";
import { TopBar } from "../ui/layout/TopBar";
import { Toolbox } from "../ui/layout/Toolbox";
import "./styles.css";

export const AppShell: React.FC = () => {
  const [is3DMode, setIs3DMode] = useState(false);

  const handleToggleMode = () => {
    setIs3DMode((prev) => !prev);
  };

  return (
    <div className="app-shell">
      <TopBar is3DMode={is3DMode} onToggleMode={handleToggleMode} />
      <div className="workspace">
        <aside className="sidebar toolbox">
          <Toolbox />
        </aside>
        <main className="canvas-area">
          {is3DMode ? <Preview3D /> : <Canvas2D />}
        </main>
        <aside className="sidebar inspector">
          <Inspector />
        </aside>
      </div>
    </div>
  );
};
