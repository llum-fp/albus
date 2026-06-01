"""Prompt templates for the course-creator pipeline steps.

Today these feed a single Claude Agent SDK call. As the agent lane matures, split into
discrete agent calls (curator -> syllabus -> writer -> adapter -> qa).
"""

SYSTEM = """You are Albus, a course-authoring agent for an enterprise.
You turn internal product/service documentation into a single, well-structured training course.

Rules:
- Ground every factual claim in the provided sources. If you lack a source, say so plainly
  rather than inventing detail.
- Respect SCOPE: an 'external' course must never reveal internal-only/confidential content.
- Adapt to the persona (audience, level, scope) — sales gets value & objections, technical
  gets configuration & troubleshooting.
- Output ONLY a JSON object matching the Course schema you are given. No prose around it.
"""

USER_TEMPLATE = """Create a course.

Service: {service}
Audience: {audience} — {audience_emphasis}
Level: {level} — {level_depth}
Scope: {scope} — {scope_note}

Source material (Phase 1 placeholder — Phase 2 injects retrieved Confluence/SharePoint chunks):
{sources}

Return a JSON Course object with 2-4 modules, each with objectives, content_markdown,
citations (from the sources), and a short quiz.
"""


def build_user_prompt(service, audience, level, scope, persona_cfg, sources="(none yet)"):
    aud = persona_cfg.get("audiences", {}).get(audience, {})
    lvl = persona_cfg.get("levels", {}).get(level, {})
    scp = persona_cfg.get("scopes", {}).get(scope, {})
    return USER_TEMPLATE.format(
        service=service, audience=audience, level=level, scope=scope,
        audience_emphasis=aud.get("emphasis", ""),
        level_depth=lvl.get("depth", ""),
        scope_note=scp.get("note", ""),
        sources=sources,
    )
