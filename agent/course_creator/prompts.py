"""Prompt templates for the course-creator pipeline.

Today these feed a single Claude Agent SDK call. As the agent lane matures, split into discrete
agent calls (curator -> syllabus -> writer -> adapter -> qa). The same grounding rules govern the
AI Tutor (RF-6).

The per-profile module blueprint comes from personas.yaml (the SAME source the offline stub uses),
so Claude is steered to produce the same profile-differentiated structure — the contrast is defined
in one place, not duplicated between stub and prompt.
"""
from __future__ import annotations

from typing import Any, Dict

from . import personas as _personas

SYSTEM = """You are Albus, a course-authoring agent for an enterprise.
You turn approved internal documentation into a single, well-structured training course.

Rules:
- ALL output is in English.
- Ground every factual claim in the provided sources. If you lack a source, say so plainly
  rather than inventing detail.
- Cite the source for each section (use the provided source titles/URLs).
- The course targets ONE end-user profile (sales, technical, or csm) — adapt depth and emphasis:
  sales -> value proposition, objections, use cases; technical -> how it works, config,
  troubleshooting; csm -> processes, SLAs, escalation, client communication, incidents.
- Follow the per-profile module outline you are given: the profiles are intentionally different
  in structure, not just wording. Keep the given module ids and titles.
- Each module includes a short quiz (seed of the evaluation). Vary the question style across
  modules (a multiple-choice question, a true/false stated as options ["True","False"], and a
  situational scenario) — but every quiz item MUST use the schema shape
  {question, options, answer_index, explanation}. There is no separate "type" field.
- You produce a DRAFT only. A human admin reviews, edits and approves before anything is
  published. Never imply the content is final or published.
- Output ONLY a JSON object matching the Course schema you are given. No prose around it.
"""

USER_TEMPLATE = """Create a course draft.

Service / process: {service}
Target profile: {profile} — {profile_emphasis}
Tone: {profile_tone}
Level: {level} — {level_depth}

Module outline for this profile (follow it; keep ids + titles):
{outline}

Source material (approved knowledge; Phase 2 injects retrieved Confluence chunks):
{sources}

Return a JSON Course object whose `modules` match the outline above. Each module needs
objectives, content_markdown grounded in the sources (cite them), citations, and a short quiz.
"""


def _render_outline(personas: Dict[str, Any], profile: str, service: str) -> str:
    syllabus = _personas.syllabus_for(personas, profile)
    if not syllabus:
        return "(no outline — use 2-4 sensible modules for this profile)"
    lines = []
    for i, m in enumerate(syllabus, 1):
        title = m.get("title", "").replace("{service}", service)
        objs = "; ".join(o.replace("{service}", service) for o in m.get("objectives", []))
        styles = ", ".join(q.get("style", "multiple_choice") for q in m.get("quiz", [])) or "multiple_choice"
        lines.append(f"  {i}. id={m.get('id')} | {title}\n     objectives: {objs}\n     quiz style: {styles}")
    return "\n".join(lines)


def build_user_prompt(service, profile, level, persona_cfg, sources="(none yet)"):
    prof = persona_cfg.get("profiles", {}).get(profile, {})
    lvl = persona_cfg.get("levels", {}).get(level, {})
    return USER_TEMPLATE.format(
        service=service, profile=profile, level=level,
        profile_emphasis=(prof.get("emphasis", "") or "").strip(),
        profile_tone=prof.get("tone", ""),
        level_depth=lvl.get("depth", ""),
        outline=_render_outline(persona_cfg, profile, service),
        sources=sources,
    )
