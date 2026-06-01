# Frontend (`fe/*`)

React + Vite. Two portals:
- **Admin** (`/admin`) — create a course (the form that drives generation)
- **Learn** (`/learn`, `/learn/:id`) — browse & consume courses

Runs **standalone**: if the backend is down, `api.ts` falls back to `mock.ts`, so you can build
UI with no backend running.

## Run
```bash
npm install
npm run dev      # http://localhost:5173  (proxies /api → localhost:8000)
```

## Layout
- `src/pages/AdminPortal.tsx` — creation form
- `src/pages/UserPortal.tsx` — catalogue
- `src/pages/CourseView.tsx` — reader + the **↻ Regenerate for a different audience** button (demo money shot)
- `src/api.ts` — API client (contract in `docs/API_CONTRACT.md`)
- `src/mock.ts` — offline fallback data
- `src/types.ts` — mirrors `shared/schema/course.schema.json`

## Your first task
Make the **regenerate-as-different-persona** flow feel great — that single click (sales/external →
technical/internal) is the demo.
