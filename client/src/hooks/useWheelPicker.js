import { useRef, useState } from "react";

const FRICTION = 0.94;     // share of speed kept each frame after a flick
const STOP_SPEED = 0.002;  // items per ms; slower than this, it starts snapping
const SNAP_EASE = 0.2;     // how much of the remaining distance to close each frame
const WHEEL_STEP = 40;     // mouse wheel distance needed to move one item

export function useWheelPicker({ count, index, onChange, itemSize, axis, disabled }) {
  const [position, setPosition] = useState(index);
  const [active, setActive] = useState(false);

  const posRef = useRef(index);
  const reportedRef = useRef(index);
  const draggingRef = useRef(false);
  const lastRef = useRef({ coord: 0, time: 0 });
  const velocityRef = useRef(0);
  const frameRef = useRef(null);
  const wheelRef = useRef(0);

  function clamp(p) {
    return Math.min(Math.max(p, 0), count - 1);
  }

  function moveTo(p) {
    posRef.current = p;
    setPosition(p);
    const rounded = Math.round(p);
    if (rounded !== reportedRef.current) {
      reportedRef.current = rounded;
      onChange(rounded);
    }
  }

  function getCoord(e) {
    return axis === "x" ? e.clientX : e.clientY;
  }

  function onPointerDown(e) {
    if (disabled) return;
    cancelAnimationFrame(frameRef.current);
    if (!active) {
      posRef.current = index;
      reportedRef.current = index;
      setPosition(index);
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    velocityRef.current = 0;
    lastRef.current = { coord: getCoord(e), time: e.timeStamp };
    setActive(true);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    const coord = getCoord(e);
    const dt = e.timeStamp - lastRef.current.time;
    const deltaItems = (lastRef.current.coord - coord) / itemSize;
    moveTo(clamp(posRef.current + deltaItems));
    if (dt > 0) {
      velocityRef.current = 0.8 * (deltaItems / dt) + 0.2 * velocityRef.current;
    }
    lastRef.current = { coord, time: e.timeStamp };
  }

  function onPointerUp(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.timeStamp - lastRef.current.time > 80) velocityRef.current = 0;
    glide();
  }

  function glide() {
    let lastTime = performance.now();

    function frame(now) {
      const dt = now - lastTime;
      lastTime = now;
      const v = velocityRef.current;

      if (Math.abs(v) > STOP_SPEED) {
        const next = posRef.current + v * dt;
        const hitEdge = next < 0 || next > count - 1;
        velocityRef.current = hitEdge ? 0 : v * Math.pow(FRICTION, dt / 16.7);
        moveTo(clamp(next));
      } else {
        const target = Math.round(posRef.current);
        const diff = target - posRef.current;
        if (Math.abs(diff) < 0.005) {
          moveTo(target);
          setActive(false);
          return;
        }
        moveTo(posRef.current + diff * SNAP_EASE);
      }
      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);
  }

  function step(direction) {
    if (disabled || active) return;
    const next = clamp(index + direction);
    if (next !== index) onChange(next);
  }

  function onWheel(e) {
    if (disabled || active) return;
    wheelRef.current += axis === "x" ? e.deltaX || e.deltaY : e.deltaY;
    if (Math.abs(wheelRef.current) >= WHEEL_STEP) {
      step(Math.sign(wheelRef.current));
      wheelRef.current = 0;
    }
  }

  function onKeyDown(e) {
    const back = axis === "x" ? "ArrowLeft" : "ArrowUp";
    const forward = axis === "x" ? "ArrowRight" : "ArrowDown";
    if (e.key === back) {
      e.preventDefault();
      step(-1);
    }
    if (e.key === forward) {
      e.preventDefault();
      step(1);
    }
  }

  return {
    position: active ? position : index,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel,
      onKeyDown,
    },
  };
}