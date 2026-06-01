---
name: s10-calificacion-y-feedback
description: "Corrige automáticamente los intentos de evaluación del usuario final y genera feedback inmediato explicado (RF-7)."
---

# Skill S10 · Calificación y Feedback

> Corrige automáticamente los intentos de evaluación del usuario final y genera feedback inmediato explicado (RF-7).

## Propósito
Dar resultado y aprendizaje en el momento: puntuación objetiva + explicación que ayude al usuario a entender sus errores.

## Cuándo se activa
- Un usuario final envía un intento de evaluación (vía A0 → A3).

## Procedimiento
1. Comparar respuestas con las correctas de forma **determinista y auditable**.
2. Ramificar según la naturaleza del ítem:
   - **Formativo (checkpoint):** feedback inmediato explicado + reintentos libres. **No** calcula nota, **no** aplica umbral, **no** registra intento. Puede ofrecer "pregúntale a Albus" (A4) con la cita de la fuente.
   - **Sumativo:** calcula puntuación, aplica el umbral, y registra el intento (respuestas, puntuación, aprobado/no, fecha — entidad *Intento de evaluación*).
3. Generar feedback por pregunta: por qué la respuesta es correcta/incorrecta, anclado al contenido del curso (apoyarse en S4).
4. Emitir señal de desempeño hacia A5; los checkpoints formativos son la fuente más rica de brechas (se fallan en caliente, sin penalización).

## Entradas / Salidas
- **Entrada:** respuestas del usuario a un checkpoint formativo o a una evaluación sumativa publicada.
- **Salida (formativo):** feedback explicado por pregunta, sin nota ni registro.
- **Salida (sumativo):** puntuación + aprobado/no + feedback explicado + registro del intento.

## Herramientas requeridas
- Servicio de inferencia LLM (para las explicaciones).
- Lectura del contenido del curso y de la evaluación.
- Base de datos (escritura del intento).

## Agentes que la usan
- A3 (Evaluaciones).

## Reglas / guardrails
- La calificación no depende del azar del modelo: es reproducible.
- El feedback no contradice el contenido aprobado.
- Política de reintentos (límite, cooldown, barajado) pendiente de definir — gap C.
