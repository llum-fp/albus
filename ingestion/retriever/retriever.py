"""Document retrieval — implements docs/RETRIEVAL_CONTRACT.md.

Phase 1 (now): reads hand-written chunks from ingestion/corpus/*.json, filters by service and
scope. Offline, no deps. Phase 2: replace the corpus read with vector search over docs pulled
from Confluence/SharePoint via MCP (see connectors.py). The retrieve() signature stays fixed.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List

CORPUS_DIR = Path(__file__).resolve().parent.parent / "corpus"


@dataclass
class Chunk:
    text: str
    source_title: str
    source_url: str
    visibility: str          # "internal" | "external"
    service: str
    score: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def _load_corpus() -> List[Chunk]:
    chunks: List[Chunk] = []
    for path in sorted(CORPUS_DIR.glob("*.json")):
        for raw in json.loads(path.read_text(encoding="utf-8")):
            chunks.append(Chunk(**raw))
    return chunks


def retrieve(service: str, scope: str, audience: str = "general", top_k: int = 8) -> List[Chunk]:
    """Return source chunks for a service, redacted by scope.

    scope="external" returns ONLY visibility=="external" chunks. This is the redaction
    boundary — enforced here, never left to the LLM.
    """
    svc = service.lower()
    results = [c for c in _load_corpus() if svc in c.service.lower()]
    if scope == "external":
        results = [c for c in results if c.visibility == "external"]
    # Phase 2: rank by vector similarity to (service, audience). For now, stable order.
    return results[:top_k]
