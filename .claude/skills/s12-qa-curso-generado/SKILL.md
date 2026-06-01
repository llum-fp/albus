---
name: s12-qa-curso-generado
description: "Valida que un curso generado esté listo para revisión y validación del Training Manager/Admin: completo, coherente, trazable, alineado con objetivos y sin señales obvias de error."
---

# Skill S12 · QA de Curso Generado

> Valida que un curso generado esté listo para revisión y validación del Training Manager/Admin: completo, coherente, trazable, alineado con objetivos y sin señales obvias de error.

## Propósito
Actuar como control de calidad previo a la validación del Training Manager/Admin. No aprueba ni publica; detecta problemas para que A2/A3 regeneren o marquen advertencias antes de entregar el borrador como candidato a producción.

## Cuándo se activa
- Después de que A2 genera o regenera un curso.
- Después de que A3 genera evaluaciones asociadas.
- Antes de que A0 presente el borrador al Training Manager/Admin para validación de readiness.

## Procedimiento
1. Verificar estructura: Curso → Módulos → Lecciones → Unidades, con objetivos claros y secuencia lógica.
2. Verificar cobertura: cada objetivo tiene contenido y, cuando aplique, evaluación asociada.
3. Verificar trazabilidad: cada unidad/pregunta tiene fuente o referencia suficiente; si no, marcar `needs_source`.
4. Verificar coherencia: sin contradicciones entre módulos, explicaciones, checkpoints y evaluación final.
5. Verificar perfil: tono, ejemplos y profundidad adecuados para Sales / Technical / CSM.
6. Verificar evaluación: preguntas no ambiguas, distractores plausibles, respuesta correcta inequívoca, formativo separado de sumativo.
7. Verificar presentación: markdown válido, longitud razonable, tablas/diagramas/placeholders con alt text cuando aplique.
8. Verificar readiness de producción: no hay placeholders críticos sin resolver, las fuentes son las seleccionadas/aprobadas para autoría, y el curso está preparado para revisión final.
9. Producir reporte de QA: `pass`, `warning` o `blocker`, con acciones recomendadas y checklist para el Training Manager/Admin.

## Entradas / Salidas
- **Entrada:** borrador de curso + evaluaciones + metadatos de fuente/tags.
- **Salida:** reporte de QA con problemas, severidad, recomendación y checklist de validación de readiness.

## Herramientas requeridas
- Servicio de inferencia LLM.
- Validador de schema/markdown.
- Lectura de fuentes/metadatos.

## Agentes que la usan
- A2 (Autoría de Cursos).
- A3 (Evaluaciones).
- A0 (Orquestador, como gate previo a revisión humana).

## Reglas / guardrails
- No publica ni aprueba: solo valida y reporta.
- No introduce contenido nuevo; si falta base, marca el hueco.
- Un `blocker` impide entregar el borrador como listo para validación del Training Manager/Admin.

## Actualización Rev3 · Checklist para Training Manager/Admin
S12 debe generar un checklist legible para revisión humana con estos puntos:
- **Foco del training:** objetivo, audiencia y profundidad coinciden con el pedido inicial.
- **Material correcto:** fuentes usadas, fuentes descartadas y cobertura por módulo/lección.
- **Calidad pedagógica:** secuencia, carga cognitiva, claridad, ejemplos e interactividad.
- **Evaluaciones:** checkpoints formativos y evaluación sumativa alineados a objetivos.
- **Producción:** no hay placeholders críticos, citas/metadatos suficientes, perfil correcto y estado apto para publicar tras aprobación.

Resultado esperado: `qa_pass`, `qa_warning` o `qa_blocker`. Solo `qa_pass` o `qa_warning` no bloqueante pueden pasar a `pendiente_validacion_training_manager`.
