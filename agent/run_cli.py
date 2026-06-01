#!/usr/bin/env python3
"""Generate a course draft from the command line.

Examples
--------
  python run_cli.py --service "Captive Portal" --profile sales --level beginner
  python run_cli.py --service "Captive Portal" --profile technical --json

With --json it prints ONLY the course JSON to stdout (this is how the backend calls it).
"""
from __future__ import annotations

import argparse
import json
import sys

from course_creator import generate, CourseRequest


def main() -> int:
    p = argparse.ArgumentParser(description="Albus course creator")
    p.add_argument("--service", required=True)
    p.add_argument("--profile", default="sales", choices=["sales", "technical", "csm"])
    p.add_argument("--level", default="beginner",
                   choices=["beginner", "intermediate", "advanced"])
    p.add_argument("--json", action="store_true", help="print only the course JSON")
    args = p.parse_args()

    course = generate(CourseRequest(args.service, args.profile, args.level))

    if args.json:
        print(json.dumps(course, indent=2))
    else:
        print(f"\n=== {course['title']} ===  [{course['status']}]")
        print(course.get("summary", ""))
        for m in course.get("modules", []):
            print(f"\n## {m['title']}")
            for o in m.get("objectives", []):
                print(f"  - {o}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
