# Albus

An orchestrated agent platform that turns internal documentation (Confluence / SharePoint)
into **adaptive training courses** — re-projected for the audience (sales vs. technical),
the level (beginner → advanced), and the scope (internal vs. external).

> Demo target: pick a service (e.g. **Captive Portal**) → generate a *Sales / external* course,
> then regenerate the *same source* as a *Tech-support / internal* course. Same knowledge,
> two audiences. That contrast is the pitch.

## Repository layout — 3 roles, 3 lanes

The repo is split so three people can work **in parallel branches without touching each other's files**.

| Dir          | Role                         | Runs standalone? | Owner branch prefix |
|--------------|------------------------------|------------------|---------------------|
| `frontend/`  | Admin + User portals (React) | ✅ via mock data  | `fe/*`              |
| `backend/`   | API + storage (FastAPI)      | ✅ via stub gen   | `be/*`              |
| `agent/`     | Course-creator (Claude SDK)  | ✅ via CLI/stub   | `agent/*`           |
| `shared/`    | Canonical data schema        | n/a (contract)   | change via PR only  |
| `docs/`      | Architecture + API contract  | n/a              | change via PR only  |

**The golden rule:** each lane talks to the others only through `docs/API_CONTRACT.md` and
`shared/schema/course.schema.json`. Change those via a reviewed PR, never silently. Inside your
own dir, do whatever you want.

## Quick start (POC — three terminals)

```bash
# 1. Backend (serves the API, has a built-in stub course generator)
cd backend && ./run.sh            # → http://localhost:8000

# 2. Frontend (admin + user portals)
cd frontend && npm install && npm run dev   # → http://localhost:5173

# 3. Agent (optional for the POC — generate a course from the CLI)
cd agent && pip install -r requirements.txt && python run_cli.py \
    --service "Captive Portal" --audience sales --level beginner --scope external
```

Open http://localhost:5173 → **Admin** to create a course, **Learn** to consume it.

See `docs/ARCHITECTURE.md` for the full picture and `docs/ROLES.md` for who owns what.
