---
name: s11-presentacion-y-formato
description: "Asegura que el contenido generado **renderice bien y sea de alto impacto visual** sin inventar estilos: estructura escaneable, jerarquía clara, tablas/diagramas donde aporten, y placeholders de imagen/diagrama con descripción y alt text."
---

# Skill S11 · Presentación y Formato

> Asegura que el contenido generado **renderice bien y sea de alto impacto visual** sin inventar estilos: estructura escaneable, jerarquía clara, tablas/diagramas donde aporten, y placeholders de imagen/diagrama con descripción y alt text.

## Propósito
Elevar la calidad de presentación del contenido a nivel de **autoría** (cómo se estructura), dejando la **identidad visual** (color, tipografía, layout, contraste) al sistema de diseño del frontend. El mismo design system luce mucho mejor si el contenido viene bien estructurado.

## Frontera importante (qué NO hace)
- **No** elige colores, fuentes ni define CSS/estilos. Eso es responsabilidad del **carril frontend** (design system + tokens), por consistencia entre cursos y por accesibilidad. Que un LLM pinte colores por curso rompería marca y contraste.
- S11 produce **markdown estructurado y especificaciones de diagrama/imagen**; el frontend lo renderiza con su identidad visual.

## Cuándo se activa
- A2 genera o regenera contenido (idealmente como paso final de pulido, junto al QA del pipeline curator→syllabus→writer→adapter→QA).

## Procedimiento
1. Imponer jerarquía clara: encabezados bien anidados, una idea por sección.
2. Trocear: párrafos cortos, listas y pasos numerados en vez de muros de texto.
3. Usar **tablas** para comparaciones y **bloques de código** para ejemplos técnicos.
4. Insertar **callouts** (nota / advertencia / tip) donde aporten.
5. Donde un visual ayude, **especificar un diagrama** (p. ej. Mermaid) o un **placeholder de imagen** con `caption` y `alt text` descriptivos — nunca dejar un visual sin texto alternativo.
6. Mantener markdown **consistente** y válido para que el frontend lo renderice sin sorpresas.
7. No alterar los hechos del contenido (apoyarse en S4): formatear, no reescribir la verdad.

## Entradas / Salidas
- **Entrada:** contenido de lecciones/módulos ya redactado (de A2/S5).
- **Salida:** el mismo contenido con estructura escaneable, tablas/diagramas y placeholders de imagen con alt text, listo para el render del frontend.

## Herramientas requeridas
- Servicio de inferencia LLM.
- (Opcional) validador de markdown/diagramas.

## Agentes que la usan
- A2 (Autoría de Cursos).

## Reglas / guardrails
- Formatea, no inventa: cero hechos nuevos; consistencia con el contenido aprobado.
- Todo visual lleva alt text (accesibilidad).
- No define identidad visual (color/tipografía/CSS) — eso es del frontend.
- El resultado sigue siendo `borrador` hasta la aprobación del admin.
