"""Offline course generator for the agent lane.

Builds a course from the per-profile blueprint in `personas.yaml` (via course_creator.personas),
so the offline output is GENUINELY different per profile — different module structure, objectives,
content and quiz — not the same text reworded. This is the demo-critical AG-1 behaviour, and it
runs with zero dependencies (personas.py falls back to an embedded blueprint if PyYAML is absent).

Produces a dict matching shared/schema/course.schema.json. Generated courses start as 'draft' —
the AI never auto-publishes; an admin must approve + publish before any end-user sees it.

Quiz note: the shared schema's quiz item is {question, options, answer_index, explanation}. There
is no "type" field, so question *styles* (multiple-choice / true-false / scenario) are expressed
within that shape (true-false uses options ["True","False"]; scenario uses a situational stem).
The blueprint's `style` is kept only as a hint and is NOT written into the course (it is not in
the contract).
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


def _build_quiz(raw_quiz: List[Dict[str, Any]], service: str) -> List[Dict[str, Any]]:
    """Map blueprint quiz entries onto the schema shape, dropping the non-contract `style` hint."""
    items: List[Dict[str, Any]] = []
    for q in raw_quiz or []:
        item = {
            "question": _fmt(q.get("question", ""), service),
            "options": _fmt(list(q.get("options", [])), service),
            "answer_index": int(q.get("answer_index", 0)),
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
    for entry in syllabus:
        modules.append({
            "id": entry.get("id", f"m{len(modules)+1}"),
            "title": _fmt(entry.get("title", ""), service),
            "objectives": _fmt(list(entry.get("objectives", [])), service),
            "content_markdown": _fmt(entry.get("content", ""), service).rstrip(),
            # Generic placeholder citation; real citations come from ingestion (sources.py) under Claude.
            "citations": [{"title": f"Confluence: {service} (placeholder)", "url": ""}],
            "quiz": _build_quiz(entry.get("quiz", []), service),
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
