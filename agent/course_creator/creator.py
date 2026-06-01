"""Course creator — the agent lane's single public function: generate(request) -> Course dict.

Uses the Claude Agent SDK ("Claude Code") when available + ANTHROPIC_API_KEY is set;
otherwise falls back to the offline stub so this lane always runs.

Pure: no HTTP, no DB. Returns a dict matching shared/schema/course.schema.json.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict

from . import stub, prompts, sources

_PERSONAS_PATH = Path(__file__).resolve().parent.parent / "personas.yaml"


@dataclass
class CourseRequest:
    service: str
    audience: str = "general"
    level: str = "beginner"
    scope: str = "internal"


def _load_personas() -> Dict[str, Any]:
    try:
        import yaml  # optional dep
        return yaml.safe_load(_PERSONAS_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def generate(req: CourseRequest) -> Dict[str, Any]:
    """Generate a course. Tries Claude; degrades to stub on any problem."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        try:
            return _generate_with_claude(req)
        except Exception as e:  # noqa: BLE001
            print(f"[creator] Claude generation failed ({e}); using stub")
    return stub.generate(req.service, req.audience, req.level, req.scope)


def _generate_with_claude(req: CourseRequest) -> Dict[str, Any]:
    """Single-shot generation via the Claude Agent SDK.

    NOTE for the agent lane owner: this is the seam to grow into a real multi-step pipeline
    (curator -> syllabus -> writer -> adapter -> qa), and to attach MCP servers (Atlassian,
    Microsoft 365) so the sources are real retrieved docs instead of a placeholder.
    """
    from claude_agent_sdk import query, ClaudeAgentOptions  # type: ignore

    personas = _load_personas()
    # Pull scope-redacted source chunks from the ingestion lane (empty if unavailable).
    chunks = sources.fetch(req.service, req.scope, req.audience)
    source_text = sources.format_for_prompt(chunks)
    user_prompt = prompts.build_user_prompt(
        req.service, req.audience, req.level, req.scope, personas, sources=source_text
    )
    schema = (Path(__file__).resolve().parents[2]
              / "shared" / "schema" / "course.schema.json").read_text(encoding="utf-8")

    options = ClaudeAgentOptions(
        system_prompt=prompts.SYSTEM + "\n\nCourse JSON schema:\n" + schema,
        # Phase 2: mcp_servers=[...] for Confluence/SharePoint retrieval
    )

    chunks = []
    # claude_agent_sdk.query is async; run it to completion synchronously.
    import asyncio

    async def _run():
        async for msg in query(prompt=user_prompt, options=options):
            text = getattr(msg, "result", None) or getattr(msg, "text", None)
            if text:
                chunks.append(text)

    asyncio.run(_run())
    raw = "".join(chunks).strip()
    raw = raw[raw.find("{"): raw.rfind("}") + 1]  # tolerate stray prose
    course = json.loads(raw)
    course.setdefault("persona", {"audience": req.audience, "level": req.level, "scope": req.scope})
    course.setdefault("status", "ready")
    return course
