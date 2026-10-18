# About page

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `about-page`, built locally with the `github-pages` gem and the rendered `_site/pages/about.html` read for the opening, How I got here and Outside of work; not yet checked by eye on a phone or a laptop; proposal `about-page`

## Summary
About is the personal page: an opening paragraph, a recap of how Tom got here, and a short section on life outside work.
The question was: can About say who Tom is outside work, leave the career to the home page timeline, and keep the one part of the story the timeline cannot carry?
Partly: the career record left, but the story is still told through the jobs, and the outside-work section is two sentences.

## Context
About's Career and Academia sections retold the roles the home page timeline lists, with hand-kept month ranges for Ströer, the MSc and the BSc.
That kind of copy let About and the PDF disagree on the Ströer end date (decision `work-history`).

## Design
- **Career and Academia are gone.**
  Month ranges, job titles and resume figures now live only in `_data/experience.yml` and the PDF.
- **The opening is new**: Ōtautahi, the University of Canterbury, and the move to Boston with Tom's wife.
  The previous opening's "8 years… TB/PB scale" lines repeated the home page, and its "always down to meet them" line was cut by Tom as cliché.
- **How I got here is a recap in order, with years as story beats.**
  The proposal asked for one dateless paragraph; Tom wanted the recap, since the work has been a large part of the story.
  A year used as a beat ("in 2018", "around 2022") is not a record to keep in step with the data file, so the drift the proposal names does not apply; month ranges and job titles that copy the timeline were left out.
  The section carries what the timeline cannot: the CEO's offer, the self-teaching, the time in Europe, the number 8 wire mindset, dropping to 0.8 FTE for the MSc, and the long nights at Pyper Vision.
- **Pyper Vision is named as an aerospace startup**, without the previous closing case that production ML plus physics suits aerospace, which read as a job application.
- **Outside of work is two sentences**, on sci-fi and on game development and modding.
- **The page keeps the `page` layout and the nav label "About".**
- **All prose is Tom's**; edits were spelling, grammar and the removal of two job titles.

## Alternatives considered
- **One dateless "how I got here" paragraph**, as proposed. It could not hold the arc Tom wanted to tell.
- **Separate Games and Books sections.** Planned, then left for later because the page was already long.
- **The profile photo** (`resources/icons/Profile.png`). Rejected; nothing on the site uses it.
- **Leaving About as it was, deleting it, or folding it into the home page**: rejected in the proposal for repeating the timeline, losing the only personal page, and crowding the home page.

## Consequences & open questions
- How I got here overlaps the timeline in places (the conference, the paper, the eight-month Pyper Vision build); those are the facts most likely to need editing in two places.
- The home kicker's "Games" claim is supported by Space Probe and one sentence on About.
- Games and Books can come back as sections without restructuring the page.
- The page is long for an About page; whether it reads well on a phone is the eye check still to come.
