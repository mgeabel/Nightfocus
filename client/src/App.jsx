import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./utils/formatTime";
import ModeWheel from "./components/ModeWheel";
import TimeRotor from "./components/TimeRotor";

function App() {
  const [mode, setMode] = useState("down");
  const [minutes, setMinutes] = useState(25);

  const timer = useTimer({ mode, durationMs: minutes * 60 * 1000 });
  const isRunning = timer.status === "running";
  const showRotor = mode === "down" && timer.status === "idle";
  const modeLocked = timer.status === "running" || timer.status === "finished";

  return (
    <main className="timer">
      <div className={`timer-row ${showRotor ? "" : "lowered"}`}>
        <ModeWheel mode={mode} onModeChange={setMode} disabled={modeLocked} />
        <h1 id="display">{formatTime(timer.displaySeconds)}</h1>
      </div>

      <div className="rotor-slot">
        <TimeRotor
          minutes={minutes}
          onMinutesChange={setMinutes}
          visible={showRotor}
        />
      </div>

      <div className="controls">
        <button
          onClick={isRunning ? timer.pause : timer.start}
          disabled={timer.status === "finished"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={timer.reset}>Reset</button>
      </div>
    </main>
  );
}

export default App;