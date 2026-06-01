"""Document retrieval — implements docs/RETRIEVAL_CONTRACT.md.

Phase 1 (default): reads hand-written chunks from ingestion/corpus/*.json. Offline, no deps.
Phase 2 (Confluence): set ALBUS_CONFLUENCE_SPACE=<SPACE_KEY> (or pass --confluence-space to
the CLI) to pull live pages from Confluence via connectors.pull_confluence(). The retrieve()
signature is unchanged — the switch is entirely behind this function.

This is the "knowledge index" of the spec: approved corporate knowledge, returned WITH citations,
used both to ground course generation and to answer the AI Tutor (RF-6).
"""
from __future__ import annotations

import json
import os
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

    When ALBUS_CONFLUENCE_SPACE is set, pulls live pages from that Confluence space and
    filters by service name match in the page title or body. Otherwise reads corpus/*.json.

    `profile` is accepted so retrieval can later bias toward profile-relevant material; for
    the POC it does not filter. Phase 3 will rank by vector similarity to (service, profile).
    """
    space = os.environ.get("ALBUS_CONFLUENCE_SPACE")
    if space:
        from .connectors import pull_confluence
        all_chunks = pull_confluence(space)
        svc = service.lower()
        results = [
            c for c in all_chunks
            if svc in c.source_title.lower() or svc in c.text.lower()
        ]
        for c in results:
            c.service = service
        return results[:top_k]

    # Phase 1 fallback: offline corpus
    svc = service.lower()
    results = [c for c in _load_corpus() if svc in c.service.lower()]
    return results[:top_k]
