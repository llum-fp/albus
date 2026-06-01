---
name: s13-taxonomia-y-etiquetado
description: "Crea y aplica tags consistentes para que cursos, unidades, preguntas, feedback y brechas puedan agruparse y compararse."
---

# Skill S13 · Taxonomía y Etiquetado

> Crea y aplica tags consistentes para que cursos, unidades, preguntas, feedback y brechas puedan agruparse y compararse.

## Propósito
Dar estructura analítica al conocimiento. Sin tags consistentes, A5 no puede detectar brechas accionables y A3 no puede mapear preguntas a objetivos de forma fiable.

## Cuándo se activa
- A1 ingiere y trocea contenido fuente.
- A2 genera estructura y unidades.
- A3 genera preguntas.
- A5 analiza feedback, desempeño y dudas del tutor.

## Taxonomía mínima
- `profile`: Sales / Technical / CSM.
- `product_or_service`: producto, servicio o dominio tratado.
- `topic`: tema principal.
- `subtopic`: subtema específico.
- `learning_objective_id`: objetivo asociado.
- `difficulty`: beginner / intermediate / advanced.
- `skill_type`: conceptual / procedural / troubleshooting / commercial / service-management.
- `source_id`: página/espacio/versión fuente.
- `assessment_kind`: formativo / sumativo, si aplica.

## Procedimiento
1. Extraer candidatos de tags desde fuente, objetivos y estructura.
2. Normalizar nombres para evitar duplicados (`Captive Portal`, no variantes inconsistentes).
3. Aplicar tags a chunks, unidades, lecciones, preguntas y feedback.
4. Validar que cada pregunta tenga al menos objetivo, tema, dificultad y fuente.
5. Mantener un catálogo editable por admin/owner para corregir taxonomía.

## Entradas / Salidas
- **Entrada:** contenido normalizado, estructura de curso, preguntas, feedback o eventos.
- **Salida:** objetos enriquecidos con tags normalizados.

## Herramientas requeridas
- Servicio de inferencia LLM para sugerencia de tags.
- Catálogo de taxonomía en base de datos.
- Validador de consistencia.

## Agentes que la usan
- A1, A2, A3, A5.

## Reglas / guardrails
- No inventar categorías críticas sin registrarlas en el catálogo.
- Si la clasificación es incierta, marcar `needs_review`.
- Los tags no deben filtrar contenido entre perfiles sin pasar por permisos de A0/S8.
