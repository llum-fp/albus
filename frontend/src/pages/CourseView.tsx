import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourse, createCourse } from "../api";
import type { Course, Audience, Scope } from "../types";

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

export default function CourseView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (id) getCourse(id).then(setCourse);
  }, [id]);

  if (!course) return <div className="panel"><p className="muted">Loading…</p></div>;

  // The demo money shot: regenerate the SAME service for the opposite persona.
  async function regenerateAsOpposite() {
    if (!course) return;
    const audience: Audience = course.persona.audience === "sales" ? "technical" : "sales";
    const scope: Scope = course.persona.scope === "external" ? "internal" : "external";
    setBusy(true);
    try {
      const next = await createCourse({
        service: course.service, audience, level: course.persona.level, scope,
      });
      nav(`/learn/${next.id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <Link to="/learn" className="back">← All courses</Link>
      <h1>{course.title}</h1>
      <div className="tags">
        <span className="tag">{course.persona.audience}</span>
        <span className="tag">{course.persona.level}</span>
        <span className={`tag ${course.persona.scope === "internal" ? "tag-internal" : ""}`}>
          {course.persona.scope}
        </span>
      </div>
      <p className="muted">{course.summary}</p>

      <button className="regen" onClick={regenerateAsOpposite} disabled={busy}>
        {busy ? "Regenerating…" : `↻ Regenerate for a different audience`}
      </button>

      {course.modules.map((m) => (
        <section key={m.id} className="module">
          <h2>{m.title}</h2>
          {m.objectives.length > 0 && (
            <div className="objectives">
              <strong>Objectives</strong>
              <ul>{m.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
            </div>
          )}
          <div className="md">{renderMarkdown(m.content_markdown)}</div>
          {m.citations.length > 0 && (
            <div className="citations">
              <strong>Sources</strong>
              <ul>{m.citations.map((c, i) => <li key={i}>{c.title}</li>)}</ul>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
