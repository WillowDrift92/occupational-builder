import { APP_VERSION } from "../../app/version";
import { EditMode } from "../../app/AppShell";
import RotateControls from "../controls/RotateControls";

type TopBarProps = {
  mode: EditMode;
  onSetMode: (mode: EditMode) => void;
  canRotate: boolean;
  onRotateLeft: () => void;
  onRotateRight: () => void;
};

export default function TopBar({ mode, onSetMode, canRotate, onRotateLeft, onRotateRight }: TopBarProps) {
  return (
    <header className="top-bar">
      <h1 className="top-bar__title">Occupational Builder v{APP_VERSION}</h1>
      <div className="top-bar__actions">
        <RotateControls disabled={!canRotate} onRotateNeg90={onRotateLeft} onRotatePos90={onRotateRight} />
        <div className="top-bar__modes">
          <button
            type="button"
            className={`mode-button ${mode === "2d" ? "mode-button--active" : ""}`}
            onClick={() => onSetMode("2d")}
          >
            Edit in 2D
          </button>
          <button
            type="button"
            className={`mode-button ${mode === "3d" ? "mode-button--active" : ""}`}
            onClick={() => onSetMode("3d")}
          >
            Edit in 3D
          </button>
        </div>
      </div>
    </header>
  );
}
