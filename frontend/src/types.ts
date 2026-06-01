// Mirrors shared/schema/course.schema.json. Keep in sync via PR when the contract changes.

export type Profile = "sales" | "technical" | "csm";
export type Level = "beginner" | "intermediate" | "advanced";
export type Status = "draft" | "approved" | "published" | "archived";

export interface Citation { title: string; url: string; }
export interface QuizItem { question: string; options: string[]; answer_index: number; explanation?: string; }

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
  author: string;
  profile: Profile;
  level: Level;
  status: Status;
  created_at: string;
  modules: Module[];
}

export interface CourseSummary {
  id: string; title: string; service: string; profile: Profile; level: Level; status: Status;
}

export interface CreateCourseRequest {
  service: string; profile: Profile; level: Level;
}

export const PROFILE_LABELS: Record<Profile, string> = {
  sales: "Sales",
  technical: "Technical",
  csm: "Customer Service Manager",
};
