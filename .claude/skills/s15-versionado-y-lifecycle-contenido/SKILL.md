---
name: s15-versionado-y-lifecycle-contenido
description: "Gestiona versiones, estados y evolución de cursos, evaluaciones, fuentes, progreso y certificados."
---

# Skill S15 · Versionado y Lifecycle de Contenido

> Gestiona versiones, estados y evolución de cursos, evaluaciones, fuentes, progreso y certificados.

## Propósito
Evitar que regeneraciones o cambios de fuente rompan progreso, certificados o trazabilidad. Un curso publicado no se sobrescribe: los cambios crean una nueva versión/borrador.

## Cuándo se activa
- Se aprueba/publica un curso.
- A1 detecta cambios en fuente usada por un curso publicado.
- El admin decide regenerar o ajustar un curso publicado.
- A3 registra intentos de evaluación.
- A5 analiza métricas por versión.

## Procedimiento
1. Asignar `course_version` a cada publicación.
2. Asociar progreso, intentos y certificados a la versión exacta cursada.
3. Si un curso publicado requiere cambios, crear nueva versión en `borrador`; no modificar la versión publicada en caliente.
4. Mantener estados: `borrador`, `qa_aprobado`, `pendiente_validacion_training_manager`, `validado_por_training_manager`, `aprobado`, `publicado`, `archivado`, `desactualizado`.
5. Si la fuente cambia, marcar cursos afectados como `source_changed` o `desactualizado` y notificar al admin.
6. Definir migración opcional de usuarios en progreso solo mediante decisión explícita del admin.
7. Preservar certificados emitidos sobre versiones antiguas.

## Entradas / Salidas
- **Entrada:** transición de estado, cambio de fuente, regeneración, intento o certificación.
- **Salida:** nueva versión/estado actualizado + auditoría.

## Herramientas requeridas
- Base de datos.
- Bus de eventos.
- Auditoría.
- Comparador de versiones/fuentes.

## Agentes que la usan
- A0, A1, A2, A3, A5.

## Reglas / guardrails
- Nunca sobrescribir contenido publicado sin crear versión.
- Certificados históricos permanecen válidos y trazables a su versión.
- El admin decide migraciones, archivado y publicación de nuevas versiones.

## Actualización Rev3 · Estados de validación
Estados recomendados del curso:
1. `borrador`: generado o editado, todavía no listo.
2. `qa_aprobado`: S12 no detecta blockers.
3. `pendiente_validacion_training_manager`: listo para revisión humana de foco, material y readiness.
4. `validado_por_training_manager`: el Training Manager/Admin confirma que el contenido es adecuado para producción.
5. `aprobado`: aprobado formalmente para publicación.
6. `publicado`: visible para usuarios finales del perfil correspondiente.
7. `archivado` / `desactualizado`: estados de mantenimiento.

Regla: regenerar desde una versión publicada crea una nueva versión en `borrador`; no modifica la versión publicada ni sus certificados/progreso.
