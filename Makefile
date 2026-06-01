# Albus — one-command dev helpers (owned by the Integration/DevOps lane).
.PHONY: help backend frontend agent ingest dev smoke install stop

help:
	@echo "Albus targets:"
	@echo "  make install   # install backend + frontend + agent + ingestion deps"
	@echo "  make backend   # run API on :8000"
	@echo "  make frontend  # run UI on :5173"
	@echo "  make agent     # generate a sample course via the agent CLI"
	@echo "  make ingest    # retrieve sample chunks via the ingestion CLI"
	@echo "  make smoke     # offline end-to-end check of all lanes"
	@echo "  make stop      # kill background servers"

install:
	cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -q -r requirements.txt
	cd frontend && npm install
	cd agent && pip install -q -r requirements.txt || true
	cd ingestion && pip install -q -r requirements.txt || true

backend:
	cd backend && ./run.sh

frontend:
	cd frontend && npm run dev

agent:
	cd agent && python3 run_cli.py --service "Captive Portal" --profile sales --level beginner

ingest:
	cd ingestion && python3 run_cli.py --service "Captive Portal"

# Offline end-to-end check — proves every lane runs without servers/credentials.
smoke:
	@echo "== ingestion (approved knowledge + citations) ==" && cd ingestion && python3 run_cli.py --service "Captive Portal"
	@echo "== agent draft: sales ==" && cd agent && python3 run_cli.py --service "Captive Portal" --profile sales
	@echo "== agent draft: csm ==" && cd agent && python3 run_cli.py --service "Captive Portal" --profile csm

stop:
	-pkill -f uvicorn
	-pkill -f vite
