# Work history

- Status: Draft
- Created: 2026-10-14
- Reflects: `pages/about.md`, `pages/resume.md` and `resources/Tom_Marsh_Resume.pdf`, read at `29cacb4`; the resume in use on 2026-10-14; the Field home board of the design canvas, which left a placeholder row for Sprout; not built

## Summary
Roles, dates and one line each live in `_data/experience.yml`, and every page that lists the work history reads from it; Sprout is added there first.
The question: can the work history live in one data file, so the home page, About and the resume PDF stop disagreeing?

## Context
The history is written out by hand in three places, and they already disagree: About says Ströer Labs ran to October 2025, the resume says November 2025.
Sprout, the current role, is in none of them.
The resume page is a single link to a PDF that predates Sprout.

## Design
First guesses.

- **One entry per role or degree**: organisation, title, start, end, place, one line, and an optional link.
- **The home page's timeline and the top of About are rendered from it**; About keeps its longer prose below.
- **The resume page shows the same timeline above the PDF link**, so the page says something without a download.
- **Sprout goes in first**, from the owner's own account of the role; nothing about it is written until then.

## Alternatives considered
- **Generating the PDF from the data file.** A build step GitHub Pages does not run, and the resume is tailored per application anyway.
- **Leaving the history as prose.** The disagreement above is the cost.

## Consequences & open questions
- The Sprout title, dates, a line on what was built there, and any number that can be shared, are needed before this is built.
- The Ströer end date needs settling: October or November 2025.
- The PDF still has to be updated by hand when the data file changes.
