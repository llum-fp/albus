# P4 · Ingestion / Knowledge index

> Read first: root `CLAUDE.md`, `docs/RETRIEVAL_CONTRACT.md` (you implement it), `docs/ROLES.md`.
> Branch prefix: `ingest/*`. You own all of `ingestion/`.

## Mission
Be the **knowledge index**: given a service, return approved corporate-knowledge chunks **with
citations**. This grounds both course generation (P3) and the AI tutor (RF-6). Runs standalone on
a hand-written sample corpus — no DB, no credentials.

## What you own
```
retriever/retriever.py   retrieve(service, profile?, top_k) -> [Chunk]  (the public interface)
retriever/connectors.py  Phase-2 placeholders: Confluence/SharePoint via MCP
corpus/*.json            hand-written sample chunks (stand-in for real docs)
run_cli.py               --service/--profile/--json (the agent shells out to --json)
```

## Spec features that are YOURS
- RF-1 connect to Confluence and let the admin **select source content**; the connector must be a
  **replaceable module** (add SharePoint/Drive/Notion later without redesign). *(structure ready)*
- The "KnowledgeIndex" entity (spec §7): approved knowledge used to answer **with citations**.
- Every chunk carries `source_title` + `source_url` — P3's grounding and the tutor's citations
  depend on it.

## Implemented vs. build-next
- ✅ `retrieve()` over a sample corpus, returns cited chunks; CLI + JSON mode; contract honoured.
- 🔜 Real **Atlassian MCP** pull from Confluence → chunk + tag → embed into a **vector store
  (pgvector)**; `retrieve()` becomes similarity search. Source **selection/approval** UI hook
  (admin picks which spaces/pages are "approved"). Then a second connector to prove replaceability.
- ⛔ Only **approved** knowledge belongs in the index. Curation/approval of sources is your concern.

## Day plan
- **D1:** curate a realistic sample corpus for Captive Portal; confirm `retrieve()` + CLI/JSON.
- **D2:** stand up pgvector on the server; wire the Atlassian MCP connector; chunk + embed a real space.
- **D3:** similarity ranking + profile bias; prove a second source type plugs in unchanged.

## Gotchas
- Keep the `retrieve(service, profile?, top_k)` signature fixed — P3 calls it via the CLI contract.
  Change behaviour behind it, not the shape (that's a PR with P5).
- Unattended ingestion needs **service-principal/API-token** auth, not interactive OAuth, so a
  nightly job can run headless (see `connectors.py` notes).
