---
name: s7-personalizacion-por-perfil
description: "Adapta tono, profundidad, ejemplos y enfoque al perfil destino: Sales, Technical o CSM (sección 3.3 del spec)."
---

# Skill S7 · Personalización por Perfil

> Adapta tono, profundidad, ejemplos y enfoque al perfil destino: Sales, Technical o CSM (sección 3.3 del spec).

## Propósito
Que el mismo conocimiento base se presente de forma relevante para cada audiencia, sin reescribir manualmente cada variante.

## Cuándo se activa
- A2 genera contenido para un perfil destino.
- A4 responde a un usuario de cierto perfil.
- A0 enruta una petición y debe pasar el perfil correcto.

## Procedimiento
1. Identificar el perfil destino del contexto (curso o usuario).
2. Aplicar el "lente" del perfil:
   - **Sales:** propuesta de valor, manejo de objeciones, casos de uso de cliente, lenguaje comercial.
   - **Technical:** profundidad técnica, troubleshooting, procedimientos, precisión.
   - **CSM:** procesos, SLAs, escalado, comunicación con cliente, gestión de incidencias.
3. Ajustar ejemplos, tono y nivel de detalle sin alterar los hechos del material fuente.

## Entradas / Salidas
- **Entrada:** contenido base + perfil destino.
- **Salida:** contenido o respuesta adaptada al perfil.

## Herramientas requeridas
- Servicio de inferencia LLM.
- Lectura del perfil del usuario/curso.

## Agentes que la usan
- A0 (Orquestador), A2 (Autoría), A4 (Tutor).

## Reglas / guardrails
- Personalizar la **forma**, nunca los **hechos**: no introducir información ausente en la fuente.
- Respetar la visibilidad por perfil (un perfil no ve contenido de otro).

> Supuesto: personalización a nivel de perfil, no individual (ver gap B-4). Ajustar si Marcos confirma personalización por empleado.
