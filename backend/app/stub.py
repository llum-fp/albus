"""Built-in stub course generator.

Lets the backend + frontend demo run with NO agent and NO API key. The real agent
(agent/course_creator) produces the same Course shape and will replace this call.

Produces *different* content per profile so the per-profile demo works offline. Generated
courses start as 'draft' — they must be approved + published by an admin before end-users see them.
"""
from __future__ import annotations

import datetime as _dt

from .models import Course, CreateCourseRequest, Module, Citation, QuizItem


def _slug(req: CreateCourseRequest) -> str:
    svc = req.service.lower().replace(" ", "-")
    return f"{svc}-{req.profile}-{req.level}"


def _angle(profile: str) -> str:
    if profile == "sales":
        return ("commercial orientation: the value proposition, why the customer buys, "
                "objection handling, and customer use cases")
    if profile == "technical":
        return ("deep technical training: how it works, configuration, procedures, and troubleshooting")
    if profile == "csm":
        return ("processes, SLAs, escalation paths, client communication, and incident management")
    return "a broad overview"


def generate(req: CreateCourseRequest) -> Course:
    angle = _angle(req.profile)

    intro = Module(
        id="m1-overview",
        title=f"{req.service}: Overview",
        objectives=[
            f"Explain what {req.service} is for a {req.profile} audience",
            f"Frame it at a {req.level} level",
        ],
        content_markdown=(
            f"## What is {req.service}?\n\n"
            f"This {req.level}-level module frames **{req.service}** for the **{req.profile}** "
            f"profile. Emphasis: {angle}.\n\n"
            f"> _Stub content. The agent replaces this with grounded text from Confluence."
            f" Generated content is a DRAFT until an admin approves and publishes it._"
        ),
        citations=[Citation(title="Confluence: " + req.service + " (placeholder)", url="")],
        quiz=[QuizItem(
            question=f"Which profile is this {req.service} course tailored for?",
            options=["Sales", "Technical", "CSM", req.profile.upper()],
            answer_index=3,
            explanation="Each course targets one profile; this one targets " + req.profile + ".",
        )],
    )

    if req.profile == "sales":
        deep = Module(
            id="m2-value", title="Value & Objection Handling",
            objectives=["Pitch the benefit", "Handle the top 3 objections"],
            content_markdown=("## Why the customer buys\n\n- Benefit 1\n- Benefit 2\n\n"
                              "### Objections\n1. \"Too expensive\" → ...\n2. \"We already have X\" → ..."))
    elif req.profile == "technical":
        deep = Module(
            id="m2-technical", title="How it works & Troubleshooting",
            objectives=["Trace the request flow", "Diagnose a common failure"],
            content_markdown=("## Architecture\n\n```\nclient → portal → auth → internet\n```\n\n"
                              "### Common issues\n- Redirect loop → ...\n- DNS not resolving → ..."))
    else:  # csm
        deep = Module(
            id="m2-process", title="Processes, SLAs & Escalation",
            objectives=["Follow the incident process", "Apply the SLA & escalation path"],
            content_markdown=("## Incident handling\n\n1. Acknowledge within SLA\n2. Triage & categorise\n"
                              "3. Escalate per the path\n\n### Client communication\n- Status updates cadence\n- Closure summary"))

    return Course(
        id=_slug(req),
        title=f"{req.service} for {req.profile.upper()}",
        service=req.service,
        summary=f"A {req.level} {req.profile} course on {req.service}. Focus: {angle}.",
        author="admin",
        profile=req.profile,
        level=req.level,
        status="draft",
        created_at=_dt.datetime.utcnow().isoformat() + "Z",
        modules=[intro, deep],
    )
