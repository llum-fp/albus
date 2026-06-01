"""Indirection between the API and 'how a course gets made'.

Default: backend's own stub (offline, no deps). Set ALBUS_USE_AGENT=1 to shell out to the
real agent CLI instead. This is the single wiring point between the backend and agent lanes —
swap the implementation here, never in routes.py.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

from .models import Course, CreateCourseRequest
from . import stub

_AGENT_CLI = Path(__file__).resolve().parents[2] / "agent" / "run_cli.py"


def generate(req: CreateCourseRequest) -> Course:
    if os.environ.get("ALBUS_USE_AGENT") == "1" and _AGENT_CLI.exists():
        try:
            return _generate_via_agent(req)
        except Exception as e:  # never let the demo fall over — degrade to stub
            print(f"[generator] agent failed ({e}); falling back to stub", file=sys.stderr)
    return stub.generate(req)


def _generate_via_agent(req: CreateCourseRequest) -> Course:
    proc = subprocess.run(
        [sys.executable, str(_AGENT_CLI),
         "--service", req.service, "--profile", req.profile,
         "--level", req.level, "--json"],
        capture_output=True, text=True, timeout=120, check=True,
    )
    return Course.model_validate_json(proc.stdout)
