#!/usr/bin/env python3
"""Copy resume.md's bullets into _data/experience.yml, so the timeline matches the PDF.

    python3 resume/sync_experience.py

Only the `points:` lists are rewritten; every other line of the YAML is left as is.
"""

import json
import pathlib
import re

HERE = pathlib.Path(__file__).parent
SRC = HERE / "resume.md"
YML = HERE.parent / "_data" / "experience.yml"

# (experience.yml title, the resume.md line its bullets follow)
SECTIONS = [
    ("Senior ML Ops Engineer", "### Sprout Social"),
    ("Founding Machine Learning Engineer (Contract 2, part-time)", "Contract 2 |"),
    ("Senior Machine Learning Engineer", "### Ströer Labs NZ"),
    ("Founding Machine Learning Engineer (Contract 1, part-time)", "Contract 1 |"),
    ("MSc, Physics", "**MSc, Physics**"),
    ("BSc, Physics & Computer Science", "**BSc, Physics"),
]


def bullets(lines: list[str], marker: str) -> list[str]:
    start = next(i for i, l in enumerate(lines) if l.startswith(marker))
    out = []
    for line in lines[start + 1:]:
        if line.startswith("- "):
            out.append(re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line[2:]))
        elif out:
            break
    assert out, f"no bullets after {marker!r}"
    return out


def sync(src: str, yml: str) -> str:
    md = src.splitlines()
    points = {title: bullets(md, marker) for title, marker in SECTIONS}
    out, title, skipping = [], None, False
    for line in yml.splitlines():
        if skipping and line.startswith("    - "):
            continue
        skipping = False
        out.append(line)
        if line.startswith("  title: "):
            title = line[len("  title: "):]
        elif line == "  points:" and title in points:
            out += ["    - " + json.dumps(p, ensure_ascii=False) for p in points.pop(title)]
            skipping = True
    assert not points, f"titles not found in experience.yml: {list(points)}"
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    YML.write_text(sync(SRC.read_text(encoding="utf-8"), YML.read_text(encoding="utf-8")), encoding="utf-8")
    print(f"wrote {YML}")
