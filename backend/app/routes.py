"""API routes — implements docs/API_CONTRACT.md."""
from __future__ import annotations

from typing import List
from fastapi import APIRouter, HTTPException

from . import generator, storage
from .models import Course, CourseSummary, CreateCourseRequest

router = APIRouter(prefix="/api")

# Persona catalogue for the Admin form (kept here for the POC; agent/personas.yaml is the
# richer source of truth the agent uses).
PERSONAS = {
    "audience": [
        {"value": "sales", "label": "Sales / Marketing", "hint": "benefits, why-buy, objections"},
        {"value": "technical", "label": "Technical / Support", "hint": "configs, troubleshooting"},
        {"value": "management", "label": "Management", "hint": "business impact, cost, risk"},
        {"value": "general", "label": "General", "hint": "broad overview"},
    ],
    "level": ["beginner", "intermediate", "advanced"],
    "scope": [
        {"value": "internal", "label": "Internal", "hint": "may include confidential detail"},
        {"value": "external", "label": "External", "hint": "safe to share with customers"},
    ],
}


@router.get("/personas")
def get_personas():
    return PERSONAS


@router.get("/courses", response_model=List[CourseSummary])
def list_courses():
    return storage.list_summaries()


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
    # POC: synchronous generation. Phase 2: enqueue + return status=generating.
    course = generator.generate(req)
    storage.save(course)
    return course
