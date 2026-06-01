"""Single loader for persona/profile configuration (personas.yaml).

`personas.yaml` is the source of truth for how a course differs per profile: the per-profile
module syllabus, objectives, content outlines and quiz seeds. Both the offline stub and the live
Claude prompt read it through here, so the contrast is identical with or without an API key.

If PyYAML is not installed (the stub must run with zero dependencies), we fall back to a small
embedded blueprint that still gives each profile a DISTINCT module structure — so the
profile-differentiation guarantee holds even in the dependency-free path.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

_PERSONAS_PATH = Path(__file__).resolve().parent.parent / "personas.yaml"

# Minimal, dependency-free fallback. Mirrors the STRUCTURE of personas.yaml (not every detail):
# distinct module skeletons per profile + one quiz each, so AG-1's "differ in module structure"
# holds even when PyYAML is unavailable. The rich version lives in personas.yaml.
_FALLBACK: Dict[str, Any] = {
    "profiles": {
        "sales": {
            "label": "Sales",
            "emphasis": "value proposition, why the customer buys, objections, use cases",
            "tone": "persuasive, benefit-led",
            "syllabus": [
                {"id": "m1-overview", "title": "{service}: Commercial Overview",
                 "objectives": ["Position {service} for the customer"],
                 "content": "## {service}\n\n_Commercial overview (fallback)._",
                 "quiz": [{"style": "multiple_choice",
                           "question": "What should a sales pitch for {service} lead with?",
                           "options": ["Architecture", "Customer value", "Config", "Code"],
                           "answer_index": 1,
                           "explanation": "Lead with customer value."}]},
                {"id": "m2-value", "title": "Value & Objection Handling",
                 "objectives": ["Articulate benefits", "Handle objections"],
                 "content": "## Why customers buy {service}\n\n- Benefit\n- Benefit",
                 "quiz": [{"style": "true_false",
                           "question": "Objections should be deflected, not addressed.",
                           "options": ["True", "False"], "answer_index": 1,
                           "explanation": "Address objections directly."}]},
            ],
        },
        "technical": {
            "label": "Technical",
            "emphasis": "how it works, architecture, configuration, troubleshooting",
            "tone": "precise, hands-on",
            "syllabus": [
                {"id": "m1-overview", "title": "{service}: Technical Overview",
                 "objectives": ["Describe {service} at a system level"],
                 "content": "## {service}\n\n_Technical overview (fallback)._",
                 "quiz": [{"style": "true_false",
                           "question": "{service} can be run without understanding its flow.",
                           "options": ["True", "False"], "answer_index": 1,
                           "explanation": "Understanding the flow is required."}]},
                {"id": "m2-architecture", "title": "Architecture & How It Works",
                 "objectives": ["Trace a request through {service}"],
                 "content": "## How {service} works\n\n```\nclient -> {service} -> result\n```",
                 "quiz": [{"style": "multiple_choice",
                           "question": "First step to diagnose a {service} failure?",
                           "options": ["Restart all", "Reproduce & isolate", "Rewrite config", "Ignore logs"],
                           "answer_index": 1, "explanation": "Reproduce and isolate first."}]},
                {"id": "m3-troubleshooting", "title": "Troubleshooting & Failure Modes",
                 "objectives": ["Diagnose common {service} failures"],
                 "content": "## Troubleshooting {service}\n\n- Symptom -> cause -> check",
                 "quiz": [{"style": "scenario",
                           "question": "Intermittent {service} failures after a config change. Best move?",
                           "options": ["Wait", "Roll back & isolate", "Change more settings", "Blame network"],
                           "answer_index": 1, "explanation": "Roll back to known-good, then isolate."}]},
            ],
        },
        "csm": {
            "label": "Customer Service Manager",
            "emphasis": "processes, SLAs, escalation, client communication, incidents",
            "tone": "process-oriented, customer-facing",
            "syllabus": [
                {"id": "m1-overview", "title": "{service}: Service Overview",
                 "objectives": ["Explain {service} in client-facing terms"],
                 "content": "## {service}\n\n_Service overview (fallback)._",
                 "quiz": [{"style": "multiple_choice",
                           "question": "Primary CSM concern with {service}?",
                           "options": ["Source code", "Processes, SLAs, communication", "Commissions", "UI colours"],
                           "answer_index": 1, "explanation": "CSMs own process, SLAs and communication."}]},
                {"id": "m2-processes", "title": "Processes & SLAs",
                 "objectives": ["Follow the process", "Apply SLA targets"],
                 "content": "## Process & SLAs for {service}\n\n1. Intake\n2. Acknowledge\n3. Resolve",
                 "quiz": [{"style": "true_false",
                           "question": "An incident can close before the SLA acknowledgement step.",
                           "options": ["True", "False"], "answer_index": 1,
                           "explanation": "Acknowledgement within SLA is mandatory first."}]},
                {"id": "m3-escalation", "title": "Escalation & Incident Management",
                 "objectives": ["Trigger the escalation path", "Communicate status"],
                 "content": "## Escalation for {service}\n\n- When to escalate\n- Status cadence",
                 "quiz": [{"style": "scenario",
                           "question": "A {service} incident is about to breach SLA. First action?",
                           "options": ["Wait", "Acknowledge & escalate", "Close ticket", "Blame client"],
                           "answer_index": 1, "explanation": "Acknowledge and escalate to protect the SLA."}]},
            ],
        },
    },
    "levels": {
        "beginner": {"depth": "foundational concepts only"},
        "intermediate": {"depth": "practical detail and examples"},
        "advanced": {"depth": "edge cases, internals, optimisation"},
    },
}


def load() -> Dict[str, Any]:
    """Return the personas config. Tries personas.yaml; falls back to the embedded blueprint."""
    try:
        import yaml  # optional dependency
        data = yaml.safe_load(_PERSONAS_PATH.read_text(encoding="utf-8"))
        if data and data.get("profiles"):
            return data
    except Exception:
        pass
    return _FALLBACK


def profile_config(personas: Dict[str, Any], profile: str) -> Dict[str, Any]:
    """Config block for one profile, falling back to sales if an unknown profile is passed."""
    profiles = personas.get("profiles", {})
    return profiles.get(profile) or profiles.get("sales", {})


def syllabus_for(personas: Dict[str, Any], profile: str) -> List[Dict[str, Any]]:
    """The per-profile list of module blueprints (the structural contrast between profiles)."""
    return profile_config(personas, profile).get("syllabus", [])


# Dependency-free fallback for the summative final assessment (used when personas.yaml lacks one).
_FALLBACK_FINAL: Dict[str, Any] = {
    "sales": [{"style": "scenario",
               "question": "A prospect compares {service} only on price. Best close?",
               "options": ["Match lowest price", "Quantify the value/outcome", "Walk away", "Discount now"],
               "answer_index": 1, "explanation": "Sell on quantified value, not price."}],
    "technical": [{"style": "scenario",
                   "question": "A {service} failure appears after a change. First step?",
                   "options": ["Change more", "Roll back and isolate", "Escalate to sales", "Ignore it"],
                   "answer_index": 1, "explanation": "Roll back to known-good, then isolate."}],
    "csm": [{"style": "scenario",
             "question": "A {service} incident will breach SLA shortly. First action?",
             "options": ["Wait", "Acknowledge and escalate", "Close ticket", "Reassign silently"],
             "answer_index": 1, "explanation": "Acknowledge and escalate to protect the SLA."}],
}


def final_assessment_for(personas: Dict[str, Any], profile: str) -> List[Dict[str, Any]]:
    """Summative (graded) final-evaluation seed for a profile. Distinct from formative checkpoints."""
    fa = personas.get("final_assessment", {})
    return fa.get(profile) or _FALLBACK_FINAL.get(profile, [])
