---
name: s6-redaccion-items-evaluacion
description: "Escribe preguntas válidas y bien calibradas alineadas con los objetivos del curso: opción múltiple, verdadero/falso y escenario (RF-7)."
---

# Skill S6 · Redacción de Ítems de Evaluación

> Escribe preguntas válidas y bien calibradas alineadas con los objetivos del curso: opción múltiple, verdadero/falso y escenario (RF-7).

## Propósito
Producir evaluaciones que midan de verdad el aprendizaje, con distractores plausibles, respuesta correcta inequívoca y explicación útil.

## Cuándo se activa
- A3 genera la evaluación de un curso/módulo durante la autoría.

## Procedimiento
1. Mapear cada pregunta a un objetivo de aprendizaje del curso.
2. Decidir su naturaleza: **formativa** (checkpoint inline, baja presión, una idea concreta recién vista) o **sumativa** (evaluación final, integra varios objetivos).
3. Redactar según tipo:
   - **Opción múltiple:** una correcta + distractores plausibles (no obvios, no capciosos).
   - **Verdadero/Falso:** afirmaciones sin ambigüedad.
   - **Escenario:** situación realista que exige aplicar el conocimiento.
4. Definir respuesta correcta y **explicación** anclada al contenido (apoyarse en S4).
5. Solo para sumativas: proponer umbral de aprobado configurable. Las formativas no llevan umbral ni nota.
6. Calibrar la dificultad al tipo: los checkpoints formativos comprueban comprensión inmediata; la sumativa exige integrar y aplicar.
7. Evitar preguntas respondibles sin haber estudiado (pistas, redundancias).

## Entradas / Salidas
- **Entrada:** objetivos y contenido del curso (de A2).
- **Salida:** set de preguntas con respuestas, explicaciones y umbral, en `borrador`.

## Herramientas requeridas
- Servicio de inferencia LLM.
- Lectura del contenido del curso.

## Agentes que la usan
- A3 (Evaluaciones).

## Reglas / guardrails
- Cada pregunta trazable a un objetivo.
- Explicaciones consistentes con el contenido aprobado.
- Requiere aprobación del admin antes de publicarse.
