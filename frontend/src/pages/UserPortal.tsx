import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses } from "../api";
import type { CourseSummary, Profile } from "../types";
import { PROFILE_LABELS } from "../types";

const PROFILES: Profile[] = ["sales", "technical", "csm"];

// No auth yet (see CLAUDE.md). We simulate "logged in as <profile>" with a selector so the
// per-profile visibility rule is demonstrable: end-users see ONLY published courses of their profile.
export default function UserPortal() {
  const [profile, setProfile] = useState<Profile>("sales");
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listCourses({ status: "published", profile }).then(setCourses).finally(() => setLoading(false));
  }, [profile]);

  return (
    <div className="panel">
      <div className="row-between">
        <h1>Learn · My courses</h1>
        <label className="inline">Viewing as&nbsp;
          <select value={profile} onChange={(e) => setProfile(e.target.value as Profile)}>
            {PROFILES.map((p) => <option key={p} value={p}>{PROFILE_LABELS[p]}</option>)}
          </select>
        </label>
      </div>
      <p className="muted">Only <strong>published</strong> courses for your profile are shown.</p>

      {loading && <p className="muted">Loading…</p>}
      {!loading && courses.length === 0 && (
        <p className="muted">No published courses for {PROFILE_LABELS[profile]} yet.</p>
      )}
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.id} to={`/learn/${c.id}`} className="card">
            <div className="card-title">{c.title}</div>
            <div className="tags">
              <span className="tag">{c.profile}</span>
              <span className="tag">{c.level}</span>
            </div>
            <div className="muted small">{c.service}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
