type RotateControlsProps = {
  disabled: boolean;
  onRotateNeg90: () => void;
  onRotatePos90: () => void;
};

export default function RotateControls({ disabled, onRotateNeg90, onRotatePos90 }: RotateControlsProps) {
  return (
    <div className="top-bar__rotations">
      <button
        type="button"
        className="mode-button mode-button--ghost"
        onClick={onRotateNeg90}
        disabled={disabled}
      >
        Rotate -90°
      </button>
      <button
        type="button"
        className="mode-button mode-button--ghost"
        onClick={onRotatePos90}
        disabled={disabled}
      >
        Rotate +90°
      </button>
    </div>
  );
}
