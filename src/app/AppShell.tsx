import { useEffect, useMemo, useState } from "react";
import { newPlatformAt, newRampAt } from "../model/defaults";
import { Object2D, Tool } from "../model/types";
import Canvas2D from "../ui/canvas/Canvas2D";
import Preview3D from "../ui/preview/Preview3D";
import Inspector from "../ui/layout/Inspector";
import TopBar from "../ui/layout/TopBar";
import Toolbox from "../ui/layout/Toolbox";
import "./styles.css";

export type EditMode = "2d" | "3d";

const statusText: Record<Tool, string> = {
  select: "Select: Click an object to select. Drag to move.",
  ramp: "Ramp: Specify insertion point. Click to place. Esc to cancel.",
  platform: "Platform: Specify insertion point. Click to place. Esc to cancel.",
  delete: "Delete: Click an object to delete. Esc to cancel.",
};

export default function AppShell() {
  const [mode, setMode] = useState<EditMode>("2d");
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [snapOn, setSnapOn] = useState(true);
  const [objects, setObjects] = useState<Object2D[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleToggleSnap = () => setSnapOn((prev) => !prev);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(activeTag)) {
        return;
      }
      if (event.key === "Escape") {
        setActiveTool("select");
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "v") setActiveTool("select");
      if (key === "r") setActiveTool("ramp");
      if (key === "p") setActiveTool("platform");
      if (key === "d") setActiveTool("delete");
      if (key === "s") setSnapOn((prev) => !prev);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const status = useMemo(() => statusText[activeTool], [activeTool]);

  const handlePlaceAt = (tool: Tool, xMm: number, yMm: number) => {
    if (tool === "ramp") {
      const ramp = newRampAt(xMm, yMm);
      setObjects((prev) => [...prev, ramp]);
      setSelectedId(ramp.id);
    }
    if (tool === "platform") {
      const platform = newPlatformAt(xMm, yMm);
      setObjects((prev) => [...prev, platform]);
      setSelectedId(platform.id);
    }
    setActiveTool("select");
  };

  const handleUpdateObject = (id: string, updater: (obj: Object2D) => Object2D) => {
    setObjects((prev) => prev.map((obj) => (obj.id === id ? updater(obj) : obj)));
  };

  const handleDeleteObject = (id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
    setActiveTool("select");
  };

  const handleClearSelection = () => setSelectedId(null);

  return (
    <div className="ob-root">
      <div className="ob-top">
        <TopBar mode={mode} onSetMode={setMode} />
      </div>
      <div className="ob-main">
        <aside className="ob-left ob-panel">
          <Toolbox
            activeTool={activeTool}
            snapOn={snapOn}
            onToggleSnap={handleToggleSnap}
            onSetActiveTool={setActiveTool}
          />
        </aside>
        <main className="ob-center ob-panel">
          {mode === "2d" ? (
            <Canvas2D
              activeTool={activeTool}
              snapOn={snapOn}
              objects={objects}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onClearSelection={handleClearSelection}
              onPlaceAt={handlePlaceAt}
              onUpdateObject={handleUpdateObject}
              onDeleteObject={handleDeleteObject}
              onSetActiveTool={setActiveTool}
            />
          ) : (
            <Preview3D />
          )}
        </main>
        <aside className="ob-right ob-panel">
          <Inspector />
        </aside>
      </div>
      <div className="ob-statusBar">
        <div className="ob-statusBar__mode">Mode: {activeTool.toUpperCase()}</div>
        <div className="ob-statusBar__hint">{status}</div>
      </div>
    </div>
  );
}
