"""Offline course generator for the agent lane.

Mirrors the backend stub but lives here so the agent lane is fully self-contained
(run_cli.py works with zero dependencies and no API key). Produces a dict matching
shared/schema/course.schema.json. Generated courses start as 'draft'.
"""
from __future__ import annotations

import datetime as _dt
from typing import Any, Dict


def generate(service: str, profile: str, level: str) -> Dict[str, Any]:
    svc_slug = service.lower().replace(" ", "-")
    cid = f"{svc_slug}-{profile}-{level}"

    if profile == "sales":
        deep = {
            "id": "m2-value", "title": "Value & Objection Handling",
            "objectives": ["Pitch the core benefit", "Handle the top objections"],
            "content_markdown": "## Why the customer buys\n\n- Benefit\n- Benefit\n\n### Objections\n1. ...\n2. ...",
            "citations": [], "quiz": [],
        }
    elif profile == "technical":
        deep = {
            "id": "m2-technical", "title": "How it works & Troubleshooting",
            "objectives": ["Trace the flow", "Diagnose a common failure"],
            "content_markdown": "## Architecture\n\n```\nclient -> portal -> auth -> internet\n```\n\n### Issues\n- ...",
            "citations": [], "quiz": [],
        }
    else:  # csm
        deep = {
            "id": "m2-process", "title": "Processes, SLAs & Escalation",
            "objectives": ["Follow the incident process", "Apply the SLA & escalation path"],
            "content_markdown": "## Incident handling\n\n1. Acknowledge within SLA\n2. Triage\n3. Escalate",
            "citations": [], "quiz": [],
        }

    return {
        "id": cid,
        "title": f"{service} for {profile.upper()}",
        "service": service,
        "summary": f"[stub] {level} {profile} course on {service}.",
        "author": "admin",
        "profile": profile,
        "level": level,
        "status": "draft",
        "created_at": _dt.datetime.utcnow().isoformat() + "Z",
        "modules": [
            {
                "id": "m1-overview",
                "title": f"{service}: Overview",
                "objectives": [f"Understand {service} as a {profile} profile"],
                "content_markdown": f"## {service}\n\n_Stub overview for a {profile} reader._",
                "citations": [{"title": f"Confluence: {service} (placeholder)", "url": ""}],
                "quiz": [],
            },
            deep,
        ],
    }
