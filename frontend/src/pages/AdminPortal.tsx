import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createCourse, listCourses, approveCourse, publishCourse } from "../api";
import type { Profile, Level, CourseSummary } from "../types";
import { PROFILE_LABELS } from "../types";
import {
  BookOpen, Plus, Users, BarChart2, Flame, Layers,
  CheckCircle, Rocket, LayoutDashboard, Menu, X,
} from "lucide-react";

const PROFILES: Profile[] = ["sales", "technical", "csm"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
type Section = "home" | "courses" | "create";
type StatusFilter = "all" | "draft" | "approved" | "published" | "archived";

export default function AdminPortal() {
  const nav = useNavigate();
  const [section, setSection] = useState<Section>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Create form
  const [service, setService] = useState("Captive Portal");
  const [profile, setProfile] = useState<Profile>("sales");
  const [level, setLevel] = useState<Level>("beginner");
  const [busy, setBusy] = useState(false);

  // Courses list
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function refresh() {
    setCourses(await listCourses());
  }
  useEffect(() => { refresh(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const course = await createCourse({ service, profile, level });
      nav(`/admin/course/${course.id}`);
    } finally { setBusy(false); }
  }

  async function act(id: string, action: "approve" | "publish") {
    if (action === "approve") await approveCourse(id);
    else await publishCourse(id);
    refresh();
  }

  function showSection(s: Section) {
    setSection(s);
    setDrawerOpen(false);
  }

  const filtered = statusFilter === "all"
    ? courses
    : courses.filter((c) => c.status === statusFilter);

  const counts = {
    draft: courses.filter((c) => c.status === "draft").length,
    approved: courses.filter((c) => c.status === "approved").length,
    published: courses.filter((c) => c.status === "published").length,
    archived: courses.filter((c) => c.status === "archived").length,
  };

  const navItems: { id: Section; icon: React.ReactNode; label: string }[] = [
    { id: "home",    icon: <LayoutDashboard size={16} />, label: "Inicio" },
    { id: "courses", icon: <BookOpen size={16} />,        label: "Cursos" },
    { id: "create",  icon: <Plus size={16} />,            label: "Crear curso" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-56px)]">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-base-200 bg-base-100 sticky top-14 h-[calc(100vh-56px)] p-3">
        <div className="mb-4 px-3 pt-2">
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/30">
            Panel Admin
          </p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.id}
              onClick={() => showSection(item.id)}
              className={`nav-item ${section === item.id ? "active" : ""}`}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ── Mobile drawer overlay ── */}
      <div
        id="mob-overlay"
        className={drawerOpen ? "open" : ""}
        onClick={() => setDrawerOpen(false)}
      />
      <div id="mob-drawer" className={drawerOpen ? "open" : ""}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-200 flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40">Panel Admin</span>
          <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost btn-sm btn-circle opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <a
              key={item.id}
              onClick={() => showSection(item.id)}
              className={`nav-item ${section === item.id ? "active" : ""}`}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 p-4 lg:p-8 max-w-5xl w-full min-w-0">

        {/* Mobile menu button */}
        <button
          className="lg:hidden btn btn-ghost btn-sm gap-2 mb-6"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={16} /> Menu
        </button>

        {/* ── SECCIÓN: HOME ── */}
        {section === "home" && (
          <div className="section-enter">
            <div className="mb-8">
              <p className="section-subtitle mb-1">Bienvenido</p>
              <h1 className="section-title flex items-center gap-3">
                <Flame size={28} className="opacity-20" />
                Panel de administración
              </h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Borradores", value: counts.draft, color: "text-amber-600" },
                { label: "Aprobados",  value: counts.approved, color: "text-blue-600" },
                { label: "Publicados", value: counts.published, color: "text-green-600" },
                { label: "Total",      value: courses.length, color: "text-primary" },
              ].map((s) => (
                <div key={s.label} className="card-clean p-5">
                  <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick access */}
            <h2 className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-4">
              Accesos rápidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { section: "create" as Section,  icon: <Plus size={22} />,       title: "Crear curso",    sub: "Genera un borrador con IA" },
                { section: "courses" as Section, icon: <BookOpen size={22} />,   title: "Ver cursos",     sub: "Aprueba y publica contenido" },
                { section: "courses" as Section, icon: <Users size={22} />,      title: "Perfiles",       sub: "sales · technical · csm" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => showSection(item.section)}
                  className="quick-card group text-left"
                >
                  <div className="text-primary opacity-50 mb-3 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </div>
                  <div className="font-black text-sm">{item.title}</div>
                  <div className="text-xs text-base-content/40 font-medium mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SECCIÓN: CURSOS ── */}
        {section === "courses" && (
          <div className="section-enter">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div>
                <p className="section-subtitle mb-1">Gestión</p>
                <h1 className="section-title flex items-center gap-3">
                  <BookOpen size={28} className="opacity-20" /> Cursos
                </h1>
              </div>
              <button
                onClick={() => showSection("create")}
                className="btn btn-primary text-white font-bold text-sm gap-2 rounded-xl"
              >
                <Plus size={16} /> Nuevo curso
              </button>
            </div>

            {/* Status tabs */}
            <div className="bg-base-200/50 rounded-2xl p-1 flex flex-wrap gap-1 mb-6 w-fit">
              {(["all", "draft", "approved", "published", "archived"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`filter-tab ${statusFilter === s ? "active" : ""}`}
                >
                  {s === "all" ? "Todos" : s}
                  {s !== "all" && counts[s as keyof typeof counts] > 0 && (
                    <span className="badge badge-xs ml-1 font-black">
                      {counts[s as keyof typeof counts]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="card-clean overflow-hidden">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="text-base-content/40 text-xs uppercase tracking-widest font-semibold">
                    <th>Título</th>
                    <th>Perfil</th>
                    <th>Nivel</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-base-content/40 py-10">
                        No hay cursos en este estado.
                      </td>
                    </tr>
                  )}
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover">
                      <td>
                        <Link
                          to={`/admin/course/${c.id}`}
                          className="font-semibold text-sm hover:text-primary transition-colors"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td>
                        <span className="badge badge-sm bg-primary/10 text-primary border-0 font-semibold capitalize">
                          {c.profile}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/50 font-medium capitalize">{c.level}</td>
                      <td>
                        <span className={`badge badge-sm font-semibold badge-${c.status}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          {c.status === "draft" && (
                            <button
                              onClick={() => act(c.id, "approve")}
                              className="btn btn-xs btn-ghost gap-1 text-blue-600 hover:bg-blue-50"
                            >
                              <CheckCircle size={12} /> Aprobar
                            </button>
                          )}
                          {c.status === "approved" && (
                            <button
                              onClick={() => act(c.id, "publish")}
                              className="btn btn-xs btn-ghost gap-1 text-green-600 hover:bg-green-50"
                            >
                              <Rocket size={12} /> Publicar
                            </button>
                          )}
                          {c.status === "published" && (
                            <span className="text-xs text-base-content/30 font-semibold">live</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SECCIÓN: CREAR CURSO ── */}
        {section === "create" && (
          <div className="section-enter max-w-lg">
            <div className="mb-8">
              <p className="section-subtitle mb-1">Generación IA</p>
              <h1 className="section-title flex items-center gap-3">
                <BarChart2 size={28} className="opacity-20" /> Nuevo curso
              </h1>
            </div>

            <div className="card-clean p-6">
              <p className="text-sm text-base-content/50 mb-6">
                El contenido se generará como <strong>borrador</strong> a partir de la base de
                conocimiento. Deberás aprobarlo antes de publicarlo.
              </p>
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                    Servicio o proceso
                  </label>
                  <input
                    className="input input-bordered w-full font-medium text-sm h-11 rounded-xl"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                    Perfil objetivo
                  </label>
                  <select
                    className="select select-bordered w-full font-medium text-sm rounded-xl h-11"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value as Profile)}
                  >
                    {PROFILES.map((p) => (
                      <option key={p} value={p}>{PROFILE_LABELS[p]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                    Nivel
                  </label>
                  <select
                    className="select select-bordered w-full font-medium text-sm rounded-xl h-11"
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                  >
                    {LEVELS.map((l) => (
                      <option key={l} value={l} className="capitalize">{l}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary text-white font-bold rounded-xl h-11 mt-2"
                >
                  {busy
                    ? <><span className="loading loading-spinner loading-sm"></span> Generando…</>
                    : <><Layers size={16} /> Generar borrador</>
                  }
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
