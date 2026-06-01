"""Pydantic models — the canonical Course shape (mirrors shared/schema/course.schema.json)."""
from __future__ import annotations

from typing import List, Literal, Optional
from pydantic import BaseModel, Field

# Target end-user profiles (the visibility axis). From the spec: Sales / Technical / CSM.
Profile = Literal["sales", "technical", "csm"]
Level = Literal["beginner", "intermediate", "advanced"]
# Lifecycle — the mandatory human-approval gate. End-users see only "published".
Status = Literal["draft", "approved", "published", "archived"]


class Citation(BaseModel):
    title: str
    url: str = ""


class QuizItem(BaseModel):
    question: str
    options: List[str]
    answer_index: int
    explanation: str = ""


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
    author: str = "admin"
    profile: Profile
    level: Level = "beginner"
    status: Status = "draft"
    created_at: str = ""
    modules: List[Module] = Field(default_factory=list)


class CourseSummary(BaseModel):
    id: str
    title: str
    service: str
    profile: Profile
    level: Level
    status: Status


class CreateCourseRequest(BaseModel):
    service: str
    profile: Profile = "sales"
    level: Level = "beginner"
