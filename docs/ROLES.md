# Roles & branch strategy — 5 parallel lanes

Five owners, disjoint file ownership, zero conflicts. Each lane runs standalone via a
stub/mock so nobody is ever blocked waiting on another lane.

| # | Lane | Owns (files) | Branch | Runs alone via | Talks to others via |
|---|------|--------------|--------|----------------|---------------------|
| 1 | **Frontend** | all of `frontend/` | `fe/*` | `src/mock.ts` | `docs/API_CONTRACT.md` |
| 2 | **Backend / Platform** | all of `backend/` | `be/*` | `app/stub.py` | `API_CONTRACT.md`, calls agent via `generator.py` |
| 3 | **Agent / Course creator** | `agent/course_creator/`, `agent/personas.yaml`, `agent/run_cli.py` | `agent/*` | `course_creator/stub.py` | produces `Course` schema; calls ingestion via `sources.py` |
| 4 | **Ingestion / Retrieval** | all of `ingestion/` | `ingest/*` | `corpus/*.json` | `docs/RETRIEVAL_CONTRACT.md` |
| 5 | **Integration / DevOps / Demo** | `Makefile`, CI, `docs/`, `shared/`, demo script | `ops/*` | n/a | **steward of all contracts** |

## Why this split has no merge conflicts
- Lanes 1–4 each own **one top-level directory** and touch nothing outside it.
- The shared files — `shared/schema/` and everything in `docs/` — are owned by **lane 5 only**.
  When lanes 1–4 need a contract change, they raise it with lane 5, who edits via PR; everyone
  rebases. One hand on the steering wheel for the shared seam = no contract races.

## The seams (the only inter-lane dependencies)
```
frontend ─API_CONTRACT→ backend ─generator.py→ agent ─sources.py / RETRIEVAL_CONTRACT→ ingestion
                                       ▲                                                    │
                                       └─────────── Course schema (shared/) ────────────────┘
```
Every seam has a documented contract AND a working stub on both sides, so any lane can be
developed and demoed before the lane behind it is ready.

## Working agreement
1. Branch from `main` with your prefix: `git checkout -b agent/real-claude`.
2. Touch only your lane's files. Need a contract change? Ping lane 5 → PR → rebase.
3. Small PRs into `main`. `make smoke` must pass before merge.

See `docs/WORKPLAN.md` for the day-by-day schedule and the Jira-ready stories.
