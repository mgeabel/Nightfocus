import { useEffect, useRef, useState } from "react";
import { MAX_SESSION_MS } from "../constants";

export function useTimer({ mode, durationMs }) {
  const [status, setStatus] = useState("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef(null);
  const elapsedBeforeRef = useRef(0);

  // Countdown stops at its duration, count-up stops at the 3-hour max.
  const limitMs = mode === "down" ? durationMs : MAX_SESSION_MS;

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      const elapsed = elapsedBeforeRef.current + (Date.now() - startedAtRef.current);

      if (elapsed >= limitMs) {
        setElapsedMs(limitMs);
        setStatus("finished");
      } else {
        setElapsedMs(elapsed);
      }
    }, 250);

    return () => clearInterval(id);
  }, [status, limitMs]);

  function start() {
    if (status === "running" || status === "finished") return;

    if (elapsedBeforeRef.current >= limitMs) {
      setElapsedMs(limitMs);
      setStatus("finished");
      return;
    }

    startedAtRef.current = Date.now();
    setStatus("running");
  }

  function pause() {
    if (status !== "running") return;
    elapsedBeforeRef.current += Date.now() - startedAtRef.current;
    setElapsedMs(elapsedBeforeRef.current);
    setStatus("paused");
  }

  function reset() {
    elapsedBeforeRef.current = 0;
    startedAtRef.current = null;
    setElapsedMs(0);
    setStatus("idle");
  }

  const displaySeconds =
    mode === "down"
      ? Math.ceil(Math.max(durationMs - elapsedMs, 0) / 1000)
      : Math.floor(elapsedMs / 1000);

  return { status, elapsedMs, displaySeconds, start, pause, reset };
}