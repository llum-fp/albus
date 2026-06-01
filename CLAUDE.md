# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What Albus is

A web training platform that turns **approved corporate knowledge** (Confluence first, other
sources later) into **interactive courses personalised per end-user profile**. An admin uses AI
to draft a course from existing docs, then **reviews, edits and approves** it before any employee
sees it. Employees consume published courses, are assessed, get certified, leave feedback, and
can ask an **AI tutor** that answers only from approved knowledge (with citations).

**Guiding principle:** AI accelerates authoring, but **a human admin always approves before
publishing. Nothing reaches end-users unapproved.** Platform + content language is **English**.

> Full functional spec: `../Albus_Especificaciones_Proyecto.md` (Spanish). It is the product
> source of truth. This file tracks what is **implemented** vs. **target / not-yet-built**.

## Implementation status (read this before building)

**Implemented in the POC scaffold (architecturally load-bearing — keep these shapes):**
- **Three end-user profiles:** `sales | technical | csm` (Customer Service Manager). A course
  targets exactly one profile; that profile is the visibility axis.
- **Mandatory approval lifecycle:** `draft → approved → published → archived`. Generated courses
  are always `draft`. End-users see ONLY `published` courses of their own profile. Transitions
  are explicit admin actions (`/approve`, `/publish`). This is the spec's core principle, baked in.
- Course CRUD + the per-profile/per-status visibility filter (backend + both portals).
- Admin portal (create draft + review + approve/publish) and User portal (profile-scoped catalogue).
- Grounded retrieval with **citations** (the basis for both generation and the future tutor).

**Documented as TARGET, intentionally NOT built yet (treat as context, do not implement
without being asked):**
- **Auth / login** (username+password, no SSO). Today there is NO auth; the User portal *simulates*
  the logged-in profile with a selector. Roles: admin vs end-user.
- **AI-guided generation dialogue** — the spec wants the AI to *interview* the admin (profile,
  depth, objectives, structure, evaluation) before generating. Today generation is a single-shot
  form → one call.
- **Deeper content hierarchy** Course → Module → **Lesson → Unit**. Today: Course → Module only.
- **AI Tutor chatbot** ("ask Albus") — grounded Q&A in-lesson, cites sources, says "I don't know"
  when retrieval is empty. Lives in the agent lane over the ingestion index. Not built.
- **Evaluations** — typed questions (multiple-choice / true-false / scenario), auto-grading,
  explained feedback, configurable pass threshold, recorded attempts. Today: a seed `quiz` array.
- **Progress tracking, content feedback (ratings/comments), certificates, reporting dashboard.**
- **Live Claude generation** — `_generate_with_claude()` is written but unrun (no SDK installed /
  no key); it falls back to the stub.

### Full target data model (spec §7) — for when these get built
`User` (role, profile), `ContentSource`, `Course`, `Module`, `Lesson/Unit`, `Evaluation`,
`Question`, `EvaluationAttempt`, `Progress`, `ContentFeedback`, `Certificate`, `KnowledgeIndex`.
Only `Course`/`Module` (+ seed quiz) exist today; the rest are future entities.

### Non-functional requirements (spec §9) that shape architecture decisions
- **Deploy on an internal company VM**; corporate knowledge stays under company control.
- **Privacy tension to flag:** the spec prefers data not leaving company control. That argues for a
  **self-hosted open model** in production, which conflicts with the hackathon choice of the
  **hosted Claude API**. Decision: hosted API for the POC (speed); keep the model behind the
  `creator.py` boundary so it can be swapped for a self-hosted model later. Surface this tradeoff
  to stakeholders — don't silently ship corporate docs to a third party in production.
- **Replaceable source connector** (RF-1): the ingestion connector must be swappable (Confluence →
  +SharePoint/Drive/Notion) without redesign. Already structured that way (`connectors.py`).
- Out of scope now: SSO, non-Confluence sources, generation without human review, multi-language.

## Repository structure — 5 independent lanes

The repo is split so five people work in parallel branches without touching each other's files.

| Dir         | Lane                         | Standalone via    | Branch prefix |
|-------------|------------------------------|-------------------|---------------|
| `frontend/` | Admin + User portals (React/Vite/TS) | `src/mock.ts`     | `fe/*`        |
| `backend/`  | API + storage + lifecycle (FastAPI)  | `app/stub.py`     | `be/*`        |
| `agent/`    | Course creator + (future) tutor (Claude Agent SDK) | `course_creator/stub.py` | `agent/*` |
| `ingestion/`| Knowledge index / retrieval (Confluence→…) | `corpus/*.json` | `ingest/*` |
| `Makefile`+`docs/`+`shared/` | Integration / DevOps / demo + contract steward | — | `ops/*` |

