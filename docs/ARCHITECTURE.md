# Architecture

```
  SOURCES (Phase 2)                 ALBUS PLATFORM (this repo)
  ┌──────────────┐
  │ Confluence   │── MCP ─┐
  │ SharePoint   │── MCP ─┤
  └──────────────┘        │
                          ▼
                 ┌──────────────────┐        ┌─────────────────────────────┐
                 │  agent/          │        │  frontend/                  │
                 │  course_creator  │        │  ┌────────────┐ ┌─────────┐ │
                 │  ┌────────────┐  │        │  │ Admin      │ │ User    │ │
                 │  │ curator    │  │        │  │ portal     │ │ portal  │ │
                 │  │ syllabus   │  │        │  │ (create)   │ │ (learn) │ │
                 │  │ writer     │  │        │  └─────┬──────┘ └────┬────┘ │
                 │  │ adapter    │  │        └────────┼─────────────┼──────┘
                 │  │ qa         │  │                 │  HTTP /api  │
                 │  └────────────┘  │                 ▼             ▼
                 │  returns Course  │        ┌─────────────────────────────┐
                 └────────▲─────────┘        │  backend/  (FastAPI)        │
                          │ generate(req)    │  routes ─ storage ─ stub    │
                          └──────────────────┤  (SQLite-less: JSON files)  │
                                             └─────────────────────────────┘
                                                          │
                                                  shared/schema/course
                                                  (the canonical contract)
```

## Course generation flow (inside the agent)

The course creator is a small **pipeline of specialized steps** (today: stubbed; tomorrow:
each step is a Claude Agent SDK call against retrieved docs):

1. **Curator** — gather & rank the most relevant source chunks for the service.
2. **Syllabus Designer** — module breakdown + learning objectives, shaped by `level`.
3. **Content Writer** — draft each module strictly from sources, with citations.
4. **Audience Adapter** — re-project tone/depth for the persona (sales → value & objections;
   technical → configs & troubleshooting).
5. **QA / Fact-Checker** — every claim grounded? internal content leaked into an external course?

`persona` is **config, not code** (see `agent/personas.yaml`) — adding "Finance wants billing"
later is a new config row, not new code.

## Why three standalone dirs
Each lane ships a fallback so nobody blocks anyone:
- frontend → `mock.ts`
- backend  → `stub.py`
- agent    → `course_creator/stub.py`

Wire the real seams (backend→agent, sources→agent) once each lane works in isolation.

## Phase 2 (post-hackathon, noted not built)
- Real ingestion from Confluence/SharePoint via **MCP** + nightly job (Temporal for durability).
- Model tiering (Haiku/Sonnet/Opus) + prompt caching of shared source chunks.
- Internal/external **access control** enforced at retrieval, not just tone.
- SCORM export to the LMS.
