# API Contract

The **only** seam between roles. Frontend codes against this; backend implements it; the agent
produces objects matching `shared/schema/course.schema.json`. Change via reviewed PR only.

Base URL (dev): `http://localhost:8000`

> Scope note: this covers the POC surface (course CRUD + lifecycle). The fuller spec surface —
> auth/login, AI-tutor chat, evaluation attempts, progress, certificates, feedback, dashboard —
> is documented in `CLAUDE.md` as the target and is **not yet** in this contract. Add endpoints
> here as those land.

## Core concepts
- **profile** ∈ `sales | technical | csm` — the target end-user profile (visibility axis).
- **status** ∈ `draft | approved | published | archived` — lifecycle. Generated courses are
  always `draft`. End-users see ONLY `published`. The draft→approved→published transition is an
  explicit admin action (the mandatory human-approval gate).

## Endpoints

### `GET /api/profiles`
Profiles + levels for the Admin form: `{ "profiles": [{value,label,hint}], "levels": [...] }`.

### `GET /api/courses?status=&profile=`
List course summaries, optionally filtered.
- Admin: no filter → all courses (drafts included).
- End-user: `?status=published&profile=<their profile>` → only what they may see.
```json
[ { "id": "captive-portal-sales-beginner", "title": "Captive Portal for SALES",
    "service": "Captive Portal", "profile": "sales", "level": "beginner", "status": "published" } ]
```

### `GET /api/courses/{id}`
Full course object — matches `course.schema.json`.

### `GET /api/courses/{id}/status`
`{ "id": "...", "status": "draft" }`

### `POST /api/courses`
Generate a new course **draft**.
**Body:** `{ "service": "Captive Portal", "profile": "sales", "level": "beginner" }`
**Response:** the created course with `status: "draft"`. (Never auto-published.)

### `POST /api/courses/{id}/approve`  → sets `status: "approved"`
### `POST /api/courses/{id}/publish`  → sets `status: "published"` (now visible to the profile)
### `POST /api/courses/{id}/archive`  → sets `status: "archived"`
Each returns the updated course object.

## Integration boundaries
```
frontend ──HTTP──> backend ──> generator.py ──┬─ app/stub.py            (default, offline)
                                              └─ agent/run_cli.py --json (ALBUS_USE_AGENT=1)
```
- Frontend never calls the agent directly — only the backend.
- Backend owns storage + the public API + the lifecycle transitions.
- Agent is pure: request → Course draft. No HTTP, no DB.
