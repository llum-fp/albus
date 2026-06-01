"""Source connectors — Phase 2 placeholders.

The ingestion lane owner grows these into real pulls from Confluence / SharePoint via MCP,
then chunks + embeds the results into a vector store. retrieve() in retriever.py searches that
store. For the POC, nothing here is called — the stub corpus stands in.

Design notes:
- Use service-principal / API-token auth for unattended ingestion (NOT interactive OAuth),
  so a nightly job can run headless. See docs/ARCHITECTURE.md Phase 2.
- Tag every chunk with `visibility` (internal/external) AT INGESTION time, from the source
  space/label — the redaction boundary depends on it being correct here.
"""
from __future__ import annotations

from typing import List
from .retriever import Chunk


def pull_confluence(space: str) -> List[Chunk]:  # pragma: no cover - Phase 2
    """Pull + chunk pages from a Confluence space via the Atlassian MCP server."""
    raise NotImplementedError("Phase 2: wire the Atlassian MCP server here")


def pull_sharepoint(site: str) -> List[Chunk]:  # pragma: no cover - Phase 2
    """Pull + chunk documents from a SharePoint site via the Microsoft 365 (Graph) MCP server."""
    raise NotImplementedError("Phase 2: wire the Microsoft 365 MCP server here")