Per-person briefs: `docs/team/USER_P1_FRONTEND.md` … `USER_P5_INTEGRATION.md`.

### The one rule that prevents conflicts
Lanes communicate **only** through the contracts: `docs/API_CONTRACT.md`,
`docs/RETRIEVAL_CONTRACT.md`, and `shared/schema/course.schema.json`. Inside your own dir, do
anything. The shared files (`shared/`, `docs/`) are owned by the **Integration lane (`ops/*`)**
and change via reviewed PR — never edit a contract silently. The `Course` shape is duplicated in
three places that must stay in sync: `shared/schema/course.schema.json` (source of truth),
`backend/app/models.py` (Pydantic), `frontend/src/types.ts` (TS).

See `docs/ROLES.md` (ownership map) and `docs/WORKPLAN.md` (3-day, 5-person schedule + Jira stories).

## Running it

```bash
# Backend → http://localhost:8000  (Swagger at /docs)
cd backend && ./run.sh
# Frontend → http://localhost:5173  (proxies /api → :8000)
cd frontend && npm install && npm run dev
# Agent (offline stub, no API key needed)
cd agent && python run_cli.py --service "Captive Portal" --profile sales --level beginner
# Ingestion (approved-knowledge chunks with citations)
cd ingestion && python run_cli.py --service "Captive Portal"
```
From the repo root: `make smoke` runs an offline end-to-end check of every lane.
Stop background servers: `make stop` (or `pkill -f uvicorn` / `pkill -f vite`).

## How generation is wired

```
frontend ─HTTP→ backend ─generator.py→ agent ─sources.py→ ingestion
                  │                       │                   │
               app/stub.py     course_creator/stub.py    corpus/*.json   (each: offline fallback)
```

- **`backend/app/generator.py`** — single backend↔agent seam. Backend stub by default; set
  `ALBUS_USE_AGENT=1` to shell out to the agent CLI, with automatic stub fallback (demo never breaks).
- **`agent/course_creator/creator.py`** `generate()` uses the **Claude Agent SDK** when
  `ANTHROPIC_API_KEY` is set, else its stub. Always returns a **draft**. `_generate_with_claude()`
  is single-shot today — growth path: curator → syllabus → writer → adapter → QA, plus the AI tutor.
- **`agent/course_creator/sources.py`** — agent↔ingestion seam: shells out to `ingestion/run_cli.py
  --json` for cited, approved-knowledge chunks (`docs/RETRIEVAL_CONTRACT.md`); empty list ⇒ the
  agent/tutor must say "I don't know", never invent.
- **Profiles are config, not code**: `agent/personas.yaml`. Profiles are fixed to sales/technical/csm.

## Conventions & gotchas

- POST `/api/courses` generates **synchronously** and always returns `status: "draft"`. Never
  auto-publish — visibility requires an explicit admin `/publish`.
- Course `id` is a deterministic slug: `{service-slug}-{profile}-{level}`. Re-creating the same
  triple overwrites. Committed sample courses are `sample-*.json` (kept by `.gitignore`; other
  generated courses are ignored).
- **Visibility rule (enforce everywhere):** end-users get `?status=published&profile=<theirs>`;
  admins list unfiltered. A draft/approved course must never appear to an end-user.
- Backend storage is one JSON file per course under `backend/data/courses/` (`app/storage.py`).
  Swap for a real DB behind that interface without touching `routes.py`. **When you add a required
  field to `Course`, also add it where `CourseSummary` is built in `storage.list_summaries()`** —
  a missing field there is silently swallowed by the `except: continue` and the list comes back empty.
- `frontend/src/api.ts` falls back to the in-memory `mock.ts` store when the API is down — the UI
  always renders, and create/approve/publish behave in-memory.
- **Testing gotchas:** `FastAPI TestClient` needs `httpx` (not in `requirements.txt`). Also, calling
  a route function *directly* in Python leaves `Query(None)` defaults as `Query` objects, not
  `None`, so filters misfire — test endpoints over **HTTP** (curl / running server), not by calling
  `routes.list_courses()` directly.

## Git

Default branch `main`; lane branches `fe/*`, `be/*`, `agent/*`, `ingest/*`, `ops/*`. Keep PRs
scoped to one lane. No remote is configured yet.
