# Albus

An orchestrated agent platform that turns internal documentation (Confluence / SharePoint)
into **interactive training courses** — personalised per end-user profile (sales / technical / csm)
and level (beginner → advanced). An admin generates a **draft** with AI, then **reviews and
approves** it; only published courses reach employees of the matching profile.

> Demo target: pick a service (e.g. **Captive Portal**) → AI generates a *draft* for a profile →
> admin **approves & publishes** → the matching end-user sees it (others don't). The
> human-approval gate + per-profile visibility is the pitch.

## Repository layout — 5 lanes for 5 people

The repo is split so five people can work **in parallel branches without touching each other's files**.

| Dir          | Lane                          | Runs standalone? | Owner branch prefix |
|--------------|-------------------------------|------------------|---------------------|
| `frontend/`  | Admin + User portals (React)  | ✅ via mock data  | `fe/*`              |
| `backend/`   | API + storage (FastAPI)       | ✅ via stub gen   | `be/*`              |
| `agent/`     | Course-creator (Claude SDK)   | ✅ via CLI/stub   | `agent/*`           |
| `ingestion/` | Doc retrieval (Confluence/SP) | ✅ via sample corpus | `ingest/*`       |
| `Makefile`+`docs/`+`shared/` | Integration / DevOps / demo · contract steward | n/a | `ops/*` |

**The golden rule:** each lane talks to the others only through the contracts in `docs/`
(`API_CONTRACT.md`, `RETRIEVAL_CONTRACT.md`) and `shared/schema/course.schema.json`. Those
shared files are owned by the **Integration lane** and change via reviewed PR — never silently.
Inside your own dir, do whatever you want. See `docs/WORKPLAN.md` for the 5-person day-by-day plan.

## Quick start (POC — three terminals)

```bash
# 1. Backend (serves the API, has a built-in stub course generator)
cd backend && ./run.sh            # → http://localhost:8000

# 2. Frontend (admin + user portals)
cd frontend && npm install && npm run dev   # → http://localhost:5173

# 3. Agent (optional for the POC — generate a draft from the CLI)
cd agent && pip install -r requirements.txt && python run_cli.py \
    --service "Captive Portal" --profile sales --level beginner

# 4. Ingestion (approved-knowledge chunks the agent uses, with citations)
cd ingestion && python run_cli.py --service "Captive Portal"
```

Or from the repo root: `make smoke` runs an offline end-to-end check of every lane.

Open http://localhost:5173 → **Admin** to create a course, **Learn** to consume it.

See `docs/ARCHITECTURE.md` for the full picture and `docs/ROLES.md` for who owns what.
