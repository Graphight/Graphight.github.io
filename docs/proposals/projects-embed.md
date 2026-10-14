# Projects embed

- Status: Draft
- Created: 2026-10-14
- Reflects: `pages/projects.md`, read at `29cacb4`; the projects card on the Field home board of the design canvas (link in the theme proposal); not built

## Summary
The Space Probe embed scales to its column, and keeps loading only on a click.
The question: can the Space Probe embed fit a phone and keep its click to load?

## Context
`pages/projects.md` draws a 540 × 380 px placeholder in inline styles, black with a neon green label, that swaps itself for itch.io's iframe on a click.
At a fixed 540 px it runs off a phone's screen, and its colours belong to Slate, not to Warm Burnout.
The second iframe, itch.io's 552 × 167 link card, is fixed too.

## Design
First guesses, each to be checked on a phone and a laptop.

- **The placeholder is a button**, not a clickable `<div>`, so a keyboard can start it, styled by the stylesheet rather than inline.
- **It and the iframe it becomes keep a 540 : 380 aspect ratio at 100 % of the column.**
- **The label is in sage on the background colour**, like the canvas's card.
- **The itch.io link card is replaced by a plain link** to the game's page and to its repository.

## Alternatives considered
- **Loading the iframe on page load.** It pulls in the game for every visitor to the projects page.
- **A screenshot that links out.** Loses playing it in place, which is the point of the page.

## Consequences & open questions
- Whether the game itself plays at phone width is itch.io's and Godot's matter, not the page's; the page only stops the frame overflowing.
- A screenshot behind the button would say more than a label, and needs one taken.
