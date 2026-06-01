# Retrieval Contract

The seam between the **Ingestion** lane (`ingestion/`) and the **Agent** lane (`agent/`).
Ingestion is the *knowledge index* (RF-1, and the basis for the AI Tutor RF-6): it returns
approved corporate-knowledge chunks **with citations**. The agent uses them to write grounded
courses and to answer tutor questions. Change only via reviewed PR.

## Interface

```
retrieve(service: str, profile: str | None = None, top_k: int = 8) -> list[Chunk]
```

CLI form (how the agent calls ingestion, mirroring how the backend calls the agent):
```bash
python ingestion/run_cli.py --service "Captive Portal" --profile technical --json
```
→ prints a JSON array of Chunk objects to stdout.

## Chunk shape
```json
{
  "text": "The Captive Portal is the branded sign-in page...",
  "source_title": "Captive Portal Overview",
  "source_url": "https://confluence.example/CP/overview",
  "service": "Captive Portal",
  "score": 0.0
}
```

## Rules
- Every chunk carries a citation (`source_title`, `source_url`). The agent MUST cite; the tutor
  MUST cite and MUST say "I don't know" when retrieval returns nothing — never invent.
- `profile` is a ranking hint (bias toward profile-relevant material); for the POC it does not
  filter. `score` is informational (0.0 in the stub).
- Only **approved** corporate knowledge belongs in the index (the spec's quality principle).
  Approval/curation of sources is an ingestion concern.

## Phase 1 (now) vs Phase 2
- **Now:** stub reads `ingestion/corpus/*.json` (hand-written sample chunks). Offline.
- **Phase 2:** a *replaceable connector* (RF-1) pulls live from Confluence via MCP (SharePoint /
  Drive / Notion later), chunks + embeds into a vector store; `retrieve()` does similarity search.
  The interface above does **not** change — only the implementation behind it.
