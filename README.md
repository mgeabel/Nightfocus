# NightFocus

A night-themed focus timer website. Still in early development.

## Features so far

- **Two timer modes:** count down or count up, switched with a small scroll wheel next to the timer. You can switch while the timer is paused and the time you already focused carries over.
- **Time rotor:** in countdown mode, a watch-style rotor under the timer sets the length from 5 minutes to 3 hours in 5-minute steps. Drag or flick it and the timer updates as you go.
- **Background picker:** click anywhere outside the timer to zoom out, then switch backgrounds with the arrows, a swipe, or the arrow keys. Your choice is saved in the browser.
- **Stars (in progress):** a canvas star field with faint background dust and glowing stars that flare up and settle into small dots.

## Planned

- One star lights up for every minute you focus, and over a session the stars form a galaxy. Different galaxy patterns to choose from, starting with a Milky Way.
- Session history.
- Accounts so your history syncs across devices, with a backend API and a PostgreSQL or MySQL database.

## Project layout

```
client/   React app (Vite)
server/   backend API (coming later)
```

## Running it locally

You need Node.js 20 or newer.

```
cd client
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173).

The original plain HTML/CSS/JS version is saved under the git tag `v0.1.0-vanilla`.
