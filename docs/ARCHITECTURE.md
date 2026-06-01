# Architecture

```
  SOURCES                            ALBUS PLATFORM (this repo)
  ┌──────────────┐
  │ Confluence   │── MCP ─┐  (Phase 2; today a sample corpus)
  │ +others later│        │
  └──────────────┘        ▼
                 ┌──────────────────┐        ┌─────────────────────────────┐
                 │  ingestion/      │        │  frontend/                  │
                 │  knowledge index │        │  ┌────────────┐ ┌─────────┐ │
                 │  retrieve()+cites│        │  │ Admin      │ │ User    │ │
                 └────────▲─────────┘        │  │ create +   │ │ learn   │ │
                          │ sources.py       │  │ APPROVE/   │ │ (only   │ │
                 ┌────────┴─────────┐        │  │ PUBLISH    │ │ published│ │
                 │  agent/          │        │  └─────┬──────┘ └────┬────┘ │
                 │  course_creator  │        └────────┼─────────────┼──────┘
                 │  curator→syllabus│                 │  HTTP /api  │
                 │  →writer→adapter │                 ▼             ▼
                 │  →QA  (+ tutor)  │        ┌─────────────────────────────┐
                 │  returns DRAFT   │        │  backend/  (FastAPI)        │
                 └────────▲─────────┘        │  routes ─ storage ─ stub    │
                          │ generate(req)    │  lifecycle: draft→approved  │
                          └──────────────────┤  →published (JSON files)    │
                                             └─────────────────────────────┘
                                                          │
                                                  shared/schema/course
                                                  (the canonical contract)
```

## The two load-bearing concepts
- **Profile** (`sales | technical | csm`) is the targeting + visibility axis: a published course
  is visible only to end-users of that profile.
- **Lifecycle** `draft → approved → published → archived` is the **mandatory human-approval gate**.
  The agent only ever emits a `draft`; an admin must approve + publish before any end-user sees it.

## Course generation flow (inside the agent)
A small **pipeline of specialized steps** (today: single-shot stub; tomorrow each step is a Claude
Agent SDK call against retrieved docs):

1. **Curator** — gather & rank the most relevant approved chunks for the service.
2. **Syllabus Designer** — module breakdown + objectives, shaped by `level`.
3. **Content Writer** — draft each module strictly from sources, with citations.
4. **Audience Adapter** — re-project depth/emphasis for the profile (sales → value & objections;
   technical → configs & troubleshooting; csm → processes, SLAs, escalation).
5. **QA / Fact-Checker** — every claim grounded in a source? anything unsupported?

`profile` is **config, not code** (`agent/personas.yaml`). The same retrieval + grounding powers
the **AI Tutor** (RF-6): answer only from approved knowledge, cite, or say "I don't know".

## Why standalone lanes
Each lane ships a fallback so nobody blocks anyone: frontend→`mock.ts`, backend→`stub.py`,
agent→`course_creator/stub.py`, ingestion→`corpus/*.json`. Wire the real seams (backend→agent,
agent→ingestion) once each lane works in isolation.

## Phase 2 (noted, mostly not built — see CLAUDE.md for the full list)
- Real ingestion from Confluence via **MCP** + embed into a vector store (pgvector); nightly job.
- Auth (username/password, roles+profiles); AI-guided generation dialogue; AI tutor; evaluations,
  attempts, progress, certificates, feedback, reporting dashboard.
- Deploy on an internal VM; reconsider hosted vs **self-hosted model** for data control.
- Model tiering (Haiku/Sonnet/Opus) + prompt caching of shared source chunks.
