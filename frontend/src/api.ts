// Thin client over docs/API_CONTRACT.md. Falls back to the in-memory mock so the FE runs alone.
import type { Course, CourseSummary, CreateCourseRequest, Profile, Status } from "./types";
import { mockList, mockGet, mockCreate, mockTransition } from "./mock";

const USE_MOCK_ON_FAIL = true;

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "content-type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function listCourses(opts: { status?: Status; profile?: Profile } = {}): Promise<CourseSummary[]> {
  const qs = new URLSearchParams();
  if (opts.status) qs.set("status", opts.status);
  if (opts.profile) qs.set("profile", opts.profile);
  const q = qs.toString() ? `?${qs}` : "";
  try {
    return await http<CourseSummary[]>(`/api/courses${q}`);
  } catch (e) {
    if (USE_MOCK_ON_FAIL) { console.warn("API down — using mock", e); return mockList(opts.status, opts.profile); }
    throw e;
  }
}

export async function getCourse(id: string): Promise<Course> {
  try {
    return await http<Course>(`/api/courses/${id}`);
  } catch (e) {
    if (USE_MOCK_ON_FAIL) { const c = mockGet(id); if (c) return c; }
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

async function transition(id: string, action: "approve" | "publish" | "archive"): Promise<Course> {
  try {
    return await http<Course>(`/api/courses/${id}/${action}`, { method: "POST" });
  } catch (e) {
    if (USE_MOCK_ON_FAIL) {
      const status = action === "approve" ? "approved" : action === "publish" ? "published" : "archived";
      return mockTransition(id, status as Status);
    }
    throw e;
  }
}

export const approveCourse = (id: string) => transition(id, "approve");
export const publishCourse = (id: string) => transition(id, "publish");
export const archiveCourse = (id: string) => transition(id, "archive");
