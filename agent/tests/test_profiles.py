"""AG-1 guard: the three profiles must differ in module STRUCTURE, and every course must satisfy
the shared Course schema shape. Runnable two ways:

    python tests/test_profiles.py          # plain run, prints OK / raises on failure
    pytest agent/tests/test_profiles.py    # if pytest is installed

No third-party deps required (schema validation is a hand-rolled structural check so the agent
lane stays dependency-free).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

# Make `course_creator` importable when run directly (python tests/test_profiles.py).
AGENT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(AGENT_DIR))

from course_creator import generate, CourseRequest  # noqa: E402

PROFILES = ("sales", "technical", "csm")
SCHEMA_PATH = AGENT_DIR.parent / "shared" / "schema" / "course.schema.json"


def _courses():
    return {p: generate(CourseRequest("Captive Portal", p, "beginner")) for p in PROFILES}


def test_profiles_differ_in_module_structure():
    courses = _courses()
    signatures = {p: tuple(m["id"] for m in c["modules"]) for p, c in courses.items()}
    # All three module-id signatures must be distinct from each other.
    assert len(set(signatures.values())) == len(PROFILES), f"profiles not distinct: {signatures}"
    # And titles must differ too (not just ids).
    titles = {p: tuple(m["title"] for m in c["modules"]) for p, c in courses.items()}
    assert len(set(titles.values())) == len(PROFILES), f"titles not distinct: {titles}"


def test_courses_match_schema_shape():
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    required = schema["required"]
    q_required = (schema["properties"]["modules"]["items"]["properties"]["quiz"]
                  ["items"]["required"])
    for p, c in _courses().items():
        for key in required:
            assert key in c, f"[{p}] course missing required '{key}'"
        assert c["status"] == "draft", f"[{p}] generated course must start as draft"
        assert c["profile"] == p
        assert len(c["modules"]) >= 2, f"[{p}] expected at least 2 modules"
        for m in c["modules"]:
            assert m["id"] and m["title"] and m["content_markdown"], f"[{p}] incomplete module"
            for q in m.get("quiz", []):
                for qk in q_required:  # question, options, answer_index
                    assert qk in q, f"[{p}] quiz item missing '{qk}'"
                assert isinstance(q["answer_index"], int)
                assert 0 <= q["answer_index"] < len(q["options"]), f"[{p}] answer_index out of range"


def test_quiz_seeded_for_every_profile():
    for p, c in _courses().items():
        total = sum(len(m.get("quiz", [])) for m in c["modules"])
        assert total >= 1, f"[{p}] expected at least one seeded quiz item"


def test_service_placeholder_substituted():
    # No unresolved {service} tokens should leak into output.
    for p, c in _courses().items():
        blob = json.dumps(c)
        assert "{service}" not in blob, f"[{p}] unsubstituted {{service}} placeholder leaked"


def _main() -> int:
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"  FAIL  {t.__name__}: {e}")
    print(f"\n{len(tests) - failed}/{len(tests)} passed")
    return 1 if failed else 0



# --- Formative / summative checkpoint tests (design decision §E) -------------------------------

def test_every_quiz_item_has_a_valid_kind():
    for p, c in _courses().items():
        for m in c["modules"]:
            for q in m.get("quiz", []):
                assert q.get("kind") in ("formative", "summative"), \
                    f"[{p}] quiz item missing/invalid kind: {q.get('kind')}"


def test_formative_checkpoints_present_per_profile():
    for p, c in _courses().items():
        formative = [q for m in c["modules"] for q in m.get("quiz", []) if q.get("kind") == "formative"]
        assert len(formative) >= 1, f"[{p}] expected at least one formative checkpoint"


def test_summative_lives_in_final_assessment_module():
    for p, c in _courses().items():
        for m in c["modules"]:
            kinds = {q.get("kind") for q in m.get("quiz", [])}
            if "summative" in kinds:
                assert m["id"] == "m-final-assessment", \
                    f"[{p}] summative items must live in the final-assessment module, not {m['id']}"
        ids = [m["id"] for m in c["modules"]]
        assert "m-final-assessment" in ids, f"[{p}] missing the final-assessment module"


if __name__ == "__main__":
    raise SystemExit(_main())
