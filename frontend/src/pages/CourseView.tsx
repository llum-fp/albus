import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, approveCourse, publishCourse } from "../api";
import type { Course } from "../types";

// Tiny markdown-ish renderer (headings, lists, code fences) — enough for the POC.
function renderMarkdown(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i}>{line.slice(4)}</h4>;
    if (line.startsWith("## ")) return <h3 key={i}>{line.slice(3)}</h3>;
    if (line.startsWith("# ")) return <h2 key={i}>{line.slice(2)}</h2>;
    if (line.startsWith("- ") || /^\d+\.\s/.test(line)) return <li key={i}>{line.replace(/^(-|\d+\.)\s/, "")}</li>;
    if (line.startsWith("```")) return null;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i}>{line}</p>;
  });
}

export default function CourseView({ admin = false }: { admin?: boolean }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() { if (id) setCourse(await getCourse(id)); }
  useEffect(() => { load(); }, [id]);

  if (!course) return <div className="panel"><p className="muted">Loading…</p></div>;

  async function act(action: "approve" | "publish") {
    if (!course) return;
    setBusy(true);
    try {
      const updated = action === "approve" ? await approveCourse(course.id) : await publishCourse(course.id);
      setCourse(updated);
    } finally { setBusy(false); }
  }

  return (
    <div className="panel">
      <Link to={admin ? "/admin" : "/learn"} className="back">← {admin ? "Admin" : "All courses"}</Link>
      <h1>{course.title}</h1>
      <div className="tags">
        <span className="tag">{course.profile}</span>
        <span className="tag">{course.level}</span>
        <span className={`badge badge-${course.status}`}>{course.status}</span>
      </div>
      <p className="muted">{course.summary}</p>

      {admin && (
        <div className="admin-bar">
          <strong>Admin review.</strong> Generated content is a draft until you approve & publish.
          {course.status === "draft" && <button disabled={busy} onClick={() => act("approve")}>✓ Approve</button>}
          {course.status === "approved" && <button disabled={busy} onClick={() => act("publish")}>🚀 Publish</button>}
          {course.status === "published" && <span className="muted">Published — visible to {course.profile} users.</span>}
        </div>
      )}

      {course.modules.map((m) => (
        <section key={m.id} className="module">
          <h2>{m.title}</h2>
          {m.objectives.length > 0 && (
            <div className="objectives"><strong>Objectives</strong>
              <ul>{m.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></div>
          )}
          <div className="md">{renderMarkdown(m.content_markdown)}</div>
          {m.citations.length > 0 && (
            <div className="citations"><strong>Sources</strong>
              <ul>{m.citations.map((c, i) => <li key={i}>{c.title}</li>)}</ul></div>
          )}
        </section>
      ))}
    </div>
  );
}
