// Mock data so the frontend runs with NO backend. api.ts falls back to these on fetch failure.
import type { Course, CourseSummary, CreateCourseRequest } from "./types";

export const MOCK_COURSES: Course[] = [
  {
    id: "captive-portal-sales-beginner-external",
    title: "Captive Portal for Sales (external)",
    service: "Captive Portal",
    summary: "A beginner sales course: why customers buy the Captive Portal.",
    persona: { audience: "sales", level: "beginner", scope: "external" },
    status: "ready",
    created_at: "2026-06-01T00:00:00Z",
    modules: [
      {
        id: "m1", title: "Captive Portal: Overview",
        objectives: ["Explain the customer benefit"],
        content_markdown: "## Why it matters\n\nGuests get online in seconds; the operator gets branding and analytics.",
        citations: [{ title: "Confluence: Captive Portal", url: "" }], quiz: [],
      },
      {
        id: "m2", title: "Value & Objection Handling",
        objectives: ["Handle the top objections"],
        content_markdown: "### Objections\n1. \"Too expensive\" → ROI from analytics.\n2. \"We have wifi already\" → this is the guest experience layer.",
        citations: [], quiz: [],
      },
    ],
  },
];

export function mockCreate(req: CreateCourseRequest): Course {
  const id = `${req.service.toLowerCase().replace(/\s+/g, "-")}-${req.audience}-${req.level}-${req.scope}`;
  const techish = req.audience !== "sales";
  return {
    id, title: `${req.service} for ${req.audience} (${req.scope})`,
    service: req.service,
    summary: `[mock] ${req.level} ${req.audience} course on ${req.service}.`,
    persona: { audience: req.audience, level: req.level, scope: req.scope },
    status: "ready", created_at: new Date().toISOString(),
    modules: [
      { id: "m1", title: `${req.service}: Overview`, objectives: [`Understand ${req.service}`],
        content_markdown: `## ${req.service}\n\nMock overview for a ${req.audience} reader.`,
        citations: [], quiz: [] },
      techish
        ? { id: "m2", title: "How it works & Troubleshooting", objectives: ["Diagnose a failure"],
            content_markdown: "## Architecture\n```\nclient → portal → auth → internet\n```", citations: [], quiz: [] }
        : { id: "m2", title: "Value & Objection Handling", objectives: ["Pitch the benefit"],
            content_markdown: "### Objections\n1. ...\n2. ...", citations: [], quiz: [] },
    ],
  };
}

export const MOCK_SUMMARIES: CourseSummary[] = MOCK_COURSES.map(c => ({
  id: c.id, title: c.title, service: c.service, persona: c.persona, status: c.status,
}));
