"""Offline course generator for the agent lane.

Mirrors the backend stub but lives here so the agent lane is fully self-contained
(run_cli.py works with zero dependencies and no API key). Produces a dict matching
shared/schema/course.schema.json.
"""
from __future__ import annotations

import datetime as _dt
from typing import Any, Dict


def generate(service: str, audience: str, level: str, scope: str) -> Dict[str, Any]:
    svc_slug = service.lower().replace(" ", "-")
    cid = f"{svc_slug}-{audience}-{level}-{scope}"

    if audience == "sales":
        deep = {
            "id": "m2-value",
            "title": "Value & Objection Handling",
            "objectives": ["Pitch the core benefit", "Handle the top objections"],
            "content_markdown": "## Why the customer buys\n\n- Benefit\n- Benefit\n\n### Objections\n1. ...\n2. ...",
            "citations": [], "quiz": [],
        }
    else:
        deep = {
            "id": "m2-technical",
            "title": "How it works & Troubleshooting",
            "objectives": ["Trace the flow", "Diagnose a common failure"],
            "content_markdown": "## Architecture\n\n```\nclient -> portal -> auth -> internet\n```\n\n### Issues\n- ...",
            "citations": [], "quiz": [],
        }

    return {
        "id": cid,
        "title": f"{service} for {audience.title()} ({scope})",
        "service": service,
        "summary": f"[stub] {level} {audience} course on {service} ({scope}).",
        "persona": {"audience": audience, "level": level, "scope": scope},
        "status": "ready",
        "created_at": _dt.datetime.utcnow().isoformat() + "Z",
        "modules": [
            {
                "id": "m1-overview",
                "title": f"{service}: Overview",
                "objectives": [f"Understand {service} as a {audience}"],
                "content_markdown": f"## {service}\n\n_Stub overview for a {audience} reader._",
                "citations": [{"title": f"Confluence: {service} (placeholder)", "url": ""}],
                "quiz": [],
            },
            deep,
        ],
    }
