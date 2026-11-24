const MIN_MINUTES = 5;
const MAX_MINUTES = 180;
const STEP_MINUTES = 5;

function TimerSettings({ mode, onModeChange, minutes, onMinutesChange, disabled }) {
  return (
    <div className="settings">
      <div className="mode-toggle">
        <button
          className={mode === "down" ? "active" : ""}
          onClick={() => onModeChange("down")}
          disabled={disabled}
        >
          Count down
        </button>
        <button
          className={mode === "up" ? "active" : ""}
          onClick={() => onModeChange("up")}
          disabled={disabled}
        >
          Count up
        </button>
      </div>

      {mode === "down" && (
        <label className="duration">
          <span>{minutes} min</span>
          <input
            type="range"
            min={MIN_MINUTES}
            max={MAX_MINUTES}
            step={STEP_MINUTES}
            value={minutes}
            onChange={(e) => onMinutesChange(Number(e.target.value))}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}

export default TimerSettings;