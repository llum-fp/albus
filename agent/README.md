# Agent — course creator (`agent/*`)

The course-authoring brain. Pure function: `generate(CourseRequest) -> Course dict`.
No HTTP, no DB. Uses the **Claude Agent SDK** when `ANTHROPIC_API_KEY` is set; otherwise
falls back to an offline stub so this lane always runs.

## Run standalone
```bash
pip install -r requirements.txt   # optional; stub works without it
python run_cli.py --service "Captive Portal" --audience sales --level beginner --scope external
python run_cli.py --service "Captive Portal" --audience technical --scope internal --json
```

## Layout
- `course_creator/creator.py` — `generate()`; the Claude vs. stub decision lives here
- `course_creator/prompts.py` — system + user prompt templates
- `course_creator/stub.py` — offline generator
- `personas.yaml` — persona config (audience emphasis, level depth, scope redaction)
- `run_cli.py` — CLI; `--json` mode is what the backend shells out to

## Your first task (the demo-critical one)
Make the output for `sales/external` vs. `technical/internal` **genuinely** different —
not the same text reworded. That contrast is the whole demo.

## Growing it (Phase 2)
`_generate_with_claude()` is a single-shot call today. Grow it into the pipeline:
**curator → syllabus → writer → audience-adapter → QA**, and attach **MCP servers**
(Atlassian, Microsoft 365) so `sources` are real retrieved docs, not a placeholder.
Enforce `scope` redaction at retrieval.
