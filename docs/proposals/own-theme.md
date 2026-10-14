# Own theme

- Status: Draft
- Created: 2026-10-14
- Reflects: a design canvas drawn on 2026-10-14 in a Claude session, five directions (Notebook, Editor, Index, Isobar, Field), each a home page and an article page with a dark and light toggle, judged by eye (link under References); the Warm Burnout palette at warmburnout.com; the repository read at `29cacb4`; not built

## Summary
The site leaves the Slate remote theme for its own layouts and one stylesheet built on the Warm Burnout palette, with a dark and a light mode.
The question: can the site drop Slate for its own layouts and one stylesheet of Warm Burnout tokens, in both modes, with nothing GitHub Pages cannot build?

## Context
`_config.yml` sets `remote_theme: pages-themes/slate@v0.2.0`.
The three layouts in `_layouts/` are already copies of Slate's, so the markup is owned and the look is not.
They lean on Slate in two places that break when it goes: `assets/css/style.css` is Slate's compiled stylesheet, and `_includes/head-custom.html` includes `head-custom-google-analytics.html`, which only Slate provides.
`{% seo %}` comes from `jekyll-seo-tag`, which the `github-pages` gem ships, so it survives.
Warm Burnout is an editor palette: it names syntax roles and two backgrounds, and has no surface, border or heading colour.

## Design
First guesses, each to be checked on a phone and a laptop.

- **Tokens are CSS custom properties on `:root`**, one set for dark and one for light, in `assets/css/site.scss`.
  The palette's own values are used as given: background `#1a1510` and `#f5ede0`, foreground `#bfbdb6` and `#3a3630`, and the eleven accents.
- **Three tokens are derived, not taken from the palette**: `surface` (`#221c15` / `#ebe1d0`), `line` (`#3a3027` / `#d6c8b2`) and `heading` (`#ece6da` / `#1f1b16`).
  They were picked by eye on the canvas and have not been contrast-checked.
- **The mode follows `prefers-color-scheme`**, and a toggle in the nav overrides it, kept in `localStorage`.
  A short inline script in `<head>` sets the mode before first paint, so a light-mode visitor never sees a dark flash.
- **Type is Bricolage Grotesque for headings, Atkinson Hyperlegible for prose and JetBrains Mono for code, dates and labels**, from Google Fonts at first.
- **Burnt orange is the link and action colour**; amber, sage and steel blue mark categories and never carry body text.
- **`interactive.css` maps its three widget variables onto the tokens**, so a widget in an article follows the mode.
- **Google Analytics is kept or dropped on purpose**: today the include resolves to Slate's, which does nothing unless `google_analytics` is set, and it is not set.

## Alternatives considered
Each was drawn on the canvas and set aside.
- **Notebook**: one serif column, closest to the site today. The safest and the most boring; it stays the fallback if Field cannot be made to work.
- **Editor**: the site as a Warm Burnout IDE, with a file tree, tabs and line numbers. Charming, and painful to read a whole article in.
- **Index**: an identity sidebar beside dense content. Built for a recruiter's skim, and its wide format wraps poorly on a phone.
- **Isobar**: a bold hero over generated contour lines. It became Field; the contours over-indexed on weather.
- **Keeping Slate and overriding its colours.** Slate's header, gradients and fonts are most of its look, so little would be left of it.

## Consequences & open questions
- The light accents only meet WCAG AA (4.5:1) on the light background, so small mono labels sit on the foreground or Warm Stone, not on an accent.
- The derived tokens need a contrast check before this graduates.
- Self-hosting the three fonts drops the Google Fonts request and costs about 200 KB in the repository; whether that is worth it is open.
- The site credits the palette in its footer; Warm Burnout is MIT licensed, so the credit is courtesy, not a condition.
- The favicon is still unset (`head-custom.html` has it commented out).

## References
- Design canvas: https://claude.ai/artifact/KKTSbesrW4Tg2kGQQs66yN
  The link is private to one account, and its boards need the canvas's runtime to draw, so they are not kept in `docs/pages/`.
- Warm Burnout: https://warmburnout.com/
