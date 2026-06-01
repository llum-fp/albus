# P2 · Backend / Platform

> Read first: root `CLAUDE.md`, `docs/API_CONTRACT.md` (you implement it), `docs/ROLES.md`.
> Branch prefix: `be/*`. You own all of `backend/`.

## Mission
Own the public API, storage, and the **course lifecycle** (the human-approval gate). Be the
reliable spine the other lanes depend on. Runs standalone via `app/stub.py` (no agent, no key).

## What you own
```
app/main.py        FastAPI app + CORS
app/routes.py      the API (CRUD + /approve /publish /archive + filters)
app/models.py      Course/Module/Profile/Status (mirror of shared/schema)
app/storage.py     one JSON file per course (swap for a DB behind this interface)
app/stub.py        offline generator
app/generator.py   the single seam to the agent (ALBUS_USE_AGENT=1)
```

## Spec features that are YOURS
- Course lifecycle `draft→approved→published→archived`; end-users see only `published`. **(built)**
- Per-profile + per-status visibility filtering on `GET /api/courses`. **(built)**
- RF-2/RF-3 generation request → draft, then approve/publish. **(built, synchronous)**
- Future: **auth** (username/password, roles admin/end-user, profile), async generation +
  `status: generating` + polling, evaluations/attempts, progress, certificates, feedback, dashboard.

## Implemented vs. build-next
- ✅ All API_CONTRACT endpoints, lifecycle transitions, filters, file storage, agent seam + fallback.
- 🔜 Make POST async (return `generating`, flip to `draft` when done); real DB; auth + sessions;
  endpoints for the future entities (attempts, progress, certs, feedback, dashboard aggregates).
- ⛔ Don't auto-publish anything, ever. Generation always yields `draft`.

## Day plan
- **D1:** confirm every contract endpoint over HTTP; keep stub generation solid.
- **D2:** flip `ALBUS_USE_AGENT=1` (real agent) with fallback intact; add async + status polling.
- **D3:** persistence hardening; export (Markdown/PDF) if time; help P5 with the deploy.

## Gotchas
- **Adding a required `Course` field?** Also set it where `CourseSummary` is built in
  `storage.list_summaries()` — otherwise the `except: continue` swallows it and lists come back empty.
- Don't unit-test routes by calling them directly: `Query(None)` defaults aren't `None` outside
  FastAPI. Test over HTTP. `TestClient` needs `httpx` (add it if you want it).
- Storage is intentionally a file-per-course; keep the `get/save/list_summaries` interface stable
  so swapping in a DB doesn't touch `routes.py`.
