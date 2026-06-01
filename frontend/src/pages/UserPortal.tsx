import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses } from "../api";
import type { CourseSummary, Profile } from "../types";
import type React from "react";
import { PROFILE_LABELS } from "../types";
import { BookOpen, ChevronRight, GraduationCap, User, TrendingUp, Wrench, Headphones } from "lucide-react";

const PROFILES: Profile[] = ["sales", "technical", "csm"];

const PROFILE_ICONS: Record<Profile, React.ReactNode> = {
  sales:     <TrendingUp size={18} strokeWidth={2} />,
  technical: <Wrench size={18} strokeWidth={2} />,
  csm:       <Headphones size={18} strokeWidth={2} />,
};

export default function UserPortal() {
  const [profile, setProfile] = useState<Profile>("sales");
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listCourses({ status: "published", profile })
      .then(setCourses)
      .finally(() => setLoading(false));
  }, [profile]);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 section-enter">

      {/* Header */}
      <div className="mb-8">
        <p className="section-subtitle mb-1">Portal del alumno</p>
        <h1 className="section-title flex items-center gap-3">
          <GraduationCap size={28} className="opacity-20" />
          Mis cursos
        </h1>
      </div>

      {/* Profile selector — pill tabs */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-base-content/40 mb-3">
          Viendo como
        </p>
        <div className="bg-base-200/70 rounded-xl p-1 flex gap-1 w-fit">
          {PROFILES.map((p) => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              className={`nav-pill ${profile === p ? "active" : ""}`}
            >
              <User size={14} />
              {PROFILE_LABELS[p]}
            </button>
          ))}
        </div>
        <p className="text-xs text-base-content/40 font-medium mt-2">
          Solo se muestran cursos <strong>publicados</strong> para este perfil.
        </p>
      </div>

      {/* Course grid */}
      {loading && (
        <div className="flex justify-center py-24">
          <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="card-clean p-12 text-center">
          <BookOpen size={40} className="mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-base-content/60">
            No hay cursos publicados para {PROFILE_LABELS[profile]} todavía.
          </p>
          <p className="text-sm text-base-content/40 mt-1">
            El admin debe aprobar y publicar un curso para que aparezca aquí.
          </p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/learn/${c.id}`}
              className="card-clean p-5 group flex flex-col gap-3 hover:no-underline"
            >
              {/* Profile icon */}
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                {PROFILE_ICONS[c.profile as Profile]}
              </div>

              <div className="flex-1">
                <div className="font-bold text-sm text-base-content leading-snug mb-1">
                  {c.title}
                </div>
                <div className="text-xs text-base-content/40 font-medium">{c.service}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="badge badge-sm bg-primary/10 text-primary border-0 font-semibold capitalize">
                    {c.profile}
                  </span>
                  <span className="badge badge-sm bg-base-200 text-base-content/50 border-0 font-semibold capitalize">
                    {c.level}
                  </span>
                </div>
                <ChevronRight
                  size={16}
                  className="text-base-content/30 group-hover:text-primary transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
