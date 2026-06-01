# Roles & branch strategy

Three lanes, three owners, zero file overlap.

## Lane 1 — Frontend (`frontend/`)  · branches `fe/*`
Owns the Admin portal (course creation form) and User portal (course consumption).
Codes against `docs/API_CONTRACT.md`. Works standalone via `src/mock.ts` — no backend needed.
First task: make the **"regenerate as a different persona"** action a first-class button (the demo money shot).

## Lane 2 — Backend (`backend/`)  · branches `be/*`
Owns the public API + storage. Implements `API_CONTRACT.md`. Ships a built-in `stub.py`
generator so the frontend demo runs with no agent. First task: list/get/create endpoints + persist courses.

## Lane 3 — Agent (`agent/`)  · branches `agent/*`
Owns the course creator (Claude Agent SDK). Pure function: `generate(request) -> Course`.
Works standalone via `run_cli.py`. First task: make the Audience Adapter produce *genuinely*
different output for `sales/external` vs `technical/internal` (not just reworded).

## Working without conflicts
1. Branch from `main` with your prefix: `git checkout -b fe/admin-form`.
2. Touch only files inside **your** dir.
3. Changing `shared/` or `docs/` (the contracts)? Open a PR, get one review, merge first,
   then everyone rebases. This is the only file that all lanes share — guard it.
4. Open small PRs into `main`. CI (Phase 2) runs each lane's tests independently.

## Definition of "POC done"
Open the frontend → create a Captive Portal course as *Sales/external* → see it render in the
User portal → click regenerate as *Technical/internal* → see a meaningfully different course.
