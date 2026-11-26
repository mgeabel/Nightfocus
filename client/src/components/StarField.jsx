import { useEffect, useRef } from "react";
import { drawStar } from "../stars/drawStar";
import { createDust, drawDust } from "../stars/dust";

const DUST_COUNT = 300;

// Matches the canvas's pixel size to its size on screen.
// devicePixelRatio is 2 or more on sharp screens; without this,
// stars would look blurry on phones and high-res laptops.
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function StarField({ stars }) {
  const dustCanvasRef = useRef(null);
  const starCanvasRef = useRef(null);
  const starsRef = useRef(stars);

  // The animation loop reads the latest stars from this ref,
  // so new stars show up without restarting the loop.
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  useEffect(() => {
    const dustCanvas = dustCanvasRef.current;
    const starCanvas = starCanvasRef.current;
    const dust = createDust(DUST_COUNT);
    // Remembers when each star first showed up, so its flare plays once.
    // A WeakMap uses the star object itself as the key, and forgets
    // stars that no longer exist (after Reset) on its own.
    const appearedAt = new WeakMap();
    let starLayer = null;
    let frameId = null;

    function resize() {
      const dustLayer = setupCanvas(dustCanvas);
      drawDust(dustLayer.ctx, dust, dustLayer.width, dustLayer.height);

      starLayer = setupCanvas(starCanvas);
      // Resizing a canvas resets its settings, so this is set again here.
      // "lighter" makes overlapping glows add up like real light.
      starLayer.ctx.globalCompositeOperation = "lighter";
    }

    function frame() {
      const { ctx, width, height } = starLayer;
      const now = Date.now();

      ctx.clearRect(0, 0, width, height);
      for (const star of starsRef.current) {
        if (!appearedAt.has(star)) appearedAt.set(star, now);
        drawStar(ctx, star, now - appearedAt.get(star), now, width, height);
      }

      frameId = requestAnimationFrame(frame);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(starCanvas);
    frameId = requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="star-field" aria-hidden="true">
      <canvas ref={dustCanvasRef} className="star-layer" />
      <canvas ref={starCanvasRef} className="star-layer" />
    </div>
  );
}

export default StarField;
