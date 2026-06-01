# P5 · Integration / DevOps / Demo (+ contract steward)

> Read first: root `CLAUDE.md`, all of `docs/`. Branch prefix: `ops/*`. You own `Makefile`, CI,
> the server/deploy, the demo, **and** the shared contracts (`docs/`, `shared/`).

## Mission
Keep the five lanes integrating cleanly and unblock everyone. You are the **only** person who
edits the shared contracts — that single point of control is what stops merge conflicts. Own the
4-minute demo and the Jira board.

## What you own
```
Makefile           install / dev / smoke / stop  (one-command everything)
docs/*             ARCHITECTURE, API_CONTRACT, RETRIEVAL_CONTRACT, ROLES, WORKPLAN, team/*
shared/schema/*    the canonical Course shape (source of truth)
(server)           the internal VM: Postgres/pgvector, ports, deploy
(CI)               run `make smoke` on every PR
```

## Spec items that are YOURS to steward / decide
- **NFR: deploy on an internal company VM**; corporate data stays under company control. Stand up
  that VM and the run story.
- **Privacy vs hosted-model tradeoff** (see CLAUDE.md): hosted Claude for the POC, but design for a
  self-hosted model swap. Make this decision explicit to stakeholders — it's a real risk.
- **Replaceable-connector** NFR: guard that P4 keeps the source layer swappable.
- Language is **English** for UI + content — check PRs don't drift.

## Implemented vs. build-next
- ✅ `make install/dev/smoke/stop`; offline smoke across all lanes; contracts written; team briefs.
- 🔜 CI running `make smoke` on PRs; the VM deploy; (later) auth glue, an end-to-end integration test;
  demo script + the Phase-2 slide (MCP ingestion, vector store, model tiering, access control).

## Day plan
- **D1:** server up (Postgres/pgvector ready), `main` + 5 branches, CI green on `make smoke`,
  freeze the two contracts for the day, paste `WORKPLAN.md` stories into Jira.
- **D2:** continuous integration; mediate any contract change via PR + rebase; integration test.
- **D3:** freeze at midday; rehearse the demo twice; prepare the Phase-2 slide.

## Demo script (own this)
Learn (sample, as a Sales user) → Admin → generate a draft for a profile → review it →
**Approve → Publish** → switch to the matching end-user profile and watch it appear (and a
non-matching profile NOT see it) → show citations → one line on the tutor / QA roadmap.
The approval gate + per-profile visibility is the story.

## Gotchas
- Contract changes are PRs you review; never let a lane edit `shared/`/`docs/` silently.
- `make smoke` is the heartbeat — it must pass on every branch before merge.
