# About page

- Status: Draft
- Created: 2026-10-14
- Reflects: `pages/about.md` read at `665f46f` against the timeline points in `_data/experience.yml`; the home page and the Resume page's retirement in decision `home-page`; not built

## Summary
About stops retelling the career and becomes the personal page: who Tom is outside work, plus at most one short paragraph on how he got here.
The question: can About say who Tom is outside work, leave the career to the home page timeline, and keep the one part of the story the timeline cannot carry?

## Context
About's Career and Academia sections retell, in about thirty sentences, the roles the home page timeline already lists.
Read against the timeline's points, nearly every fact in them is already there: the €15M+ revenue, NIWA, the 2023 conference, the YSO capstone, the Pyper Vision valuation.
The prose also states the Ströer, MSc and BSc date ranges by hand (decision `work-history`), the same kind of copy that let About and the PDF disagree on the Ströer end date.
What the timeline does not carry is the arc across roles: teaching himself whole fields at Ströer, Pyper Vision approaching him after the MSc, and the case that production ML plus physics suits aerospace.
With the Resume page retired, About is the only page besides the home page that covers the work.

## Design
First guesses.
Tom writes all of the page's prose; the build is mostly removal.

- **Career and Academia go.**
  Dates and roles then live only in `_data/experience.yml` and the PDF.
- **The opening paragraph stays in some form**: Christchurch to Boston, and wanting to meet people in Boston.
- **At most one "how I got here" paragraph, with no dates**, carrying the arc the timeline cannot.
  Whether it exists depends on whether the aerospace thread belongs on the site (open question).
- **The personal sections are Tom's choice.**
  Candidates the site already points at: games, which the home page kicker claims and Space Probe backs; physics outside work; New Zealand and Boston.
- **`resources/icons/Profile.png` is a candidate photo** at the top; nothing on the site uses it today.
- **The page keeps the `page` layout and the nav label "About".**

## Alternatives considered
- **Leaving About as it is.** It repeats the timeline, and its hand-kept dates can drift from the data file.
- **Deleting About.** The site's first job is to be a personal site, and without About it has no personal page.
- **Moving the story into the timeline's `line` fields.** One line per role cannot carry an arc that runs across roles.
- **Folding About into the home page.** The home page already runs from hero to projects, and personal sections would sit at its foot.

## Consequences & open questions
- Nothing can be built until the prose exists, so the session is mostly writing.
- Whether the aerospace thread belongs on the site, or only in job applications, is open.
- Removing Career and Academia removes the last hand-kept date ranges outside the data file and the PDF.
- If games is one of the sections, the kicker's "Games" claim gains a second page to support it.
- Whether to use the profile photo is open.
