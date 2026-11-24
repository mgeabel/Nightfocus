import { useTimer } from "./hooks/useTimer";
import { formatTime } from "./utils/formatTime";

const FOCUS_MS = 25 * 60 * 1000;

function App() {
  const timer = useTimer({ mode: "down", durationMs: FOCUS_MS });
  const isRunning = timer.status === "running";

  return (
    <main className="timer">
      <h1 id="display">{formatTime(timer.displaySeconds)}</h1>
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