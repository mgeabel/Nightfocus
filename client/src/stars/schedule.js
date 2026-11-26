import { createStar } from "./starTypes";

export const BASE_GAP_MS = 17000;  // about one star every 17 seconds
export const GAP_JITTER_MS = 7000; // give or take up to 7 seconds

function nextGap() {
  // Math.random() * 2 - 1 is a random number from -1 to 1
  return BASE_GAP_MS + (Math.random() * 2 - 1) * GAP_JITTER_MS;
}

// Made once when a session starts. Each entry is a star plus "at":
// the amount of focused time (ms) after which it appears.
export function createStarSchedule(limitMs) {
  const schedule = [];
  let at = nextGap();

  while (at <= limitMs) {
    schedule.push({ ...createStar(), at });
    at += nextGap();
  }

  return schedule;
}

// How many stars have been reached after this much focused time.
// The schedule is in time order, so we can stop at the first one not reached.
export function countReached(schedule, elapsedMs) {
  let count = 0;
  while (count < schedule.length && schedule[count].at <= elapsedMs) {
    count++;
  }
  return count;
}
