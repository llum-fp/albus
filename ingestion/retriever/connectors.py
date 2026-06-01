"""Source connectors — pull corporate knowledge from external systems.

Design notes:
- API-token auth only (NOT interactive OAuth) — nightly jobs run headless.
  Required env vars for Confluence: CONFLUENCE_URL, CONFLUENCE_USER, CONFLUENCE_API_TOKEN.
- Tag every chunk with `visibility` (internal/external) AT INGESTION time from source
  labels — the redaction boundary depends on it being correct here.
"""
from __future__ import annotations

import os
from typing import List

from .retriever import Chunk


def pull_confluence(space: str) -> List[Chunk]:
    """Pull all pages from a Confluence space and return as Chunks.

    Pages with a Confluence label named 'external' are tagged visibility='external';
    everything else is 'internal'. One Chunk per page (Phase 2; finer chunking + embeddings
    is Phase 3).

    Requires env vars: CONFLUENCE_URL, CONFLUENCE_USER, CONFLUENCE_API_TOKEN.
    """
    try:
        from atlassian import Confluence  # type: ignore[import]
        import html2text as _html2text    # type: ignore[import]
    except ImportError as exc:
        raise RuntimeError(
            "Confluence connector requires 'atlassian-python-api' and 'html2text'. "
            "Run: pip install atlassian-python-api html2text"
        ) from exc

    url   = os.environ["CONFLUENCE_URL"]
    user  = os.environ["CONFLUENCE_USER"]
    token = os.environ["CONFLUENCE_API_TOKEN"]

    cf = Confluence(url=url, username=user, password=token, cloud=True)

    h2t = _html2text.HTML2Text()
    h2t.ignore_links = False
    h2t.body_width = 0  # no hard line-wrapping

    chunks: List[Chunk] = []
    start = 0
    limit = 50

    while True:
        pages = cf.get_all_pages_from_space(
            space,
            start=start,
            limit=limit,
            expand="body.storage,metadata.labels",
        )
        if not pages:
            break

        for page in pages:
            body_html = page.get("body", {}).get("storage", {}).get("value", "")
            text = h2t.handle(body_html).strip()
            if not text:
                continue

            web_ui = page.get("_links", {}).get("webui", "")
            page_url = f"{url.rstrip('/')}/wiki{web_ui}"

            label_results = (
                page.get("metadata", {})
                    .get("labels", {})
                    .get("results", [])
            )
            labels = [lbl["name"] for lbl in label_results]
            visibility = "external" if "external" in labels else "internal"

            chunks.append(Chunk(
                text=text,
                source_title=page["title"],
                source_url=page_url,
                service=space,  # remapped to requested service name by retrieve()
                score=0.0,
            ))

        start += limit
        if len(pages) < limit:
            break

    return chunks


def pull_sharepoint(site: str) -> List[Chunk]:  # pragma: no cover - Phase 3
    """Pull + chunk documents from a SharePoint site via the Microsoft 365 (Graph) MCP server."""
    raise NotImplementedError("Phase 3: wire the Microsoft 365 MCP server here")
