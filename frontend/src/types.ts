// Mirrors shared/schema/course.schema.json. Keep in sync via PR when the contract changes.

export type Audience = "sales" | "technical" | "management" | "general";
export type Level = "beginner" | "intermediate" | "advanced";
export type Scope = "internal" | "external";
export type Status = "pending" | "generating" | "ready" | "failed";

export interface Persona { audience: Audience; level: Level; scope: Scope; }

export interface Citation { title: string; url: string; }
export interface QuizItem { question: string; options: string[]; answer_index: number; }

export interface Module {
  id: string;
  title: string;
  objectives: string[];
  content_markdown: string;
  citations: Citation[];
  quiz: QuizItem[];
}

export interface Course {
  id: string;
  title: string;
  service: string;
  summary: string;
  persona: Persona;
  status: Status;
  created_at: string;
  modules: Module[];
}

export interface CourseSummary {
  id: string; title: string; service: string; persona: Persona; status: Status;
}

export interface CreateCourseRequest {
  service: string; audience: Audience; level: Level; scope: Scope;
}
