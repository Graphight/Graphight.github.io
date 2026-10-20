# Resume source

- Status: Accepted
- Created: 2026-10-19
- Reflects: branch `resume-oct-2026`; `resume/build_resume.py` rebuilt `resources/Tom_Marsh_Resume.pdf` byte-identical to the committed PDF; `resume/sync_experience.py` run with no diff, and with one Ströer bullet deleted from `resume.md` it removed exactly that line from `_data/experience.yml`; `jekyll build` exits 0 with no `resume/` in the output

## Summary
The resume's Markdown source and its build script now live in `resume/`, and a second script copies its bullets into `_data/experience.yml`.
The question was: can the PDF and the home page timeline come from one file, without the source being served on the site?
Yes; `_config.yml` excludes `resume/`, and both outputs come from `resume/resume.md`.

## Context
Decision `work-history` left the PDF edited by hand, with its bullets copied word for word into `points`.
The PDF was built by `build_resume.py` from a `resume.md` kept outside any repository, and that `resume.md` was lost.
The October 2026 resume was then produced by a different tool, and the repo PDF and the data file both had to be reconciled with it by hand.

## Design
- **`resume/resume.md` is the source of truth** for the PDF and for every `points` list.
  It holds nothing beyond what the published PDF already shows: the email address and phone number are on the PDF.
- **`resume/build_resume.py` writes straight to `resources/Tom_Marsh_Resume.pdf`**, so one command updates the served file.
  It needs `markdown` and `weasyprint`; on macOS, WeasyPrint finds Homebrew's pango only with `DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib`.
- **`resume/sync_experience.py` rewrites only the `points:` lists**, matched by `title`, and leaves `line`, dates and every other field alone.
  A hand-written table maps each `title` to the `resume.md` line its bullets follow; it fails if a title or a bullet list is missing.
  Markdown links are reduced to their text, because the timeline escapes each point.
- **`_config.yml` excludes `resume/`**, so the source and scripts are in the public repository but not on the site.
- **Tailored per-application resumes stay out of the repository.**

## Alternatives considered
- **Generating the timeline from `resume.md` at build time.** GitHub Pages runs no build step beyond Jekyll, as decision `work-history` found.
- **Rewriting the YAML with a YAML library.** A dump reformats the whole file, so a one-bullet change becomes a whole-file diff.
- **Keeping the source outside the repository.** That is how the previous `resume.md` was lost.

## Consequences & open questions
- A change to the resume is now: edit `resume.md`, run both scripts, commit all three files.
- Nothing runs the scripts automatically; a hand edit to `points` is overwritten on the next sync.
- The `SECTIONS` table needs a new row when a role is added.
- About's prose still states the Ströer, MSc and BSc date ranges by hand.
