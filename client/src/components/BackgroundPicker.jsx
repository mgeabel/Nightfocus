import { useEffect, useRef } from "react";

const SWIPE_DISTANCE = 50; // px needed to count as a swipe
const TAP_DISTANCE = 10;   // px or less counts as a tap

function BackgroundPicker({ onPrev, onNext, onClose, canSwitch }) {
  const startXRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext, onClose]);

  function handlePointerDown(e) {
    if (e.target.closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
  }

  function handlePointerUp(e) {
    if (startXRef.current === null) return;
    const dx = e.clientX - startXRef.current;
    startXRef.current = null;

    if (dx <= -SWIPE_DISTANCE) onNext();
    else if (dx >= SWIPE_DISTANCE) onPrev();
    else if (Math.abs(dx) <= TAP_DISTANCE) onClose();
  }

  function handlePointerCancel() {
    startXRef.current = null;
  }

  return (
    <div
      className="bg-picker"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <button
        className="bg-arrow bg-arrow-left"
        onClick={onPrev}
        disabled={!canSwitch}
        aria-label="Previous background"
      >
        ‹
      </button>
      <button
        className="bg-arrow bg-arrow-right"
        onClick={onNext}
        disabled={!canSwitch}
        aria-label="Next background"
      >
        ›
      </button>
      <p className="bg-picker-hint">swipe or use the arrows · tap to close</p>
    </div>
  );
}

export default BackgroundPicker;