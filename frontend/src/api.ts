// Thin client over docs/API_CONTRACT.md. Falls back to mock data so the FE runs alone.
import type { Course, CourseSummary, CreateCourseRequest } from "./types";
import { MOCK_COURSES, MOCK_SUMMARIES, mockCreate } from "./mock";

const USE_MOCK_ON_FAIL = true;

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function listCourses(): Promise<CourseSummary[]> {
  try {
    return await http<CourseSummary[]>("/api/courses");
  } catch (e) {
    if (USE_MOCK_ON_FAIL) { console.warn("API down — using mock", e); return MOCK_SUMMARIES; }
    throw e;
  }
}

export async function getCourse(id: string): Promise<Course> {
  try {
    return await http<Course>(`/api/courses/${id}`);
  } catch (e) {
    if (USE_MOCK_ON_FAIL) {
      const c = MOCK_COURSES.find(x => x.id === id);
      if (c) return c;
    }
    throw e;
  }
}

export async function createCourse(req: CreateCourseRequest): Promise<Course> {
  try {
    return await http<Course>("/api/courses", { method: "POST", body: JSON.stringify(req) });
  } catch (e) {
    if (USE_MOCK_ON_FAIL) { console.warn("API down — using mock", e); return mockCreate(req); }
    throw e;
  }
}
