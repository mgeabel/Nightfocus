import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./utils/formatTime";
import ModeWheel from "./components/ModeWheel";
import TimeRotor from "./components/TimeRotor";
import { useBackground } from "./hooks/useBackground";
import BackgroundPicker from "./components/BackgroundPicker";
import StarField from "./components/StarField";
import { createStarSchedule, countReached } from "./stars/schedule";
import { MAX_SESSION_MS } from "./constants";

const NO_STARS = [];

function App() {
  const [mode, setMode] = useState("down");
  const [minutes, setMinutes] = useState(25);

  const timer = useTimer({ mode, durationMs: minutes * 60 * 1000 });
  const isRunning = timer.status === "running";
  const showRotor = mode === "down" && timer.status === "idle";
  const modeLocked = timer.status === "running" || timer.status === "finished";
  const [picking, setPicking] = useState(false);
  const bg = useBackground();
  const [schedule, setSchedule] = useState(null);

  // Stars are worked out from the schedule and the focused time.
  // Nothing to keep in sync: pause, resume and mode switches just work.
  const starCount = schedule ? countReached(schedule, timer.elapsedMs) : 0;
  const stars = schedule ? schedule.slice(0, starCount) : NO_STARS;

  function handleStart() {
    // A fresh session gets a fresh schedule. Resuming after a pause keeps it.
    if (timer.status === "idle") {
      setSchedule(createStarSchedule(MAX_SESSION_MS));
    }
    timer.start();
  }

  function handleReset() {
    timer.reset();
    setSchedule(null);
  }

  function handleStageClick(e) {
    if (e.target === e.currentTarget) setPicking(true);
  }

  return (
    <div className={`app ${picking ? "is-picking" : ""}`}>
      <div
        className="stage"
        style={{ backgroundImage: `url(${bg.background.src})` }}
        onClick={handleStageClick}
      >
        <StarField stars={stars} />
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
              onClick={isRunning ? timer.pause : handleStart}
              disabled={timer.status === "finished"}
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </main>
      </div>

      {picking && (
        <BackgroundPicker
          onPrev={bg.prev}
          onNext={bg.next}
          onClose={() => setPicking(false)}
          canSwitch={bg.count > 1}
        />
      )}
    </div>
  );
}

export default App;