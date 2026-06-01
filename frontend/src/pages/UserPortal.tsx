import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses } from "../api";
import type { CourseSummary } from "../types";

export default function UserPortal() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel">
      <h1>Learn · Course catalogue</h1>
      {loading && <p className="muted">Loading…</p>}
      {!loading && courses.length === 0 && (
        <p className="muted">No courses yet. Create one in the Admin portal.</p>
      )}
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.id} to={`/learn/${c.id}`} className="card">
            <div className="card-title">{c.title}</div>
            <div className="tags">
              <span className="tag">{c.persona.audience}</span>
              <span className="tag">{c.persona.level}</span>
              <span className={`tag ${c.persona.scope === "internal" ? "tag-internal" : ""}`}>
                {c.persona.scope}
              </span>
            </div>
            <div className="muted small">{c.service}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
