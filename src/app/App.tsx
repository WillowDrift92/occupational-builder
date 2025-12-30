import TopBar from "../ui/layout/TopBar";
import Toolbox from "../ui/layout/Toolbox";
import Inspector from "../ui/layout/Inspector";
import Canvas2D from "../ui/canvas/Canvas2D";
import Preview3D from "../ui/preview/Preview3D";
import TutorialStub from "../ui/tutorial/TutorialStub";

function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="workspace">
        <aside className="sidebar">
          <Toolbox />
          <TutorialStub />
        </aside>
        <main className="canvas-stack">
          <Canvas2D />
          <Preview3D />
        </main>
        <aside className="inspector">
          <Inspector />
        </aside>
      </div>
    </div>
  );
}

export default App;
