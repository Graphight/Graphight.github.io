# Work history

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `work-history`, built locally with the `github-pages` gem and the rendered HTML of the Resume page read for six rows in order and 28 points; not yet checked by eye on a phone or a laptop; proposal `work-history`; `resources/Tom_Marsh_Resume.pdf` as committed at `92b6a1a`

## Summary
Roles and degrees live in `_data/experience.yml`, and the Resume page renders a timeline from it through `_includes/timeline.html`, each row opening to its resume points.
The question was: can the work history live in one data file, so the home page, About and the resume PDF stop disagreeing?
Yes for the site; the PDF is still edited by hand.

## Context
The history was written out by hand in About and the resume PDF, and the two disagreed: About said Ströer Labs ran to October 2025, the PDF said November 2025.
November is correct, and About now says so.
The proposal said the PDF predated Sprout; the committed PDF already lists Sprout Social (Senior ML Ops Engineer, Boston, Apr 2026 – Present), and the data file takes Sprout's title and dates from it.

## Design
- **One entry per role or degree**, ordered by end date, newest first: `org`, `title`, `start`, `end`, `place`, `line`, `points`, and an optional `link`.
  End-date order matches the PDF, and puts both Pyper Vision contracts after Ströer although they started later.
- **Dates are display strings** ("Apr 2026", "Present"), and file order is display order, so nothing parses a date.
- **Pyper Vision is two rows**, one per contract, because the contracts are a year apart.
  Both titles say "part-time", as the PDF does, so the rows do not read as full-time work alongside Ströer.
- **`line` is written by Tom**; the include renders a `line` only when it is set, so an empty one leaves no gap.
- **`points` are the PDF's bullets, word for word**, with each wrapped line joined.
- **The timeline is an `<ol class="timeline">`**: dates in mono `mute`, title and organisation in `hi`, place in `mute`, a `line`-coloured rule between rows.
  Each row is a column of spans, so a phone needs no separate layout.
- **A row with `points` is a `<details>` element**: the summary is the row, and a click opens its points as a list.
  The browser handles the open and close, so the page adds no script, and a `+` or `−` in `kw` replaces the default marker.
- **The Resume page puts the PDF link first and the timeline under it.**
- **About has no timeline**; its Career and Academia prose is unchanged apart from the Ströer date.

## Alternatives considered
- **Generating the PDF from the data file.** A build step GitHub Pages does not run, and the resume is tailored per application anyway.
- **Leaving the history as prose.** About and the PDF already disagreed on the Ströer end date.
- **The timeline on About as well.** About's prose already covers the same roles and dates, so the page said everything twice.
- **Dates as `YYYY-MM` values formatted by Liquid.** It needs sorting and formatting code for six rows that are already in order.
- **Pyper Vision as one row.** It would show Jul 2024 – Nov 2025 and imply a continuous contract.

## Consequences & open questions
- The PDF still has to be updated by hand when the data file changes, and its bullets now have a second copy in `points`.
- About's prose still states the Ströer, MSc and BSc date ranges by hand.
- No entry has a `link` yet.
- The home page timeline is proposal `home-page`, which reads this file.
- The timeline has not been checked by eye on a phone or a laptop, in either mode.
