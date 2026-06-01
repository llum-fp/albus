"""Offline course generator for the agent lane.

Builds a course from the per-profile blueprint in `personas.yaml` (via course_creator.personas),
so the offline output is GENUINELY different per profile — different module structure, objectives,
content and quiz — not the same text reworded (the demo-critical AG-1 behaviour). Runs with zero
dependencies (personas.py falls back to an embedded blueprint if PyYAML is absent).

Two assessment layers (the formative/summative design decision — see Diseno_Agentes §E):
- FORMATIVE checkpoints: the per-module `quiz` items. Low-stakes knowledge checks intercalated
  after each module's content; immediate feedback, retryable, NOT graded. Tagged kind="formative".
- SUMMATIVE final evaluation: a dedicated final module built from `final_assessment`. Graded,
  counts toward certification (RF-7). Tagged kind="summative".

Output matches shared/schema/course.schema.json. The `kind` field on quiz items is an additive,
backward-compatible extension (the schema does not set additionalProperties:false, so it validates
today); it is proposed for formalisation to the ops/contract lane — see
agent/docs/CONTRACT_PROPOSAL_assessment.md. Generated courses start as 'draft'.

Quiz styles (multiple-choice / true-false / scenario) are expressed within the existing item shape
{question, options, answer_index, explanation, kind}; the blueprint's `style` is a hint only and is
NOT written to the course.
"""
from __future__ import annotations

import datetime as _dt
from typing import Any, Dict, List

from . import personas as _personas


def _slug(service: str, profile: str, level: str) -> str:
    return f"{service.lower().replace(' ', '-')}-{profile}-{level}"


def _fmt(value: Any, service: str) -> Any:
    """Recursively substitute the {service} placeholder in strings / lists / dicts."""
    if isinstance(value, str):
        return value.replace("{service}", service)
    if isinstance(value, list):
        return [_fmt(v, service) for v in value]
    if isinstance(value, dict):
        return {k: _fmt(v, service) for k, v in value.items()}
    return value


def _build_quiz(raw_quiz: List[Dict[str, Any]], service: str, kind: str) -> List[Dict[str, Any]]:
    """Map blueprint quiz entries onto the schema shape, stamping the assessment `kind`.

    Drops the non-contract `style` hint; keeps {question, options, answer_index, explanation}
    and adds kind ∈ {formative, summative}.
    """
    items: List[Dict[str, Any]] = []
    for q in raw_quiz or []:
        item = {
            "question": _fmt(q.get("question", ""), service),
            "options": _fmt(list(q.get("options", [])), service),
            "answer_index": int(q.get("answer_index", 0)),
            "kind": kind,
        }
        if q.get("explanation"):
            item["explanation"] = _fmt(q["explanation"], service)
        items.append(item)
    return items


def generate(service: str, profile: str, level: str) -> Dict[str, Any]:
    personas = _personas.load()
    cfg = _personas.profile_config(personas, profile)
    syllabus = _personas.syllabus_for(personas, profile)

    modules: List[Dict[str, Any]] = []
    # Content modules, each with FORMATIVE checkpoints.
    for entry in syllabus:
        modules.append({
            "id": entry.get("id", f"m{len(modules)+1}"),
            "title": _fmt(entry.get("title", ""), service),
            "objectives": _fmt(list(entry.get("objectives", [])), service),
            "content_markdown": _fmt(entry.get("content", ""), service).rstrip(),
            "citations": [{"title": f"Confluence: {service} (placeholder)", "url": ""}],
            "quiz": _build_quiz(entry.get("quiz", []), service, kind="formative"),
        })

    # Dedicated final module with the SUMMATIVE evaluation (graded, toward certification).
    summative = _build_quiz(_personas.final_assessment_for(personas, profile), service, kind="summative")
    if summative:
        modules.append({
            "id": "m-final-assessment",
            "title": "Final Assessment",
            "objectives": [f"Demonstrate mastery of {service} for this profile"],
            "content_markdown": (
                "## Final assessment\n\n"
                "Complete this graded assessment to finish the course. Unlike the knowledge checks "
                "in each module, this one is **scored** and counts toward certification.\n\n"
                "_Generated content is a DRAFT until an admin approves and publishes it._"
            ),
            "citations": [],
            "quiz": summative,
        })

    emphasis = (cfg.get("emphasis") or "").strip()
    label = cfg.get("label", profile.upper())
    summary = (f"[stub] A {level} course on {service} for the {label} profile"
               + (f". Focus: {emphasis}" if emphasis else "."))

    return {
        "id": _slug(service, profile, level),
        "title": f"{service} for {label}",
        "service": service,
        "summary": summary,
        "author": "admin",
        "profile": profile,
        "level": level,
        "status": "draft",   # AI never auto-publishes — a human admin approves + publishes
        "created_at": _dt.datetime.utcnow().isoformat() + "Z",
        "modules": modules,
    }
