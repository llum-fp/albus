"""Pydantic models — the canonical Course shape (mirrors shared/schema/course.schema.json)."""
from __future__ import annotations

from typing import List, Literal, Optional
from pydantic import BaseModel, Field

Audience = Literal["sales", "technical", "management", "general"]
Level = Literal["beginner", "intermediate", "advanced"]
Scope = Literal["internal", "external"]
Status = Literal["pending", "generating", "ready", "failed"]


class Persona(BaseModel):
    audience: Audience
    level: Level
    scope: Scope


class Citation(BaseModel):
    title: str
    url: str = ""


class QuizItem(BaseModel):
    question: str
    options: List[str]
    answer_index: int


class Module(BaseModel):
    id: str
    title: str
    objectives: List[str] = Field(default_factory=list)
    content_markdown: str
    citations: List[Citation] = Field(default_factory=list)
    quiz: List[QuizItem] = Field(default_factory=list)


class Course(BaseModel):
    id: str
    title: str
    service: str
    summary: str = ""
    persona: Persona
    status: Status = "ready"
    created_at: str = ""
    modules: List[Module] = Field(default_factory=list)


class CourseSummary(BaseModel):
    id: str
    title: str
    service: str
    persona: Persona
    status: Status


class CreateCourseRequest(BaseModel):
    service: str
    audience: Audience = "general"
    level: Level = "beginner"
    scope: Scope = "internal"
