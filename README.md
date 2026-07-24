# Cruiser Copilot — frontend

Next.js UI for Cruiser Copilot, the evidence-driven diagnostic assistant for
Toyota Land Cruiser 70/80 Series 1HZ / 1HD-T diesel engines.

This app renders the journey — vehicle identification, symptom interview,
evidence capture, ranked workspace, guided repair, outcome — but it makes none
of the diagnostic decisions itself. Every ranking, gate, locked specification
and recommended test comes from the [`cruiser-copilot-backend`](https://github.com/Swolesapper94/cruiser-copilot-backend)
API. This app is a thin, honest renderer of that API's response.

## Non-negotiables

1. OEM and community content are shown as separate, labelled groups — never
   distinguished by colour alone.
2. A locked specification is never worked around client-side. If the backend
   says it's locked, no value is shown, full stop.
3. Media is described, never diagnosed, and an upload requires explicit,
   per-item consent before anything is sent to a model.
4. Reduced motion is a first-class mode: every cinematic transition collapses
   to an instant state change, and the current viewpoint is always stated in
   text as well as shown visually.
5. Nothing here ever renders a `confirmed` hypothesis status — the backend
   never emits one in this MVP, and the UI does not add one.

## Quick start

This app needs `cruiser-copilot-backend` running (default `http://localhost:4000`).

```bash
# in a sibling checkout of cruiser-copilot-backend
npm install && npm run dev

# in this repo
npm install
cp .env.example .env.local   # points at the backend's default port
npm run dev                   # http://127.0.0.1:3000
```

No credentials are required in scripted mode (the backend's default).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config) |
| `npm run test:e2e` | Playwright journey tests (chromium, mobile, reduced motion) |

Playwright needs its browser once: `npx playwright install chromium`. The
Playwright config only starts this frontend (`npm run dev`) — start
`cruiser-copilot-backend` yourself first, since `npm run test:e2e` exercises
the full journey against a real API.

## Layout

```
src/
  app/                    routes: home, /diagnose/[sessionId], /repair/[procedureId]
  components/
    vehicle/               identification wizard + cinematic vehicle stage
    diagnosis/             question card, ranked hypotheses, recommended test,
                           safety gates, conflicts, citations, progress rail
    evidence/              photo/video/measurement capture
    repair/                guided checklist + outcome recorder
  hooks/useReducedMotion.ts
  lib/client/api.ts        thin fetch wrapper around the backend API
  types/index.ts           hand-written mirror of the backend's wire contract
tests/e2e/journey.spec.ts  full MVP journey, reduced-motion, no-confirmation
```

## Why `types/index.ts` isn't generated from zod

The backend owns validation (it parses every request/response through zod).
This frontend never validates — it only renders what the backend already
validated — so it doesn't carry a zod dependency. `src/types/index.ts` is a
hand-written TypeScript mirror of the backend's schemas. If the backend's
contract changes, update this file to match — see the backend's
`docs/DATA_MODEL.md`.

## Safety

This tool assists a competent person; it does not replace one. Diesel
injection systems operate at pressures that cause serious injury. Work cold,
support the vehicle properly, and stop when reality stops matching the
procedure.
