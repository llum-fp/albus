#!/usr/bin/env python3
"""Retrieve approved-knowledge chunks from the command line — implements docs/RETRIEVAL_CONTRACT.md.

Examples
--------
  python run_cli.py --service "Captive Portal"
  python run_cli.py --service "Captive Portal" --profile technical --json

With --json prints ONLY the chunk array to stdout (how the agent lane calls it).
"""
from __future__ import annotations

import argparse
import json
import sys

from retriever import retrieve


def main() -> int:
    p = argparse.ArgumentParser(description="Albus document retrieval")
    p.add_argument("--service", required=True)
    p.add_argument("--profile", default=None, choices=["sales", "technical", "csm"])
    p.add_argument("--top-k", type=int, default=8)
    p.add_argument("--json", action="store_true", help="print only the chunk JSON array")
    args = p.parse_args()

    chunks = retrieve(args.service, args.profile, args.top_k)

    if args.json:
        print(json.dumps([c.to_dict() for c in chunks], indent=2))
    else:
        print(f"\n{len(chunks)} chunk(s) for '{args.service}':\n")
        for c in chunks:
            print(f"  {c.source_title}  <{c.source_url}>")
            print(f"      {c.text[:90]}...\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
