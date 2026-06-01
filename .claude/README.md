# Albus — capa de IA (agentes y skills ejecutables)

Definiciones runtime que un orquestador Claude descubre y puede invocar.

- **Agentes:** `.claude/agents/*.md` (frontmatter `name` + `description`).
- **Skills:** `.claude/skills/<slug>/SKILL.md` (frontmatter `name` + `description`).

El cuerpo de cada archivo conserva el texto de diseño aprobado (con IDs `S##_`/`A#`). 
Este índice es el mapa autoritativo de los **nombres reales** (slugs) y de qué skills usa cada agente.

## Agentes

| slug | rol |
|------|-----|
| `a0-orquestador` | Orquestador |
| `a1-ingesta-indexacion` | Ingesta multi-fuente e indexación |
| `a2-autoria-cursos` | Autoría de cursos |
| `a3-evaluaciones` | Evaluaciones |
| `a4-tutor-ia` | Tutor de IA |
| `a5-feedback-insights` | Feedback e insights |

## Skills

| slug |
|------|
| `s1-ingesta-multifuente-y-normalizacion` |
| `s2-chunking-e-indexacion` |
| `s3-recuperacion-con-citas` |
| `s4-respuesta-anclada-y-rechazo` |
| `s5-diseno-instruccional` |
| `s6-redaccion-items-evaluacion` |
| `s7-personalizacion-por-perfil` |
| `s8-guardrails-revision-humana` |
| `s9-analisis-de-feedback` |
| `s10-calificacion-y-feedback` |
| `s11-presentacion-y-formato` |
| `s12-qa-curso-generado` |
| `s13-taxonomia-y-etiquetado` |
| `s14-sanitizacion-y-seguridad-contenido` |
| `s15-versionado-y-lifecycle-contenido` |

## Mapa agente → skills

- **`a0-orquestador`** → `s7-personalizacion-por-perfil`, `s8-guardrails-revision-humana`, `s12-qa-curso-generado`, `s15-versionado-y-lifecycle-contenido`
- **`a1-ingesta-indexacion`** → `s1-ingesta-multifuente-y-normalizacion`, `s2-chunking-e-indexacion`, `s13-taxonomia-y-etiquetado`, `s14-sanitizacion-y-seguridad-contenido`, `s15-versionado-y-lifecycle-contenido`
- **`a2-autoria-cursos`** → `s4-respuesta-anclada-y-rechazo`, `s5-diseno-instruccional`, `s7-personalizacion-por-perfil`, `s11-presentacion-y-formato`, `s12-qa-curso-generado`, `s13-taxonomia-y-etiquetado`, `s14-sanitizacion-y-seguridad-contenido`, `s15-versionado-y-lifecycle-contenido`
- **`a3-evaluaciones`** → `s4-respuesta-anclada-y-rechazo`, `s6-redaccion-items-evaluacion`, `s10-calificacion-y-feedback`, `s12-qa-curso-generado`, `s13-taxonomia-y-etiquetado`, `s15-versionado-y-lifecycle-contenido`
- **`a4-tutor-ia`** → `s3-recuperacion-con-citas`, `s4-respuesta-anclada-y-rechazo`, `s7-personalizacion-por-perfil`, `s14-sanitizacion-y-seguridad-contenido`
- **`a5-feedback-insights`** → `s9-analisis-de-feedback`, `s13-taxonomia-y-etiquetado`, `s15-versionado-y-lifecycle-contenido`
