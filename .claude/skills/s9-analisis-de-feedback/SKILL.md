---
name: s9-analisis-de-feedback
description: "Agrega y resume feedback, resultados de evaluación y señales del tutor para producir insights y detectar brechas de conocimiento (RF-8, RF-10)."
---

# Skill S9 · Análisis de Feedback

> Agrega y resume feedback, resultados de evaluación y señales del tutor para producir insights y detectar brechas de conocimiento (RF-8, RF-10).

## Propósito
Cerrar el ciclo de mejora continua: convertir datos dispersos en recomendaciones accionables para el admin.

## Cuándo se activa
- Llega feedback nuevo, se completan intentos, o el admin abre el dashboard.

## Procedimiento
1. Agregar feedback por curso/lección (calificación, comentarios) en dimensiones: claridad, utilidad, dificultad, errores.
2. Resumir comentarios libres (temas recurrentes, sentimiento) y destacar errores reportados.
3. Calcular brechas de conocimiento: temas/preguntas más fallados por perfil o equipo (definir métrica concreta — gap C).
4. Cruzar con dudas del tutor que quedaron sin respuesta (lagunas de contenido).
5. Formular recomendaciones: ajustar lección, regenerar módulo, revisar pregunta.

## Entradas / Salidas
- **Entrada:** feedback de contenido, intentos de evaluación, señales del tutor.
- **Salida:** insights agregados para el dashboard + recomendaciones priorizadas.

## Herramientas requeridas
- Lectura de feedback, intentos y progreso en base de datos.
- Servicio de inferencia LLM (resumen y categorización).
- Capa de reportes/visualización.

## Agentes que la usan
- A5 (Feedback e Insights).

## Reglas / guardrails
- Solo recomienda; no modifica contenido (la decisión es del admin).
- Respeta privacidad y permisos al mostrar datos.
