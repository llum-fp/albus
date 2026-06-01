# Retrieval Contract

The seam between the **Ingestion** lane (`ingestion/`) and the **Agent** lane (`agent/`).
Ingestion produces source chunks; the agent consumes them to write grounded courses.
Like the API contract, change this only via reviewed PR.

## Interface

```
retrieve(service: str, scope: str, audience: str = "general", top_k: int = 8) -> list[Chunk]
```

CLI form (how the agent calls ingestion, mirroring how the backend calls the agent):
```bash
python ingestion/run_cli.py --service "Captive Portal" --scope external --json
```
→ prints a JSON array of Chunk objects to stdout.

## Chunk shape

```json
{
  "text": "The Captive Portal is the branded sign-in page guests see...",
  "source_title": "Captive Portal Overview",
  "source_url": "https://confluence.example/CP/overview",
  "visibility": "external",
  "service": "Captive Portal",
  "score": 0.0
}
```

## Rules

- **Scope is redaction, not ranking.** A request with `scope="external"` MUST return only
  chunks whose `visibility == "external"`. Internal content must never reach an external course.
  This is enforced in `retrieve()`, not left to the LLM.
- `service` match is case-insensitive substring for the POC; vector similarity in Phase 2.
- `score` is informational (0.0 in the stub). The agent treats the returned order as the ranking.
- Empty result is valid — the agent must handle "no sources found" by saying so, not inventing.

## Phase 1 (now) vs Phase 2

- **Now:** stub reads `ingestion/corpus/*.json` (hand-written sample chunks). Runs offline.
- **Phase 2:** connectors pull live from Confluence/SharePoint via MCP, chunk + embed into a
  vector store (pgvector), and `retrieve()` does similarity search. The interface above does
  **not** change — only the implementation behind it.
