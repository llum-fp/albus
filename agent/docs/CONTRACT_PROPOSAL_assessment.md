# Contract proposal — formative vs summative assessment

**From:** agent lane (`agent/*`) · **To:** Integration/contract lane (`ops/*`)
**Status:** proposal — the agent lane already emits this; asking ops to formalise it in the schema.

## Why
We added **formative checkpoints** (low-stakes knowledge checks intercalated after each content
module) alongside the existing **summative** evaluation (graded, counts toward certification). This
follows learning science (retrieval practice) and the spec's evaluation model (RF-7). See
`Diseno_Agentes/01_Analisis_Gaps.md` §E for the product decision.

## What the agent now produces
Each quiz item carries an extra field:

```json
{ "question": "...", "options": ["..."], "answer_index": 1,
  "explanation": "...", "kind": "formative" }
```

- `kind` ∈ `"formative" | "summative"`.
- Per-module `quiz` items are `formative`.
- A final module `id: "m-final-assessment"` holds the `summative` items.

This is **backward-compatible**: `course.schema.json` does not set `additionalProperties: false`,
so courses with `kind` validate against the current schema unchanged, and lanes that ignore `kind`
keep working.

## Requested changes (ops to apply via reviewed PR)
1. `shared/schema/course.schema.json` — add `kind` to the quiz item `properties`:
   ```json
   "kind": { "enum": ["formative", "summative"], "default": "formative" }
   ```
   (Optional, not required, to stay backward-compatible.)
2. `frontend/src/types.ts` — add `kind?: "formative" | "summative"` to `QuizItem`, and render
   formative checks inline (retryable, ungraded) vs the final graded assessment.
3. `backend` — when attempts land, only persist/score `summative` items toward certification;
   `formative` answers are not recorded as attempts.

## Larger follow-up (not in this proposal)
The spec's deeper hierarchy **Course → Module → Lesson → Unit** is where per-unit checkpoints
ultimately belong. That is a bigger schema change; this proposal stays at module level for the POC.
