"""Built-in stub course generator.

Lets the backend + frontend demo run with NO agent and NO API key. The real agent
(agent/course_creator) produces the same Course shape and will replace this call.

It deliberately produces *different* content for different personas so the
"same service, two audiences" demo works end to end offline.
"""
from __future__ import annotations

import datetime as _dt

from .models import Course, CreateCourseRequest, Module, Citation, QuizItem, Persona


def _slug(req: CreateCourseRequest) -> str:
    svc = req.service.lower().replace(" ", "-")
    return f"{svc}-{req.audience}-{req.level}-{req.scope}"


def _angle(req: CreateCourseRequest) -> str:
    if req.audience == "sales":
        return ("why a customer buys it, the value proposition, typical objections and how to "
                "handle them — light on internal configuration detail")
    if req.audience == "technical":
        return ("how it works under the hood, configuration steps, common failure modes and "
                "troubleshooting — assumes hands-on responsibility")
    if req.audience == "management":
        return "business impact, cost model, rollout and risk — decision-oriented"
    return "a broad, plain-language overview"


def generate(req: CreateCourseRequest) -> Course:
    angle = _angle(req)
    leak_note = "" if req.scope == "external" else " (internal: includes confidential operational notes)"

    intro = Module(
        id="m1-overview",
        title=f"{req.service}: Overview",
        objectives=[
            f"Explain what {req.service} is to a {req.audience} audience",
            f"Describe it at a {req.level} level{leak_note}",
        ],
        content_markdown=(
            f"## What is {req.service}?\n\n"
            f"This {req.level}-level module frames **{req.service}** for a **{req.audience}** "
            f"audience ({req.scope}). Emphasis: {angle}.\n\n"
            f"> _Stub content. The agent replaces this with grounded text from Confluence/SharePoint._"
        ),
        citations=[Citation(title="Confluence: " + req.service + " (placeholder)", url="")],
        quiz=[QuizItem(
            question=f"Who is this {req.service} course tailored for?",
            options=["Sales", "Technical support", "Management", req.audience.title()],
            answer_index=3,
        )],
    )

    if req.audience == "sales":
        deep = Module(
            id="m2-value",
            title="Value & Objection Handling",
            objectives=["Pitch the benefit", "Handle the top 3 objections"],
            content_markdown=("## Why the customer buys\n\n- Benefit 1\n- Benefit 2\n\n"
                              "### Objections\n1. \"Too expensive\" → ...\n2. \"We already have X\" → ..."),
        )
    else:
        deep = Module(
            id="m2-technical",
            title="How it works & Troubleshooting",
            objectives=["Trace the request flow", "Diagnose a common failure"],
            content_markdown=("## Architecture\n\n```\nclient → portal → auth → internet\n```\n\n"
                              "### Common issues\n- Redirect loop → ...\n- DNS not resolving → ..."),
        )

    return Course(
        id=_slug(req),
        title=f"{req.service} for {req.audience.title()} ({req.scope})",
        service=req.service,
        summary=f"A {req.level} {req.audience} course on {req.service}. Focus: {angle}.",
        persona=Persona(audience=req.audience, level=req.level, scope=req.scope),
        status="ready",
        created_at=_dt.datetime.utcnow().isoformat() + "Z",
        modules=[intro, deep],
    )
