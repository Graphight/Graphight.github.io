# Article layout

- Status: Draft
- Created: 2026-10-14
- Reflects: the Field article board of the design canvas drawn on 2026-10-14 and the five article boards before it, judged by eye (link in the theme proposal); `_layouts/article.html` and `_includes/navigation.html`, read at `29cacb4`; not built

## Summary
Every page shares a sticky nav bar; an article opens on a short band holding its date and title, then a single reading column.
The question: does a sticky nav over a short title band keep a long article comfortable to read on a phone?

## Context
The navigation is an `<h3>` of links separated by hyphens, under Slate's header, and it scrolls away.
Each article repeats its date and author by hand in its body.
The ML systems guide is long, so getting back to the nav from its middle matters.

## Design
First guesses, each to be checked on a phone and a laptop.

- **The nav is one bar, sticky at the top of every page**: the name on the left, then About, Experience, Writing, Projects, Resume and the mode toggle.
  It replaces `_includes/navigation.html`, and the current page's link is burnt orange.
- **An article opens on a band about 200 px tall** holding the date and the title, which scrolls away under the nav.
  It is the home page's hero shrunk; whether it moves is the hero proposal's question.
- **The date and author come from front matter** (`date`, `author`), not the body.
- **The reading column is 720 px at most**, prose 19 px on 1.7 line height, with the first paragraph a size larger.
- **An article ends on links to all writing and to the next article.**

## Alternatives considered
- **A full hero on every article.** It pushes the first line of text below the fold on a phone.
- **A side rail with an "On this page" list**, as in the Index direction. It wraps poorly on a phone, and both articles are short enough to scroll.
- **The Editor direction's numbered lines.** Painful to read prose in.

## Consequences & open questions
- On a phone the nav wraps to two lines, about 100 px always covered; hiding it on scroll down, or a menu button below about 600 px, is open.
- Moving the date into front matter touches both articles.
- A reading progress bar under the nav was considered and left out.
