# API Contract

The **only** seam between roles. Frontend codes against this; backend implements it; the agent
produces objects matching `shared/schema/course.schema.json`. Change via reviewed PR only.

Base URL (dev): `http://localhost:8000`

## Endpoints

### `GET /api/courses`
List course summaries.
```json
[
  { "id": "captive-portal-sales-beginner-external",
    "title": "Selling the Captive Portal",
    "service": "Captive Portal",
    "persona": { "audience": "sales", "level": "beginner", "scope": "external" },
    "status": "ready" }
]
```

### `GET /api/courses/{id}`
Full course object — matches `course.schema.json`.

### `POST /api/courses`
Request generation of a new course.
**Body:**
```json
{ "service": "Captive Portal",
  "audience": "sales",      // sales | technical | management | general
  "level": "beginner",      // beginner | intermediate | advanced
  "scope": "external" }     // internal | external
```
**Response:** the created course object with `status: "generating"` (or `"ready"` if synchronous).

### `GET /api/courses/{id}/status`
```json
{ "id": "...", "status": "ready" }   // pending | generating | ready | failed
```

### `GET /api/personas`
Returns the available persona configs (audience descriptions, allowed depth, emphasis).
Used by the Admin portal to populate the form.

## Integration boundaries

```
frontend  ──HTTP──>  backend  ──(in-process stub OR subprocess)──>  agent
   │                    │                                              │
 mock.ts             stub.py                                      stub.py / Claude SDK
(works alone)      (works alone)                                  (works alone)
```

- **Frontend** never calls the agent directly. Only the backend.
- **Backend** owns storage + the public API. It calls the agent to generate; if the agent isn't
  wired yet, it falls back to its own `stub.py` so the FE demo still works.
- **Agent** is pure: given a request, returns a Course object. No HTTP, no DB.
