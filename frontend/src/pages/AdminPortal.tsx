import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../api";
import type { Audience, Level, Scope } from "../types";

const AUDIENCES: Audience[] = ["sales", "technical", "management", "general"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const SCOPES: Scope[] = ["internal", "external"];

export default function AdminPortal() {
  const nav = useNavigate();
  const [service, setService] = useState("Captive Portal");
  const [audience, setAudience] = useState<Audience>("sales");
  const [level, setLevel] = useState<Level>("beginner");
  const [scope, setScope] = useState<Scope>("external");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const course = await createCourse({ service, audience, level, scope });
      nav(`/learn/${course.id}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create course");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h1>Admin · Create a course</h1>
      <p className="muted">
        Generate an adaptive course from your documentation. Same service, different persona →
        different course.
      </p>
      <form onSubmit={submit} className="form">
        <label>
          Service / product
          <input value={service} onChange={(e) => setService(e.target.value)} required />
        </label>

        <label>
          Audience
          <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
            {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <label>
          Level
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label>
          Scope
          <select value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
            {SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        <button type="submit" disabled={busy}>
          {busy ? "Generating…" : "Generate course"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
