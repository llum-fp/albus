---
name: s5-diseno-instruccional
description: "Convierte material fuente y respuestas del admin en una estructura pedagógica navegable: objetivos, secuencia y jerarquía Curso → Módulos → Lecciones → Unidades (RF-4)."
---

# Skill S5 · Diseño Instruccional

> Convierte material fuente y respuestas del admin en una estructura pedagógica navegable: objetivos, secuencia y jerarquía Curso → Módulos → Lecciones → Unidades (RF-4).

## Propósito
Que el borrador de curso tenga estructura de aprendizaje real (no solo texto reorganizado): objetivos claros, progresión lógica y lecciones interactivas.

## Cuándo se activa
- A2 genera o regenera un curso, tras el diálogo de preguntas (RF-2).

## Procedimiento
1. Tomar objetivos de aprendizaje y nivel/profundidad definidos en el diálogo.
2. Derivar una jerarquía: módulos por tema, lecciones por sub-tema, unidades como piezas atómicas.
3. Secuenciar de lo fundamental a lo avanzado.
4. Redactar contenido interactivo y navegable (texto estructurado + elementos interactivos), no archivos descargables (RF-4).
5. Marcar dónde corresponden evaluaciones (handoff a A3) y dónde el tutor aporta apoyo.
6. Mantener cada unidad anclada a su fuente (trazabilidad).

## Entradas / Salidas
- **Entrada:** material fuente + parámetros del diálogo (perfil, profundidad, objetivos, estructura).
- **Salida:** estructura de curso con contenido de lecciones, en `borrador`.

## Herramientas requeridas
- Servicio de inferencia LLM.
- Lectura del contenido normalizado.

## Agentes que la usan
- A2 (Autoría de Cursos).

## Reglas / guardrails
- Estructura completa: objetivos + secuencia + evaluación prevista.
- Contenido en inglés (idioma de plataforma).
- Sin contenido fuera de la fuente (apoyarse en S4).
