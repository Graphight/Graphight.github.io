# Projects embed

- Status: Accepted
- Created: 2026-10-15
- Reflects: branch `projects-embed`, built locally with the `github-pages` gem and the rendered `_site/pages/projects.html` and `_site/assets/css/site.css` read for the button and its aspect ratio; not yet checked by eye on a phone or a laptop; proposal `projects-embed`

## Summary
The Space Probe embed is a button that fills its column at a 540 : 380 aspect ratio, and loads itch.io's iframe only on a click.
The question was: can the Space Probe embed fit a phone and keep its click to load?
Yes in the build: no fixed width is left on the page; whether it plays well at phone width is the eye check still to come.

## Context
`pages/projects.md` drew a 540 × 380 px clickable `<div>` in inline styles, black with a neon green label from Slate, which swapped itself for itch.io's iframe on a click.
Below it, itch.io's 552 × 167 link card was a second fixed-width iframe.
Both ran off a phone's screen.

## Design
- **The placeholder is a `<button class="embed">`**, so a keyboard can start it; its `onclick` replaces it with `<iframe class="embed">` carrying the same itch.io source and a `title`.
- **One `.embed` rule in `assets/css/site.scss`** sets both to 100 % of the column at `aspect-ratio: 540 / 380`, with a `line` border on `bg`.
- **The label is in sage (`str`) on the background**, in the mono face, like the design canvas's card.
- **The itch.io link card is gone.** The sentence above it now links to the game's itch.io page; the repository stays linked once, in the closing paragraph.
- **VS-Siding and GD-SurvivalRts are listed below Space Probe.** VS-Siding links to its repository; GD-SurvivalRts is private and listed as work in progress, with no link or screenshots.
  Each has a `<!-- Tom: blurb -->` comment where its description goes.
- **The "Under reconstruction" banner is down**: the `.notice` paragraph in `_layouts/default.html` and its rule in `assets/css/site.scss`, since this was the last open proposal of the refresh.

## Alternatives considered
- **Loading the iframe on page load.** It pulls in the game for every visitor to the projects page.
- **A screenshot that links out.** It loses playing the game in place, which is the point of the page.
- **Linking VS-Siding's mod page as well as its repository.** One link was enough for now.
- **Screenshots of GD-SurvivalRts.** Left for when there are some worth showing.

## Consequences & open questions
- Whether the game plays at phone width is a matter for itch.io and Godot; the page only stops the frame overflowing.
- A screenshot behind the button would say more than a label, and needs one taken.
- The two new sections have no description until Tom writes them.
- `docs/proposals/` is empty: the site refresh the proposals described is done.
