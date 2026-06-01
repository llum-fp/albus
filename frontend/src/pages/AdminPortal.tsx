import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCourse, listCourses, approveCourse, publishCourse } from "../api";
import type { Profile, Level, CourseSummary } from "../types";
import { PROFILE_LABELS } from "../types";

const PROFILES: Profile[] = ["sales", "technical", "csm"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];

export default function AdminPortal() {
  const nav = useNavigate();
  const [service, setService] = useState("Captive Portal");
  const [profile, setProfile] = useState<Profile>("sales");
  const [level, setLevel] = useState<Level>("beginner");
  const [busy, setBusy] = useState(false);
  const [courses, setCourses] = useState<CourseSummary[]>([]);

  async function refresh() {
    setCourses(await listCourses()); // no filter → admin sees ALL statuses
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const course = await createCourse({ service, profile, level });
      nav(`/admin/course/${course.id}`); // open the draft for review
    } finally { setBusy(false); }
  }

  async function act(id: string, action: "approve" | "publish") {
    if (action === "approve") await approveCourse(id); else await publishCourse(id);
    refresh();
  }

  return (
    <div className="panel">
      <h1>Admin · Create a course</h1>
      <p className="muted">
        Generate a <strong>draft</strong> from the knowledge base. Nothing reaches end-users until
        you <strong>approve</strong> and <strong>publish</strong> it.
      </p>
      <form onSubmit={submit} className="form">
        <label>Service / process
          <input value={service} onChange={(e) => setService(e.target.value)} required />
        </label>
        <label>Target profile
          <select value={profile} onChange={(e) => setProfile(e.target.value as Profile)}>
            {PROFILES.map((p) => <option key={p} value={p}>{PROFILE_LABELS[p]}</option>)}
          </select>
        </label>
        <label>Level
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <button type="submit" disabled={busy}>{busy ? "Generating…" : "Generate draft"}</button>
      </form>

      <h2>All courses</h2>
      <table className="table">
        <thead><tr><th>Title</th><th>Profile</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td><Link to={`/admin/course/${c.id}`}>{c.title}</Link></td>
              <td>{c.profile}</td>
              <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
              <td className="row-actions">
                {c.status === "draft" && <button onClick={() => act(c.id, "approve")}>Approve</button>}
                {c.status === "approved" && <button onClick={() => act(c.id, "publish")}>Publish</button>}
                {c.status === "published" && <span className="muted small">live</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
