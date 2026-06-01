---
name: s8-guardrails-revision-humana
description: "Materializa el principio rector del producto: ningún contenido llega al usuario final sin validación de readiness y aprobación explícita de un Training Manager/Admin. Gestiona gates de estado, permisos y auditoría."
---

# Skill S8 · Guardrails y Revisión Humana

> Materializa el principio rector del producto: ningún contenido llega al usuario final sin validación de readiness y aprobación explícita de un Training Manager/Admin. Gestiona gates de estado, permisos y auditoría.

## Propósito
Hacer cumplir, de forma sistemática, el control humano (RF-3, RNF de control humano) y los permisos por rol/perfil (sección 4).

## Cuándo se activa
- Transición de estado de un curso (`borrador → qa_aprobado → pendiente_validacion_training_manager → validado_por_training_manager → aprobado → publicado`).
- Cualquier petición que requiera verificación de rol/perfil.

## Procedimiento
1. Verificar rol (admin / usuario final) y perfil (Sales / Technical / CSM) de quien pide.
2. Autorizar o rechazar según permisos: el usuario final solo accede a cursos publicados visibles para su perfil; nunca a autoría.
3. Bloquear transiciones a `pendiente_validacion_training_manager` si existe QA `blocker` o falta trazabilidad de fuente.
4. Bloquear transiciones a `validado_por_training_manager` que no provengan de una acción explícita del Training Manager/Admin.
5. Bloquear transiciones a `publicado` que no provengan de una acción explícita de aprobación de publicación de un admin.
6. Registrar trazabilidad: quién validó, quién aprobó, cuándo, qué versión; qué generó la IA, qué editó el humano y qué fuentes fueron aceptadas (gap C).
7. Asegurar visibilidad: un curso publicado solo aparece para su perfil destino.

## Entradas / Salidas
- **Entrada:** petición + contexto de rol/perfil + transi