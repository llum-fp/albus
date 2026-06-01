# P3 · Agent / Course creator (+ AI Tutor)

> Read first: root `CLAUDE.md`, `docs/RETRIEVAL_CONTRACT.md` (your input), `shared/schema/
> course.schema.json` (your output), `docs/ROLES.md`. Branch prefix: `agent/*`. You own
> `agent/course_creator/`, `agent/personas.yaml`, `agent/run_cli.py`.

## Mission
The intelligence. Turn approved knowledge into a grounded course **draft** for a given profile,
and (next) power the **AI tutor**. Pure functions — no HTTP, no DB. Uses the **Claude Agent SDK**
when `ANTHROPIC_API_KEY` is set, else the offline stub.

## What you own
```
course_creator/creator.py   generate(CourseRequest)->Course draft; Claude-vs-stub decision here
course_creator/prompts.py   system + user prompt templates (grounding, cite, profile, English)
course_creator/sources.py   the seam to ingestion (cited chunks); also the tutor's grounding
course_creator/stub.py      offline generator
personas.yaml               the 3 profiles as config (sales/technical/csm)
run_cli.py                  --profile/--level/--json (backend shells out to --json)
```

## Spec features that are YOURS
- RF-2 AI generation. **(stub built; live Claude path written, untested)**
- The single most demo-critical thing: make `sales` vs `technical` vs `csm` output **genuinely**
  different (structure, not reworded). Profiles drive it.
- RF-6 **AI Tutor**: grounded Q&A over the same `sources.fetch()` chunks; **cite** sources;
  say **"I don't know"** when retrieval is empty. *(not built — your big Phase-2 piece)*
- Growth path: split the single call into **curator → syllabus → writer → audience-adapter → QA**.

## Implemented vs. build-next
- ✅ Stub drafts per profile; `sources.py` pulls cited chunks; prompts enforce grounding + English;
  output is always `draft` (AI never publishes).
- 🔜 Install `claude-agent-sdk`, set the key, run + fix `_generate_with_claude()`; build the tutor;
  add a QA/fact-check step (flag any claim with no supporting chunk); typed evaluation questions.
- ⛔ Never invent facts when sources are empty — that rule is the product's credibility.

## Day plan
- **D1:** stub differentiates the 3 profiles structurally; draft the 5-step prompts.
- **D2:** live Claude generation grounded in retrieved chunks + citations; wire end-to-end via backend.
- **D3:** QA step + tutor MVP (answer-with-citations / "I don't know"); evaluation question generation.

## Gotchas
- You consume ingestion only through `sources.py` (subprocess CLI). Don't import the ingestion lane.
- Keep `generate()` returning a dict matching `course.schema.json`; backend/frontend depend on it.
