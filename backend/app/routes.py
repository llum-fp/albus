"""API routes — implements docs/API_CONTRACT.md."""
from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from . import generator, storage
from .models import Course, CourseSummary, CreateCourseRequest, Profile, Status

router = APIRouter(prefix="/api")

# Profile catalogue for the Admin form. agent/personas.yaml is the richer source the agent uses.
PROFILES = [
    {"value": "sales", "label": "Sales", "hint": "value proposition, objections, use cases"},
    {"value": "technical", "label": "Technical", "hint": "how it works, config, troubleshooting"},
    {"value": "csm", "label": "Customer Service Manager", "hint": "processes, SLAs, escalation"},
]
LEVELS = ["beginner", "intermediate", "advanced"]


@router.get("/profiles")
def get_profiles():
    return {"profiles": PROFILES, "levels": LEVELS}


@router.get("/courses", response_model=List[CourseSummary])
def list_courses(
    status: Optional[Status] = Query(None, description="filter by lifecycle status"),
    profile: Optional[Profile] = Query(None, description="filter by target profile"),
):
    """List course summaries.

    End-users call with status=published&profile=<their profile> to see only what they may.
    Admins call with no filter to see everything (drafts included).
    """
    items = storage.list_summaries()
    if status is not None:
        items = [c for c in items if c.status == status]
    if profile is not None:
        items = [c for c in items if c.profile == profile]
    return items


@router.get("/courses/{course_id}", response_model=Course)
def get_course(course_id: str):
    course = storage.get(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/courses/{course_id}/status")
def get_status(course_id: str):
    course = storage.get(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"id": course.id, "status": course.status}


@router.post("/courses", response_model=Course)
def create_course(req: CreateCourseRequest):
    # POC: synchronous generation. Phase 2: AI-guided dialogue + async generation.
    # Always created as DRAFT — never auto-published (the human-approval principle).
    course = generator.generate(req)
    course.status = "draft"
    storage.save(course)
    return course


def _transition(course_id: str, new_status: Status) -> Course:
    course = storage.get(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    course.status = new_status
    storage.save(course)
    return course


@router.post("/courses/{course_id}/approve", response_model=Course)
def approve_course(course_id: str):
    """Admin approval: draft → approved. (Quality gate before publishing.)"""
    return _transition(course_id, "approved")


@router.post("/courses/{course_id}/publish", response_model=Course)
def publish_course(course_id: str):
    """Admin publish: → published. Now visible to end-users of the target profile."""
    return _transition(course_id, "published")


@router.post("/courses/{course_id}/archive", response_model=Course)
def archive_course(course_id: str):
    return _transition(course_id, "archived")
