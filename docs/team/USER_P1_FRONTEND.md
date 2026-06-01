# P1 · Frontend

> Read first: root `CLAUDE.md` (implementation status), `docs/API_CONTRACT.md` (your contract),
> `docs/ROLES.md`. Your branch prefix: `fe/*`. You own all of `frontend/`.

## Mission
Build the two web portals. Make the **admin approval lifecycle** and **per-profile visibility**
unmistakable on screen — those are the product's whole point.

## What you own
`frontend/` only. React + Vite + TS. Runs standalone via `src/mock.ts` (an in-memory store) when
the backend is down, so you are never blocked.

```
src/pages/AdminPortal.tsx   create draft + list ALL courses + Approve/Publish actions
src/pages/UserPortal.tsx    profile selector + ONLY published courses for that profile
src/pages/CourseView.tsx    reader; admin variant shows the approve/publish bar
src/api.ts                  the API client (contract: docs/API_CONTRACT.md)
src/mock.ts                 offline fallback store
src/types.ts                mirrors shared/schema/course.schema.json — keep in sync via PR
```

## Spec features that are YOURS (RF refs → screens)
- RF-3 review/approve: admin sees draft→approved→published, acts explicitly. **(built — polish it)**
- RF-5 learning paths/progress: end-user home by profile, "continue where you left off". *(progress = future)*
- RF-4 interactive content in-page (Course→Module→Lesson→Unit). *(today Course→Module; deeper later)*
- RF-6 AI tutor "ask Albus" embedded in a lesson. *(UI shell now optional; logic is P3)*
- RF-7 evaluations UI, RF-8 feedback form, RF-9 certificate view. *(future — stub screens if time)*

## Implemented vs. build-next
- ✅ Both portals, lifecycle badges, profile-scoped listing, approve/publish buttons.
- 🔜 Loading/empty/error states; markdown rendering polish; a tutor chat panel shell;
  evaluation-taking UI; feedback + certificate screens.
- ⛔ Don't build auth/login yet (no backend auth) — the profile selector simulates it.

## Day plan
- **D1:** portals render from `mock.ts`; admin create→draft→approve→publish loop visible.
- **D2:** wire to the live backend; show "generating…"; the create→approve→publish loop hits the real pipeline.
- **D3:** citations in the reader, polish, empty/error states; rehearse the admin-approval demo beat.

## Gotchas
- The `Course` shape lives in 3 files; if you need a field change, raise it with P5 (contract PR).
- Keep the visibility rule honest: the User portal must request `status=published&profile=…`.
