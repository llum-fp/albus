# Work plan — 5 people, 3 days

Maps the 5 lanes (see `ROLES.md`) onto a 3-day hackathon. The guiding principle: **everyone
starts on Day 1 against stubs/contracts, nobody waits.** Integration happens continuously, not
at the end.

## Who does what

| Person | Lane | One-line mission |
|--------|------|------------------|
| **P1** | Frontend | Admin create-form + Learn reader; make the **↻ regenerate-as-different-persona** flow shine (the demo money shot). |
| **P2** | Backend/Platform | Own the API + storage; make generation async (status polling); keep the `generator.py` seam to the agent solid. |
| **P3** | Agent/Course creator | Make `sales/external` vs `technical/internal` output **genuinely** different; wire live Claude; grow toward the curator→…→QA pipeline. |
| **P4** | Ingestion/Retrieval | Real source chunks with correct visibility tagging + scope redaction; Phase 2: Confluence/SharePoint via MCP → pgvector. |
| **P5** | Integration/DevOps/Demo | Server + `make` targets + CI; **steward the contracts** (`shared/`, `docs/`); own the final 4-min demo + Jira. |

## Day-by-day

### Day 1 — Foundations against stubs (goal: each lane runs alone by EOD)
- **All:** clone, `make install`, `make smoke` passes. Read your lane README + the contracts you touch.
- **P5:** stand up the shared server (Postgres/pgvector ready for Phase 2), confirm `main` + 5 branches, set up CI that runs `make smoke`, freeze the two contracts for Day 1. Create the Jira epics/stories below.
- **P1:** Admin form + Learn catalogue + CourseView rendering from `mock.ts` (no backend needed).
- **P2:** confirm all `API_CONTRACT.md` endpoints; add a course-list/delete; keep stub generation working.
- **P3:** rewrite the stub so the two target personas differ in *structure*, not just words; draft the 5-step prompt set in `prompts.py`.
- **P4:** flesh out `corpus/*.json` with real-ish Captive Portal content, correctly tagged internal/external; prove `retrieve()` redacts on `scope=external`.
- **EOD checkpoint:** `make smoke` green; frontend renders a course from mock; agent CLI shows two different courses; ingestion redacts.

### Day 2 — Real integration (goal: live data flows end-to-end)
- **P3 + P4:** wire `sources.py` → ingestion for real (already stubbed); P3 turns on live Claude (`ANTHROPIC_API_KEY`) and fixes `_generate_with_claude()`. Courses now come from retrieved chunks.
- **P2 + P3:** flip `ALBUS_USE_AGENT=1`; backend now generates via the real agent, fallback intact. P2 makes POST async + adds `GET /status` polling.
- **P1 + P2:** frontend shows a "generating…" state and polls status; regenerate button hits the real pipeline.
- **P5:** integration test across all lanes; tighten CORS/ports; keep contracts stable (any change = PR).
- **EOD checkpoint:** create *Captive Portal · Sales · external* from the UI → real grounded content; regenerate as *Technical · internal* → visibly different, internal sources included.

### Day 3 — Polish, guardrails, demo (goal: rehearsed 4-min story)
- **P3:** QA/fact-check step — flag ungrounded claims; verify external course contains no internal text.
- **P4:** prove the redaction guarantee with a test (internal chunk must never appear in an external course).
- **P1:** citations visible in the reader; loading/empty/error states; light styling pass.
- **P2:** export endpoint (Markdown/PDF) if time; persist run metadata.
- **P5:** freeze at midday; rehearse the demo twice; prepare the "Phase 2" slide (MCP ingestion, Temporal, model tiering, access control).
- **Demo script:** Learn (sample) → Admin → generate *Sales/external* → open it, show citations → **↻ regenerate as Technical/internal** → show the different modules + internal sources now present → one line on QA catching an ungrounded claim. Done.

## Continuous integration checkpoints
`make smoke` is the contract-level heartbeat — it must pass on every branch before merge. Lane 5
runs it in CI. End of each day, do a 15-min all-hands merge to `main` and rebase branches.

## Jira — epics & starter stories
One epic per lane. Acceptance criterion in *italics*.

**EPIC FE — Frontend portals** (`fe/*`)
- FE-1 Admin create-course form posts to API. *Submitting navigates to the new course.*
- FE-2 Learn catalogue lists courses with persona tags. *Tags show audience/level/scope.*
- FE-3 CourseView renders modules + objectives + citations. *Markdown headings/lists render.*
- FE-4 Regenerate-as-different-persona button. *One click swaps sales/external ↔ technical/internal.*
- FE-5 Generating/loading + error states. *UI never blank-screens when API is slow/down.*

**EPIC BE — Backend platform** (`be/*`)
- BE-1 Implement all API_CONTRACT endpoints. *`make smoke` + manual curl pass.*
- BE-2 Async generation + `GET /courses/{id}/status`. *POST returns `generating`, status flips to `ready`.*
- BE-3 Real agent via `ALBUS_USE_AGENT=1` with stub fallback. *Agent failure degrades, never 500s.*
- BE-4 Persist + list + delete courses. *Survives restart.*

**EPIC AG — Agent / course creator** (`agent/*`)
- AG-1 Persona-differentiated stub output. *Sales vs technical differ in module structure.*
- AG-2 Live Claude generation. *With key set, content is grounded in retrieved chunks + cited.*
- AG-3 Consume retrieval via `sources.py`. *No-sources case states unknowns, doesn't invent.*
- AG-4 QA/fact-check step. *Flags claims with no supporting chunk.*
- AG-5 (stretch) Split into curator→syllabus→writer→adapter→QA. *Each step is its own call.*

**EPIC IN — Ingestion / retrieval** (`ingest/*`)
- IN-1 Curated sample corpus, correctly visibility-tagged. *Each chunk internal|external.*
- IN-2 Scope redaction in `retrieve()`. *`scope=external` returns zero internal chunks (test).*
- IN-3 (Phase 2) Confluence pull via Atlassian MCP. *Pages chunked + tagged from space labels.*
- IN-4 (Phase 2) Embed + vector search (pgvector). *`retrieve()` ranks by similarity.*

**EPIC OPS — Integration / DevOps / demo** (`ops/*`)
- OPS-1 `make install/dev/smoke/stop` work on the server. *Fresh clone → running in one command.*
- OPS-2 CI runs `make smoke` on every PR. *Red blocks merge.*
- OPS-3 Steward contracts; review all `shared/`+`docs/` PRs. *No silent contract drift.*
- OPS-4 Demo script + Phase-2 slide + rehearsal. *4-minute run lands without a hitch.*
