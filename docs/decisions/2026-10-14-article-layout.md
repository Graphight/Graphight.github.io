# Article layout

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `article-layout`, built locally with the `github-pages` gem and checked by eye on a phone and a laptop in both modes; header heights measured in headless Chrome at widths from 320 to 1024 px; the Field article board of the design canvas drawn on 2026-10-14 (link in decision `own-theme`)

## Summary
Every page shares a sticky header; an article opens on a short band holding its date, author and title, then a single reading column, and ends on links to its neighbours and to all writing.
The question was: does a sticky nav over a short title band keep a long article comfortable to read on a phone?
Yes: the header sticks at every width, and on a phone, where it is 136 px tall, it was judged comfortable over the ML systems guide.

## Context
When this was proposed, at `29cacb4`, the navigation was an `<h3>` of links under Slate's header, and it scrolled away.
The own-theme decision then replaced it with one bar: the name on the left, the links and the mode toggle on the right, the current link in burnt orange.
What remained was making that bar sticky, and the article's opening and ending.
Each article repeated its date and author by hand in its body, and the ML systems guide is long, so getting back to the nav from its middle matters.

## Design
- **The header is sticky at every width**: `position: sticky` at the top, on the `bg` colour so text does not show through it.
  The "Under reconstruction" notice above it scrolls away.
  The header is 136 px tall below 640 px wide, where the name, the links and the toggle each take a row, and 63 px from 640 px up.
  `scroll-padding-top` on `html` is 152 px below 640 px and 80 px above it, so a `#` anchor lands just below the header.
- **The reading column moved out of the shell.** `default.html` holds a plain `<main>`; `page.html` and `article.html` each wrap their content in `.column`, so an article can put a full-width band above its column.
- **An article opens on a band at least 200 px tall**, on `surf` with a `line` border, its text aligned to the reading column.
  Both take their width from one Sass variable, `$column` (900 px since the code-highlighting PR, #4, widened it from the proposal's 720 px).
  It holds the date and author in JetBrains Mono and the title as the page's `<h1>`, and it scrolls away under the header.
- **The title, date and author come from front matter** (`title`, `date`, `author`); both articles lost their hand-written date line and `#` title, and no prose changed.
  `{% seo %}` now gives each article its own `<title>`.
- **The first paragraph is 22 px**, a size above the 19 px prose, selected as `.band + .column > p:first-child`.
- **An article ends on one row of links**: the older and newer article by front-matter date, whichever exist, then All writing and "↑ Back to top".
  The list is every page with `layout: article`, sorted by `date`.

## Alternatives considered
- **A full hero on every article.** It pushes the first line of text below the fold on a phone.
- **A side rail with an "On this page" list**, as in the Index direction. It wraps poorly on a phone, and both articles are short enough to scroll.
- **The Editor direction's numbered lines.** Painful to read prose in.
- **A sticky header only at 600 px and wider.** Kept in reserve in case the phone header covered too much; on the phone check it did not.
- **Hiding the header on scroll down.** More script for a problem the phone check did not find.
- **A reading progress bar under the nav.** Left out.

## Consequences & open questions
- A new article needs `title`, `date` and `author` in its front matter; without them its band renders empty, and without `date` it sorts as the oldest article.
- The Writing page still lists the articles by hand; the same sorted list could generate it.
- The Experience link waits for the work-history proposal; adding it can change where the header wraps, so the 152 px padding and the 640 px breakpoint get re-measured then.
- Whether the band animates is the hero proposal's question.
