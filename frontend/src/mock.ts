// In-memory mock store so the frontend runs with NO backend. api.ts falls back to these on
// fetch failure, and they behave like a real store (create/approve/publish persist in-memory).
import type { Course, CourseSummary, CreateCourseRequest, Profile, Status } from "./types";

function seed(): Course[] {
  return [
    {
      id: "captive-portal-sales-beginner",
      title: "Captive Portal for SALES",
      service: "Captive Portal",
      summary: "A beginner sales course: why customers buy the Captive Portal.",
      author: "admin",
      profile: "sales", level: "beginner", status: "published",
      created_at: "2026-06-01T00:00:00Z",
      modules: [
        { id: "m1", title: "Captive Portal: Overview", objectives: ["Explain the customer benefit"],
          content_markdown: "## Why it matters\n\nGuests get online in seconds; the operator gets branding and analytics.",
          citations: [{ title: "Confluence: Captive Portal", url: "" }], quiz: [] },
        { id: "m2", title: "Value & Objection Handling", objectives: ["Handle the top objections"],
          content_markdown: "### Objections\n1. \"Too expensive\" -> ROI from analytics.\n2. \"We already have wifi\" -> this is the experience layer.",
          citations: [], quiz: [] },
      ],
    },
    {
      id: "captive-portal-technical-beginner",
      title: "Captive Portal for TECHNICAL",
      service: "Captive Portal",
      summary: "A draft technical course awaiting admin approval.",
      author: "admin",
      profile: "technical", level: "beginner", status: "draft",
      created_at: "2026-06-01T00:00:00Z",
      modules: [
        { id: "m1", title: "Captive Portal: Overview", objectives: ["Understand the request flow"],
          content_markdown: "## Architecture\n```\nclient -> portal -> auth -> internet\n```",
          citations: [], quiz: [] },
      ],
    },
  ];
}

const store: Course[] = seed();

const summary = (c: Course): CourseSummary => ({
  id: c.id, title: c.title, service: c.service, profile: c.profile, level: c.level, status: c.status,
});

export function mockList(status?: Status, profile?: Profile): CourseSummary[] {
  return store
    .filter((c) => (status ? c.status === status : true))
    .filter((c) => (profile ? c.profile === profile : true))
    .map(summary);
}

export function mockGet(id: string): Course | undefined {
  return store.find((c) => c.id === id);
}

export function mockCreate(req: CreateCourseRequest): Course {
  const id = `${req.service.toLowerCase().replace(/\s+/g, "-")}-${req.profile}-${req.level}`;
  const course: Course = {
    id, title: `${req.service} for ${req.profile.toUpperCase()}`,
    service: req.service, summary: `[mock] ${req.level} ${req.profile} course on ${req.service}.`,
    author: "admin", profile: req.profile, level: req.level, status: "draft",
    created_at: new Date().toISOString(),
    modules: [
      { id: "m1", title: `${req.service}: Overview`, objectives: [`Understand ${req.service}`],
        content_markdown: `## ${req.service}\n\nMock overview for a ${req.profile} reader.`, citations: [], quiz: [] },
    ],
  };
  const i = store.findIndex((c) => c.id === id);
  if (i >= 0) store[i] = course; else store.push(course);
  return course;
}

export function mockTransition(id: string, status: Status): Course {
  const c = store.find((x) => x.id === id);
  if (!c) throw new Error("not found");
  c.status = status;
  return c;
}
