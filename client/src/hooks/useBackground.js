import { useState } from "react";
import { BACKGROUNDS } from "../data/backgrounds";

const STORAGE_KEY = "nightfocus.background";

function loadIndex() {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const index = BACKGROUNDS.findIndex((bg) => bg.id === savedId);
    return index === -1 ? 0 : index;
  } catch {
    return 0;
  }
}

export function useBackground() {
  const [index, setIndex] = useState(loadIndex);

  function select(newIndex) {
    const wrapped = (newIndex + BACKGROUNDS.length) % BACKGROUNDS.length;
    setIndex(wrapped);
    try {
      localStorage.setItem(STORAGE_KEY, BACKGROUNDS[wrapped].id);
    } catch {
      // storage unavailable (private mode, etc.), choice just won't be saved
    }
  }

  return {
    background: BACKGROUNDS[index],
    count: BACKGROUNDS.length,
    next: () => select(index + 1),
    prev: () => select(index - 1),
  };
}