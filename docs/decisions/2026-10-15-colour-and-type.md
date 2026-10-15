# Colour and type

- Status: Accepted
- Created: 2026-10-15
- Reflects: branch `site-tweaks`, commits `5d2ed3a` to `0959ca0`, each built locally with the `github-pages` gem; looked at by eye in both modes on a laptop through `jekyll serve`, not yet on a phone; colours measured in OKLCH with a throwaway script (lightness, chroma, WCAG contrast, OKLab distance between simulation colours)

## Summary
Headings use the body face, the Warm Burnout accents are retuned per mode and kept in `_data/palette.yml`, and a Colours page shows them.
The question was: why did light mode look muddy next to dark mode, and can one palette file fix both modes and document itself?
Yes: every accent now clears its contrast floor, the closest pair of simulation colours is about four times further apart in light mode, and the stylesheet and the Colours page read the same file.

## Context
Bricolage Grotesque on headings read as a second, mismatched voice beside Atkinson Hyperlegible.
In light mode every Warm Burnout accent sat at OKLCH lightness 0.45 to 0.50 with low chroma, so on the cream background green read as olive, blue as slate and gold as brown.
Five of the eight accents (`tag`, `op`, `kw`, `fn`, `dec`) sat within 44° of hue at that lightness; the hero simulation colours its clusters from seven accents, so four clusters drew in near-identical browns (closest OKLab distance 0.018).
Dark mode separated the same hues by lightness, so the problem showed there less, but `ty` and `con` were close to grey (chroma 0.042 and 0.056).
The Space Probe embed loaded a game inside the page when the itch.io page plays it better.

## Design
- **One face for prose and headings.** Atkinson Hyperlegible sets headings, the site name and the stat numbers; Bricolage Grotesque is no longer requested from Google Fonts.
- **The site name is orange (`kw`) on the home page**, marked with `aria-current="page"` like the nav links.
- **Space Probe links to itch.io** instead of embedding the game; the `.embed` rules are gone. This replaces the embed in decision `projects-embed`.
- **Each mode keeps the dark palette's hues** so a colour reads as the same colour in both modes, and spreads the warm group: `tag` towards red, `fn` towards gold.
- **Lightness follows the job.** Colours set as text (`kw`, `tag`, `ty`, `con`) keep 4.5:1 against `bg`; colours drawn only as graphics (`str`, `fn`, `op`, `dec` in light mode) keep 3:1, which lets them be lighter and more vivid.
  Dark gold cannot be vivid in sRGB, which is why light `fn` is graphic-only and lighter.
- **Chroma is evened out** so no accent reads as grey beside the others; closest simulation pair: 0.018 → 0.071 in light mode, 0.039 → 0.066 in dark.
- **`_data/palette.yml` is the one source.** `site.scss` has front matter, so Liquid writes both mode mixins from the file; neutrals (`bg`, `surf`, `line`, `fg`, `hi`, `mute`) are unchanged.
- **`pages/colours.md` renders the same file**: each token, what it colours, and a sample on each mode's background with its hex and contrast ratio, computed in the browser from the hex.
  The footer links it as "Colours" in place of the Warm Burnout link; the credit moved onto the page.
- **The hero kicker is coloured** (`--kicker`: `con` in light, `fn` in dark) and **dates are `ty`**; the "What my work delivered" kicker and the stat numbers stay neutral, since the page already carried enough colour.

## Alternatives considered
- **A light-mode override per element** (`--stat`, `--date`, `--kicker` tokens over an untouched palette). Fixed the home page and left the simulation, links and timeline dots muddy.
- **Colouring the stat numbers green.** Tried and reverted: with the retuned palette the page had enough colour.
- **Storing contrast ratios in the data file.** Derived numbers in a hand-edited file go stale; the page computes them.
- **A dark-mode rose kicker to match light mode.** Left gold, since dark mode already looked right.

## Consequences & open questions
- Syntax highlighting in articles changes: code blocks always use the dark palette.
- The contrast table in decision `own-theme` lists the old values.
- The footer credits Warm Burnout only through the Colours page; the one sentence there is a placeholder.
- Neutrals were not retuned; the timeline spine (`line`) may still read faint in light mode.
- Headings keep `letter-spacing: -0.02em`, set for Bricolage; whether it suits Atkinson is unchecked.
- Not yet checked on a phone, including the Colours page grid at narrow widths.
