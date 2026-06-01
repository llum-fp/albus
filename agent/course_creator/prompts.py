"""Prompt templates for the course-creator pipeline steps.

Today these feed a single Claude Agent SDK call. As the agent lane matures, split into
discrete agent calls (curator -> syllabus -> writer -> adapter -> qa). The same grounding rules
govern the AI Tutor (RF-6).
"""

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
- You produce a DRAFT only. A human admin reviews, edits and approves before anything is
  published. Never imply the content is final or published.
- Output ONLY a JSON object matching the Course schema you are given. No prose around it.
"""

USER_TEMPLATE = """Create a course draft.

Service / process: {service}
Target profile: {profile} — {profile_emphasis}
Level: {level} — {level_depth}

Source material (approved knowledge; Phase 2 injects retrieved Confluence chunks):
{sources}

Return a JSON Course object with 2-4 modules, each with objectives, content_markdown,
citations (from the sources), and a short quiz (seed of the evaluation).
"""


def build_user_prompt(service, profile, level, persona_cfg, sources="(none yet)"):
    prof = persona_cfg.get("profiles", {}).get(profile, {})
    lvl = persona_cfg.get("levels", {}).get(level, {})
    return USER_TEMPLATE.format(
        service=service, profile=profile, level=level,
        profile_emphasis=prof.get("emphasis", ""),
        level_depth=lvl.get("depth", ""),
        sources=sources,
    )
