import { useWheelPicker } from "../hooks/useWheelPicker";

const MIN = 5;
const MAX = 180;
const STEP = 5;
const VALUES = Array.from({ length: (MAX - MIN) / STEP + 1 }, (_, i) => MIN + i * STEP);

const TICK_SPACING = 14;   // px between ticks at the center
const DEG_PER_TICK = 6;    // how far the drum turns per tick
const RADIUS = TICK_SPACING / ((DEG_PER_TICK * Math.PI) / 180);

function TimeRotor({ minutes, onMinutesChange, visible }) {
  const index = VALUES.indexOf(minutes);

  const wheel = useWheelPicker({
    count: VALUES.length,
    index,
    itemSize: TICK_SPACING,
    axis: "x",
    disabled: !visible,
    onChange: (i) => onMinutesChange(VALUES[i]),
  });

  return (
    <div
      className={`time-rotor ${visible ? "" : "is-hidden"}`}
      aria-hidden={!visible}
      role="slider"
      tabIndex={visible ? 0 : -1}
      aria-label="Focus length"
      aria-valuemin={MIN}
      aria-valuemax={MAX}
      aria-valuenow={minutes}
      aria-valuetext={`${minutes} minutes`}
      {...wheel.handlers}
    >
      {VALUES.map((value, i) => {
        const angle = (i - wheel.position) * DEG_PER_TICK;
        if (Math.abs(angle) >= 90) return null;

        const rad = (angle * Math.PI) / 180;
        const x = Math.sin(rad) * RADIUS;
        const depth = Math.cos(rad);

        return (
          <span
            key={value}
            className={value % 30 === 0 ? "tick tick-long" : "tick"}
            style={{ transform: `translateX(${x}px) scaleX(${depth})`, opacity: depth }}
          />
        );
      })}
      <span className="rotor-center" />
    </div>
  );
}

export default TimeRotor;