# Ingestion & Retrieval (`ingest/*`)

Sources the knowledge the agent writes courses from. Pure: given `(service, scope)`, returns
source chunks. Implements `docs/RETRIEVAL_CONTRACT.md`. Runs **standalone** on a hand-written
sample corpus — no DB, no credentials.

## Run standalone
```bash
python run_cli.py --service "Captive Portal" --scope external   # redacted: external chunks only
python run_cli.py --service "Captive Portal" --scope internal --json
```

## Layout
- `retriever/retriever.py` — `retrieve(service, scope, audience, top_k)`; the redaction boundary
- `retriever/connectors.py` — Phase 2 placeholders for Confluence/SharePoint via MCP
- `corpus/*.json` — hand-written sample chunks (stand-in for real docs)
- `run_cli.py` — CLI; `--json` is what the agent lane shells out to

## The contract that protects you
`scope="external"` MUST return only `visibility == "external"` chunks — internal content can
never reach an external course. That filter lives in `retrieve()`, never in the LLM.

## Your first task
Tag the corpus visibility correctly and confirm the redaction filter. Then (Phase 2) grow
`connectors.py` into real Confluence/SharePoint pulls via MCP + embed into pgvector; `retrieve()`
does similarity search. The interface in `RETRIEVAL_CONTRACT.md` does not change.

## Consumed by
The agent lane via `agent/course_creator/sources.py` (subprocess → this CLI → JSON chunks).
