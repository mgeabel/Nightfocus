import { useWheelPicker } from "../hooks/useWheelPicker";

const MODES = [
  { id: "down", label: "count down" },
  { id: "up", label: "count up" },
];
const ITEM_HEIGHT = 28;

function ModeWheel({ mode, onModeChange, disabled }) {
  const index = MODES.findIndex((m) => m.id === mode);

  const wheel = useWheelPicker({
    count: MODES.length,
    index,
    itemSize: ITEM_HEIGHT,
    axis: "y",
    disabled,
    onChange: (i) => onModeChange(MODES[i].id),
  });

  return (
    <div
      className={`mode-wheel ${disabled ? "is-disabled" : ""}`}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label="Timer mode"
      aria-valuemin={0}
      aria-valuemax={MODES.length - 1}
      aria-valuenow={index}
      aria-valuetext={MODES[index].label}
      {...wheel.handlers}
    >
      {MODES.map((m, i) => {
        const offset = i - wheel.position;
        return (
          <span
            key={m.id}
            className="mode-wheel-item"
            style={{
              transform: `translateY(${offset * ITEM_HEIGHT}px) rotateX(${offset * -45}deg)`,
              opacity: Math.max(1 - Math.abs(offset) * 0.6, 0),
            }}
          >
            {m.label}
          </span>
        );
      })}
    </div>
  );
}

export default ModeWheel;