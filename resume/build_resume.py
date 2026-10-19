#!/usr/bin/env python3
"""Render resume.md to the site's resources/Tom_Marsh_Resume.pdf.

Source of truth is resume.md. This script is the only thing that turns it into a
PDF, so keep them together. Regenerate with:

    uv run --no-project --with markdown --with weasyprint python resume/build_resume.py

Requires: markdown, weasyprint. Font: Liberation Sans (Arial metrics).
On macOS, WeasyPrint finds Homebrew's pango only with
DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib set.
"""

import argparse
import pathlib

import markdown
from weasyprint import HTML

TITLE = "Tom Marsh - Senior Machine Learning Engineer - Resume"
AUTHOR = "Tom Marsh"
SUBJECT = "Resume of Tom Marsh, Senior Machine Learning Engineer"
KEYWORDS = ("Machine Learning Engineer, MLOps, ML Infrastructure, LLM Evaluation, "
            "Model Serving, Inference Optimisation, Kubernetes, Python, Boston MA")

CSS = """
@page { size: Letter; margin: 0.55in 0.75in 0.55in 0.75in; }

body { font-family: "Liberation Sans", Arial, Helvetica, sans-serif;
       font-size: 9.6pt; line-height: 1.32; color: #202020; }

h1 { font-size: 20pt; text-align: center; margin: 0 0 4pt 0; letter-spacing: 0.6pt; }
p.tagline, p.contact { text-align: center; font-size: 9pt; margin: 0 0 2pt 0; color: #333; }
p.contact { margin-bottom: 6pt; padding-bottom: 6pt; border-bottom: 0.6pt solid #9a9a9a; }
a { color: #1155cc; }

h2 { font-size: 11.5pt; margin: 5pt 0 3pt 0; letter-spacing: 0.3pt; page-break-after: avoid; }
h2 + * { page-break-before: avoid; }
h3 { font-size: 10.6pt; margin: 8pt 0 0 0; page-break-after: avoid; }
h3:first-of-type { margin-top: 2pt; }

p.meta { font-style: italic; font-size: 9.2pt; color: #444; margin: 1pt 0 3pt 0;
         page-break-after: avoid; }
p.meta em { font-style: italic; }
p.edu { margin: 6pt 0 2pt 0; page-break-after: avoid; }
p.skills { margin: 0 0 3pt 0; }

ul { margin: 0 0 3pt 0; padding-left: 13pt; }
li { margin: 0 0 2.2pt 0; padding-left: 2pt; page-break-inside: avoid; }

section { border-bottom: 0.6pt solid #9a9a9a; padding-bottom: 5pt; margin-bottom: 0; }
section:last-of-type { border-bottom: 0.6pt solid #9a9a9a; }
sub { font-size: 7pt; }
"""


def wrap_sections(html: str) -> str:
    """Wrap each H2 block in <section> so the rules land between sections."""
    parts = html.split("<h2>")
    out = [parts[0]]
    for part in parts[1:]:
        out.append("<section><h2>" + part + "</section>")
    return "".join(out)


def build(src: pathlib.Path, out: pathlib.Path) -> None:
    md = markdown.Markdown(extensions=["attr_list", "sane_lists"])
    body = wrap_sections(md.convert(src.read_text(encoding="utf-8")))
    html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>{TITLE}</title><meta name="author" content="{AUTHOR}">
<meta name="description" content="{SUBJECT}">
<meta name="keywords" content="{KEYWORDS}">
<style>{CSS}</style></head><body>{body}</body></html>"""
    HTML(string=html).write_pdf(out, pdf_tags=True)
    print(f"wrote {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    here = pathlib.Path(__file__).parent
    ap.add_argument("--src", type=pathlib.Path, default=here / "resume.md")
    ap.add_argument("--out", type=pathlib.Path, default=here.parent / "resources" / "Tom_Marsh_Resume.pdf")
    a = ap.parse_args()
    build(a.src, a.out)
