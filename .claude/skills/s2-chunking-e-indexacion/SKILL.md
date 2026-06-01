---
name: s2-chunking-e-indexacion
description: "Construye el *Índice de conocimiento* (entidad del modelo de datos): trocea el contenido normalizado, genera embeddings y los almacena con metadatos de cita."
---

# Skill S2 · Chunking e Indexación

> Construye el *Índice de conocimiento* (entidad del modelo de datos): trocea el contenido normalizado, genera embeddings y los almacena con metadatos de cita.

## Propósito
Hacer el conocimiento aprobado recuperable de forma semántica y citable, base del tutor (A4) y apoyo de la autoría (A2).

## Cuándo se activa
- Tras la ingesta multi-fuente (S1) de contenido nuevo.
- Cuando un curso se aprueba/publica (entra al índice del tutor — decisión B-1).
- En reindexados por frescura (gap B-2).

## Procedimiento
1. Trocear el contenido en fragmentos coherentes (por sección/encabezado), evitando cortar ideas a la mitad.
2. Conservar en cada fragmento la referencia de origen (página, URL, versión).
3. Generar embeddings de cada fragmento.
4. Almacenar en el índice vectorial junto con sus metadatos.
5. Versionar el índice y marcar como obsoletos los fragmentos cuya fuente cambió.

## Entradas / Salidas
- **Entrada:** documentos normalizados multi-fuente de S1.
- **Salida:** índice vectorial actualizado + registro de frescura.

## Herramientas requeridas
- Generador de embeddings.
- Almacén vectorial / índice de búsqueda.
- Base de datos (estado de frescura y versiones).

## Agentes que la usan
- A1 (Ingesta e Indexación).

## Reglas / guardrails
- Todo fragmento debe ser trazable a su origen (sin metadatos de cita no se indexa).
- El índice del tutor solo contiene mat