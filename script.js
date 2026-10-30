const FOCUS_SECONDS = 25 * 60;

let secondsLeft = FOCUS_SECONDS;
let intervalId = null;
let endTime = null;

const display = document.getElementById("display");
const toggleBtn = document.getElementById("toggle");
const resetBtn = document.getElementById("reset");

function render() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  display.textContent = `${minutes}:${seconds}`;
}

function start() {
  // work out when the timer should finish, then compare against the clock each tick
  endTime = Date.now() + secondsLeft * 1000;
  intervalId = setInterval(tick, 250);
  toggleBtn.textContent = "Pause";
}

function pause() {
  clearInterval(intervalId);
  intervalId = null;
  toggleBtn.textContent = "Start";
}

function tick() {
  secondsLeft = Math.round((endTime - Date.now()) / 1000);
  if (secondsLeft <= 0) {
    secondsLeft = 0;
    pause();
  }
  render();
}

function reset() {
  pause();
  secondsLeft = FOCUS_SECONDS;
  render();
}

toggleBtn.addEventListener("click", () => {
  if (intervalId) {
    pause();
  } else {
    start();
  }
});

resetBtn.addEventListener("click", reset);

render();