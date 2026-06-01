// In-memory mock store so the frontend runs with NO backend. api.ts falls back to these on
// fetch failure, and they behave like a real store (create/approve/publish persist in-memory).
import type { Course, CourseSummary, CreateCourseRequest, Profile, Status } from "./types";

function seed(): Course[] {
  return [
    {
      id: "captive-portal-sales-beginner",
      title: "Captive Portal for Sales",
      service: "Captive Portal",
      summary: "A beginner sales course: why customers buy the Captive Portal.",
      author: "admin",
      profile: "sales", level: "beginner", status: "published",
      created_at: "2026-06-01T00:00:00Z",
      tags: ["captive-portal", "sales"],
      estimated_reading_minutes: 15,
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
      title: "Captive Portal for Technical Teams",
      service: "Captive Portal",
      summary: "A draft technical course awaiting admin approval.",
      author: "admin",
      profile: "technical", level: "beginner", status: "draft",
      created_at: "2026-06-01T00:00:00Z",
      tags: ["captive-portal", "network"],
      estimated_reading_minutes: 20,
      modules: [
        { id: "m1", title: "Captive Portal: Overview", objectives: ["Understand the request flow"],
          content_markdown: "## Architecture\n```\nclient -> portal -> auth -> internet\n```",
          citations: [], quiz: [] },
      ],
    },
    // Real course from Confluence — CP v4.0.6 Support Guide
    {
      id: "cp-v406-scenic-emerald-technical-intermediate",
      title: "CP v4.0.6 - Scenic / Emerald - Support Guide",
      service: "Captive Portal",
      profile: "technical",
      level: "intermediate",
      status: "published",
      author: "Luis Pico",
      created_at: "2026-05-13T09:44:18.404Z",
      updated_at: "2026-05-13T09:44:18.404Z",
      estimated_reading_minutes: 55,
      path_location: "Confluence / CP / CP v4.0.6 - Scenic / Emerald - Support Guide",
      tags: ["captive-portal", "ucopia", "fortigate", "pms-server", "network-configuration"],
      summary: "Comprehensive support documentation for the Captive Portal (CP) v4.0.6 deployed on Scenic and Emerald River and Ocean cruise vessels.",
      objectives: [
        "Identify the system components (Fortigate, Ucopia, CP host, PMS server, Mikrotik) and their architectural roles.",
        "Trace the complete end-user authentication flow for PMS-based registration and voucher-based login.",
        "Locate and interpret Ucopia and CP host logs to diagnose connectivity and authentication issues.",
      ],
      key_concepts: [
        {
          term: "Ucopia",
          definition: "A controller software that manages network access policies per user profile, applies bandwidth quotas, and acts as the DHCP server.",
        },
        {
          term: "VRF Loop",
          definition: "A network routing construct in Fortigate where traffic from Guest/Crew networks is directed through Ucopia, processed, and forwarded back using NAT to prevent conflicts.",
        },
      ],
      modules: [
        {
          id: "m1",
          title: "System Access & Platform Architecture",
          objectives: [],
          content_markdown: "",
          topics: [
            "Vessel IP structures (10.245.X.161 for CP host, 10.245.X.160 for Ucopia)",
            "ProxMox Virtual Environment setups: VM 140 (Ucopia) and VM 145 (CP Host)",
            "Vessel deployment exceptions in Portugal (disabled due to single SSID constraints)",
          ],
          citations: [], quiz: [],
        },
        {
          id: "m2",
          title: "Authentication Flows & Logic",
          objectives: [],
          content_markdown: "",
          topics: [
            "Primary PMS validation using Cabin Number, First Name, and Last Name via CruisePAL or MXP",
            "Secondary Voucher-based authentication via Unity fallback",
            "Automated cronjob cleanup schedules for expired or deprecated user accounts",
          ],
          citations: [], quiz: [],
        },
        {
          id: "m3",
          title: "Network Encirclement & The VRF Loop",
          objectives: [],
          content_markdown: "",
          topics: [
            "Fortigate virtual interfaces management (uc_in and uc_out structures)",
            "DHCP Relay mapping on Mikrotik routers pointing to 10.254.199.1",
            "Central Source NAT and Destination NAT implementations to resolve duplicate source routing conflicts",
          ],
          citations: [], quiz: [],
        },
        {
          id: "m4",
          title: "Monitoring, Database Tables & Troubleshooting",
          objectives: [],
          content_markdown: "",
          topics: [
            "Ucopia accounts directory structure mapping to Clientes DB table parameters",
            "Database modifications using specific Rundeck automated script job IDs",
            "Real-time log streaming from /var/www/html/storage/logs/ utilizing CLI tail tools",
            "Ucopia diagnostic tracing using the showLogs syntax parameters",
          ],
          citations: [], quiz: [],
        },
      ],
    },
  ];
}

const store: Course[] = seed();

const summary = (c: Course): CourseSummary => ({
  id: c.id, title: c.title, service: c.service, profile: c.profile,
  level: c.level, status: c.status, author: c.author,
  estimated_reading_minutes: c.estimated_reading_minutes,
  tags: c.tags,
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
    tags: [req.service.toLowerCase().replace(/\s+/g, "-"), req.profile],
    modules: [
      { id: "m1", title: `${req.service}: Overview`, objectives: [`Understand ${req.service}`],
        content_markdown: `## ${req.service}\n\nMock overview for a ${req.profile} reader.`,
        citations: [], quiz: [] },
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
