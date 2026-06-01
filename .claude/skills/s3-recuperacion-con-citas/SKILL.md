---
name: s3-recuperacion-con-citas
description: "Recupera del índice los fragmentos relevantes a una consulta y los devuelve con sus referencias de origen, listos para fundamentar una respuesta citada."
---

# Skill S3 · Recuperación con Citas (RAG)

> Recupera del índice los fragmentos relevantes a una consulta y los devuelve con sus referencias de origen, listos para fundamentar una respuesta citada.

## Propósito
Dar al tutor (A4) el material exacto sobre el que puede responder, y las citas que debe mostrar (RF-6).

## Cuándo se activa
- El tutor recibe una pregunta del usuario final.

## Procedimiento
1. Convertir la consulta en embedding y buscar los fragmentos más relevantes en el índice.
2. Filtrar por permisos: solo material visible para el perfil/curso del usuario.
3. Evaluar suficiencia: si la relevancia es baja o no hay cobertura, señalarlo (entrada para el rechazo honesto de S4).
4. Devolver los fragmentos seleccionados **con sus metadatos de cita** (página, URL, versión).

## Entradas / Salidas
- **Entrada:** consulta del usuario + contexto (perfil, lección/curso).
- **Salida:** conjunto de fragmentos relevantes con citas, o señal de "sin cobertura suficiente".

## Herramientas requeridas
- Almacén vectorial / búsqueda.
- Generador de embeddings (para la consulta).
- Control de permisos.

## Agentes que la usan
- A4 (Tutor de IA).

## Reglas / guardrails
- Nunca devolver fragmentos fuera del alcance permitido al usuario.
- Si no hay cobertura, decirlo: no forzar fragmentos irrelevantes.
- Las citas son obligatorias en la salida.
