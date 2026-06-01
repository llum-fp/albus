# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What Albus is

An agent platform that turns internal documentation (Confluence / SharePoint) into **adaptive
training courses**, re-projected for the reader's audience (sales vs. technical), level
(beginner → advanced) and scope (internal vs. external). Hackathon POC.

Demo target: pick a service (e.g. **Captive Portal**) → generate a *Sales/external* course →
regenerate the *same source* as *Technical/internal*. Same knowledge, two audiences.

## Repository structure — 5 independent lanes

The repo is split so five people work in parallel branches without touching each other's files.

| Dir         | Lane                         | Standalone via    | Branch prefix |
|-------------|------------------------------|-------------------|---------------|
| `frontend/` | Admin + User portals (React/Vite/TS) | `src/mock.ts`     | `fe/*`        |
| `backend/`  | API + storage (FastAPI)      | `app/stub.py`     | `be/*`        |
| `agent/`    | Course creator (Claude Agent SDK) | `course_creator/stub.py` | `agent/*` |
| `ingestion/`| Doc retrieval (Confluence/SharePoint) | `corpus/*.json` | `ingest/*` |
| `Makefile`+`docs/`+`shared/` | Integration / DevOps / demo + contract steward | — | `ops/*` |

### The one rule that prevents conflicts
Lanes communicate **only** through the contracts: `docs/API_CONTRACT.md`,
`docs/RETRIEVAL_CONTRACT.md`, and `shared/schema/course.schema.json`. Inside your own dir, do
anything. The shared files (`shared/`, `docs/`) are owned by the **Integration lane (`ops/*`)**
and change via reviewed PR — never edit a contract silently. The `Course` shape is duplicated in
three places that must stay in sync: `shared/schema/course.schema.json` (source of truth),
`backend/app/models.py` (Pydantic), `frontend/src/types.ts` (TS).

See `docs/ROLES.md` (ownership map) and `docs/WORKPLAN.md` (3-day, 5-person schedule + Jira stories).

## Running it

Three terminals (each lane runs independently):

```bash
# Backend → http://localhost:8000  (Swagger at /docs)
cd backend && ./run.sh

# Frontend → http://localhost:5173  (proxies /api → :8000)
cd frontend && npm install && npm run dev

# Agent (offline stub, no API key needed)
cd agent && python run_cli.py --service "Captive Portal" --audience sales --level beginner --scope external
```

Stop background servers: `pkill -f uvicorn` / `pkill -f vite`. Logs in `/tmp/albus-*.log`.

## How generation is wired

```
frontend ─HTTP→ backend ─generator.py→ agent ─sources.py→ ingestion
                  │                       │                   │
               app/stub.py     course_creator/stub.py    corpus/*.json   (each: offline fallback)
```

- **`backend/app/generator.py`** is the single backend↔agent seam. It uses the backend stub by
  default; set `ALBUS_USE_AGENT=1` to shell out to the agent CLI, with automatic stub fallback
  on any error (the demo must never break).
- **`agent/course_creator/creator.py`** `generate()` uses the **Claude Agent SDK** when
  `ANTHROPIC_API_KEY` is set, else its own stub. `_generate_with_claude()` is a single-shot call
  today — the intended growth path is the pipeline **curator → syllabus → writer → audience-adapter
  → QA**.
- **`agent/course_creator/sources.py`** is the agent↔ingestion seam: it shells out to
  `ingestion/run_cli.py --json` for scope-redacted source chunks (`docs/RETRIEVAL_CONTRACT.md`),
  empty list if unavailable. **`ingestion/retriever/retriever.py`** enforces the
  internal/external redaction boundary — never the LLM. Phase 2 swaps the stub corpus for
  Confluence/SharePoint via MCP + pgvector behind the same `retrieve()` signature.
- **Personas are config, not code**: `agent/personas.yaml`. Adding an audience = a new entry.

## Conventions & gotchas

- POST `/api/courses` generates **synchronously** in the POC (returns `status: "ready"`). Phase 2:
  enqueue and return `status: "generating"`.
- Course `id` is a deterministic slug: `{service-slug}-{audience}-{level}-{scope}`. Regenerating
  the same persona overwrites; a different persona creates a new course. Committed sample courses
  are named `sample-*.json` (kept by `.gitignore`; all other generated courses are ignored).
- `scope` is not just tone — `internal` may include confidential content, `external` must not.
  Enforced at retrieval in Phase 2; today it only shapes stub output.
- Backend storage is one JSON file per course under `backend/data/courses/` (`app/storage.py`).
  Swap for a DB behind that interface without touching `routes.py`.
- `frontend/src/api.ts` falls back to `mock.ts` when the API is down — the UI always renders.
- No test suite yet. `FastAPI TestClient` needs `httpx` (not in `requirements.txt`); test route
  functions directly or add `httpx` first.

## Git

Default branch `main`; lane branches `fe/*`, `be/*`, `agent/*`. Keep PRs scoped to one lane.
No remote is configured yet.
