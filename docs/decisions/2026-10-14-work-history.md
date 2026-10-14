# Work history

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `work-history`, built locally with the `github-pages` gem and the rendered HTML of About and Resume read for six rows in order; not yet checked by eye on a phone or a laptop; proposal `work-history`; `resources/Tom_Marsh_Resume.pdf` as committed at `92b6a1a`

## Summary
Roles and degrees live in `_data/experience.yml`, and About and the Resume page render one timeline from it through `_includes/timeline.html`.
The question was: can the work history live in one data file, so the home page, About and the resume PDF stop disagreeing?
Yes for the site's pages; the PDF is still edited by hand.

## Context
The history was written out by hand in About and the resume PDF, and the two disagreed: About said Ströer Labs ran to October 2025, the PDF said November 2025.
November is correct, and About now says so.
The proposal said the PDF predated Sprout; the committed PDF already lists Sprout Social (Senior ML Ops Engineer, Boston, Apr 2026 – Present), and the data file takes Sprout's title and dates from it.

## Design
- **One entry per role or degree**, ordered by end date, newest first: `org`, `title`, `start`, `end`, `place`, `line`, and an optional `link`.
  End-date order matches the PDF, and puts both Pyper Vision contracts after Ströer although they started later.
- **Dates are display strings** ("Apr 2026", "Present"), and file order is display order, so nothing parses a date.
- **Pyper Vision is two rows**, one per contract, because the contracts are a year apart.
  Both titles say "part-time", as the PDF does, so the rows do not read as full-time work alongside Ströer.
- **`line` is written by Tom**; the include renders a `line` only when it is set, so an empty one leaves no gap.
- **The timeline is an `<ol class="timeline">`**: dates in mono `mute`, title and organisation in `hi`, place in `mute`, a `line`-coloured rule between rows.
  Each row is a column of spans, so a phone needs no separate layout.
- **About shows the timeline under its intro paragraph**; its Career and Academia prose stays below, unchanged apart from the Ströer date.
- **The Resume page shows the timeline above the PDF link**, so the page carries the history without a download.

## Alternatives considered
- **Generating the PDF from the data file.** A build step GitHub Pages does not run, and the resume is tailored per application anyway.
- **Leaving the history as prose.** About and the PDF already disagreed on the Ströer end date.
- **Dates as `YYYY-MM` values formatted by Liquid.** It needs sorting and formatting code for six rows that are already in order.
- **Pyper Vision as one row.** It would show Jul 2024 – Nov 2025 and imply a continuous contract.

## Consequences & open questions
- The PDF still has to be updated by hand when the data file changes.
- No entry has a `link` yet.
- The home page timeline is proposal `home-page`, which reads this file.
- The timeline has not been checked by eye on a phone or a laptop, in either mode.
