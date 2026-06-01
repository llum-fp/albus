"""Course creator — the agent lane's single public function: generate(request) -> Course dict.

Uses the Claude Agent SDK ("Claude Code") when available + ANTHROPIC_API_KEY is set;
otherwise falls back to the offline stub so this lane always runs.

Pure: no HTTP, no DB. Returns a dict matching shared/schema/course.schema.json (status 'draft').

NOTE (target, not built): the spec calls for an AI-guided *dialogue* with the admin to define
the course (profile, depth, objectives, structure, evaluation) before generating. Today this is
a single-shot generate(). See CLAUDE.md.
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
    profile: str = "sales"   # sales | technical | csm
    level: str = "beginner"


def _load_personas() -> Dict[str, Any]:
    try:
        import yaml  # optional dep
        return yaml.safe_load(_PERSONAS_PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def generate(req: CourseRequest) -> Dict[str, Any]:
    """Generate a course draft. Tries Claude; degrades to stub on any problem."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        try:
            return _generate_with_claude(req)
        except Exception as e:  # noqa: BLE001
            print(f"[creator] Claude generation failed ({e}); using stub")
    return stub.generate(req.service, req.profile, req.level)


def _generate_with_claude(req: CourseRequest) -> Dict[str, Any]:
    """Single-shot generation via the Claude Agent SDK.

    Growth path (agent lane owner): the pipeline curator → syllabus → writer → adapter → QA,
    plus the MCP-backed retrieval already exposed via sources.fetch(). Also the AI Tutor (RF-6)
    lives in this lane — grounded Q&A over the same retrieved chunks, with citations.
    """
    from claude_agent_sdk import query, ClaudeAgentOptions  # type: ignore

    personas = _load_personas()
    chunks = sources.fetch(req.service, req.profile)        # approved knowledge (cited)
    source_text = sources.format_for_prompt(chunks)
    user_prompt = prompts.build_user_prompt(
        req.service, req.profile, req.level, personas, sources=source_text
    )
    schema = (Path(__file__).resolve().parents[2]
              / "shared" / "schema" / "course.schema.json").read_text(encoding="utf-8")

    options = ClaudeAgentOptions(
        system_prompt=prompts.SYSTEM + "\n\nCourse JSON schema:\n" + schema,
        # Phase 2: mcp_servers=[...] for Confluence retrieval
    )

    out_chunks = []
    import asyncio

    async def _run():
        async for msg in query(prompt=user_prompt, options=options):
            text = getattr(msg, "result", None) or getattr(msg, "text", None)
            if text:
                out_chunks.append(text)

    asyncio.run(_run())
    raw = "".join(out_chunks).strip()
    raw = raw[raw.find("{"): raw.rfind("}") + 1]  # tolerate stray prose
    course = json.loads(raw)
    course.setdefault("profile", req.profile)
    course.setdefault("level", req.level)
    course["status"] = "draft"   # AI never auto-publishes — human approves
    return course
