"""The agent↔ingestion seam — implements the consumer side of docs/RETRIEVAL_CONTRACT.md.

Calls the ingestion lane's CLI to fetch source chunks (scope-redacted), and formats them for
the prompt. If ingestion isn't available, returns an empty list and the agent proceeds with no
sources (and must say so rather than invent). This is the single wiring point to ingestion —
mirror of how the backend calls the agent.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List

_INGEST_CLI = Path(__file__).resolve().parents[2] / "ingestion" / "run_cli.py"


def fetch(service: str, scope: str, audience: str = "general", top_k: int = 8) -> List[Dict[str, Any]]:
    if not _INGEST_CLI.exists():
        return []
    try:
        proc = subprocess.run(
            [sys.executable, str(_INGEST_CLI),
             "--service", service, "--scope", scope, "--audience", audience,
             "--top-k", str(top_k), "--json"],
            capture_output=True, text=True, timeout=60, check=True,
        )
        return json.loads(proc.stdout)
    except Exception as e:  # noqa: BLE001
        print(f"[sources] retrieval failed ({e}); proceeding with no sources", file=sys.stderr)
        return []


def format_for_prompt(chunks: List[Dict[str, Any]]) -> str:
    if not chunks:
        return "(no sources retrieved — do not invent facts; state what is unknown)"
    lines = []
    for i, c in enumerate(chunks, 1):
        lines.append(f"[{i}] {c['source_title']} ({c.get('source_url','')})\n{c['text']}")
    return "\n\n".join(lines)
