"""Dead-simple file storage: one JSON file per course under data/courses/.

Swap for a real DB later without touching routes.py — keep this interface.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import List, Optional

from .models import Course, CourseSummary

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "courses"


def _ensure_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def save(course: Course) -> None:
    _ensure_dir()
    (DATA_DIR / f"{course.id}.json").write_text(
        course.model_dump_json(indent=2), encoding="utf-8"
    )


def get(course_id: str) -> Optional[Course]:
    path = DATA_DIR / f"{course_id}.json"
    if not path.exists():
        return None
    return Course.model_validate_json(path.read_text(encoding="utf-8"))


def list_summaries() -> List[CourseSummary]:
    _ensure_dir()
    out: List[CourseSummary] = []
    for path in sorted(DATA_DIR.glob("*.json")):
        try:
            c = Course.model_validate_json(path.read_text(encoding="utf-8"))
            out.append(CourseSummary(id=c.id, title=c.title, service=c.service,
                                     persona=c.persona, status=c.status))
        except Exception:
            continue
    return out
