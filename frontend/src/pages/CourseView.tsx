import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourse, approveCourse, publishCourse } from "../api";
import type { Course } from "../types";
import { ArrowLeft, CheckCircle, Rocket, BookOpen, Target, Quote, Clock, User, Tag, Lightbulb, ChevronRight } from "lucide-react";

function renderMarkdown(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i} className="font-bold text-base mt-4 mb-1">{line.slice(4)}</h4>;
    if (line.startsWith("## "))  return <h3 key={i} className="font-bold text-lg mt-5 mb-2">{line.slice(3)}</h3>;
    if (line.startsWith("# "))   return <h2 key={i} className="font-black text-xl mt-6 mb-2">{line.slice(2)}</h2>;
    if (line.startsWith("- ") || /^\d+\.\s/.test(line))
      return <li key={i} className="ml-4 mb-1 text-base-content/80">{line.replace(/^(-|\d+\.)\s/, "")}</li>;
    if (line.startsWith("```")) return null;
    if (line.trim() === "") return <br key={i} />;
    return <p key={i} className="mb-2 text-base-content/80 leading-relaxed">{line}</p>;
  });
}

export default function CourseView({ admin = false }: { admin?: boolean }) {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() { if (id) setCourse(await getCourse(id)); }
  useEffect(() => { load(); }, [id]);

  if (!course) {
    return (
      <div className="flex justify-center py-32">
        <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
      </div>
    );
  }

  async function act(action: "approve" | "publish") {
    if (!course) return;
    setBusy(true);
    try {
      const updated = action === "approve"
        ? await approveCourse(course.id)
        : await publishCourse(course.id);
      setCourse(updated);
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8 section-enter">

      {/* Back */}
      <Link
        to={admin ? "/admin" : "/learn"}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-base-content/40 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={15} />
        {admin ? "Admin" : "Todos los cursos"}
      </Link>

      {/* Header */}
      <div className="mb-6">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`badge badge-sm font-semibold badge-${course.status}`}>{course.status}</span>
          <span className="badge badge-sm bg-primary/10 text-primary border-0 font-semibold capitalize">{course.profile}</span>
          <span className="badge badge-sm bg-base-200 text-base-content/50 border-0 font-semibold capitalize">{course.level}</span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-black text-base-content tracking-tight leading-snug mb-3">
          {course.title}
        </h1>

        {/* Meta — autor, fecha, tiempo lectura */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/40 font-medium mb-3">
          {course.author && (
            <span className="flex items-center gap-1.5">
              <User size={13} /> {course.author}
            </span>
          )}
          {course.estimated_reading_minutes && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {course.estimated_reading_minutes} min de lectura
            </span>
          )}
          {course.updated_at && (
            <span className="flex items-center gap-1.5">
              Actualizado {new Date(course.updated_at).toLocaleDateString("es-ES")}
            </span>
          )}
          {course.path_location && (
            <span className="flex items-center gap-1.5 truncate max-w-xs" title={course.path_location}>
              <BookOpen size={13} /> {course.path_location}
            </span>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Tag size={13} className="text-base-content/30 mt-0.5" />
            {course.tags.map((tag) => (
              <span key={tag} className="badge badge-sm bg-base-200 text-base-content/50 border-0 font-mono text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Summary */}
        {course.summary && (
          <p className="text-base-content/60 leading-relaxed">{course.summary}</p>
        )}
      </div>

      {/* Admin bar */}
      {admin && (
        <div className="card-clean bg-amber-50 border-amber-200 p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-700">Revisión de contenido</p>
            <p className="text-xs text-amber-600/70 mt-0.5">Revisa el contenido antes de aprobarlo.</p>
          </div>
          {course.status === "draft" && (
            <button disabled={busy} onClick={() => act("approve")}
              className="btn btn-sm gap-1.5 bg-blue-600 text-white border-0 rounded-xl hover:bg-blue-700">
              <CheckCircle size={14} /> Aprobar
            </button>
          )}
          {course.status === "approved" && (
            <button disabled={busy} onClick={() => act("publish")}
              className="btn btn-sm gap-1.5 bg-green-600 text-white border-0 rounded-xl hover:bg-green-700">
              <Rocket size={14} /> Publicar
            </button>
          )}
          {course.status === "published" && (
            <span className="badge badge-success font-semibold">
              Publicado · visible para {course.profile}
            </span>
          )}
        </div>
      )}

      {/* Course-level objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="card-clean p-5 mb-6 bg-primary/5 border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Target size={15} className="text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Objetivos del curso</span>
          </div>
          <ul className="flex flex-col gap-2">
            {course.objectives.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-base-content/70">
                <ChevronRight size={15} className="text-primary flex-shrink-0 mt-0.5" /> {o}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modules */}
      <div className="flex flex-col gap-4">
        {course.modules.map((m, idx) => (
          <div key={m.id} className="card-clean p-6">
            {/* Module header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm">
                {idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <BookOpen size={13} className="text-base-content/30" />
                  <span className="text-xs text-base-content/30 font-semibold uppercase tracking-wider">Módulo</span>
                </div>
                <h2 className="font-black text-lg leading-snug">{m.title}</h2>
              </div>
            </div>

            {/* Objectives (module level) */}
            {m.objectives.length > 0 && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Objetivos</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {m.objectives.map((o, i) => (
                    <li key={i} className="text-sm text-base-content/70 flex gap-2">
                      <span className="text-primary mt-0.5">·</span> {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Topics list (structured format) */}
            {m.topics && m.topics.length > 0 && (
              <ul className="flex flex-col gap-2 mb-2">
                {m.topics.map((topic, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-base-content/75 leading-relaxed">
                    <span className="w-5 h-5 bg-base-200 text-base-content/40 rounded-md flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      {i + 1}
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            )}

            {/* Markdown content (legacy format) */}
            {!m.topics && m.content_markdown && (
              <div className="prose prose-sm max-w-none text-base-content/80">
                {renderMarkdown(m.content_markdown)}
              </div>
            )}

            {/* Citations */}
            {m.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-base-200">
                <div className="flex items-center gap-2 mb-2">
                  <Quote size={13} className="text-base-content/30" />
                  <span className="text-xs font-semibold text-base-content/30 uppercase tracking-wider">Fuentes</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {m.citations.map((c, i) => (
                    <li key={i} className="text-xs text-base-content/40 font-medium">{c.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key concepts */}
      {course.key_concepts && course.key_concepts.length > 0 && (
        <div className="card-clean p-6 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={15} className="text-amber-500" />
            <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Conceptos clave</span>
          </div>
          <dl className="flex flex-col gap-4">
            {course.key_concepts.map((kc, i) => (
              <div key={i}>
                <dt className="font-bold text-sm text-base-content mb-1">{kc.term}</dt>
                <dd className="text-sm text-base-content/60 leading-relaxed">{kc.definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
