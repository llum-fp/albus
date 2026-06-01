"""Document retrieval — implements docs/RETRIEVAL_CONTRACT.md.

Phase 1 (now): reads hand-written chunks from ingestion/corpus/*.json, filters by service.
Offline, no deps. Phase 2: replace the corpus read with vector search over docs pulled from
Confluence via MCP (see connectors.py). The retrieve() signature stays fixed.

This is the "knowledge index" of the spec: approved corporate knowledge, returned WITH citations,
used both to ground course generation and to answer the AI Tutor (RF-6).
"""
from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

CORPUS_DIR = Path(__file__).resolve().parent.parent / "corpus"


@dataclass
class Chunk:
    text: str
    source_title: str
    source_url: str
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


def retrieve(service: str, profile: Optional[str] = None, top_k: int = 8) -> List[Chunk]:
    """Return approved-knowledge chunks for a service, each with a citation.

    `profile` is accepted so retrieval can later bias toward profile-relevant material; for the
    POC it does not filter (all approved chunks for the service are eligible). Phase 2 ranks by
    vector similarity to (service, profile).
    """
    svc = service.lower()
    results = [c for c in _load_corpus() if svc in c.service.lower()]
    return results[:top_k]
