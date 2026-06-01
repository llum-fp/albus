# Backend (`be/*`)

FastAPI service implementing `docs/API_CONTRACT.md`. Owns storage + the public API.
Runs **standalone** via a built-in stub generator (`app/stub.py`) — no agent or API key needed.

## Run
```bash
./run.sh            # http://localhost:8000  (docs at /docs)
```

## Try it
```bash
curl -s -X POST localhost:8000/api/courses \
  -H 'content-type: application/json' \
  -d '{"service":"Captive Portal","audience":"sales","level":"beginner","scope":"external"}' | jq .

curl -s localhost:8000/api/courses | jq .
```

## Wire in the real agent
The single integration point is `app/generator.py`. Set `ALBUS_USE_AGENT=1` and it shells out
to `agent/run_cli.py`; on any error it falls back to the stub so the demo never breaks.

## Layout
- `app/models.py` — Course schema (mirrors `shared/schema/course.schema.json`)
- `app/routes.py` — the API
- `app/storage.py` — JSON-file persistence (swap for a DB later)
- `app/stub.py` — offline course generator
- `app/generator.py` — chooses stub vs. real agent
