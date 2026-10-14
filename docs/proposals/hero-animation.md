# Hero animation

- Status: Draft
- Created: 2026-10-14
- Reflects: `docs/pages/clusters.html`, a study of six clustering animations drawn in an earlier Claude session; the Field boards of the design canvas drawn on 2026-10-14, where its severance and orbit variants were ported to a hero, watched and retimed by eye over four rounds (link in the theme proposal); not built, and nothing measured

## Summary
Behind the home page's name, a small neural net dissolves into points that are clustered by one of two animations, then plays back to the net; the two alternate each loop.
The question: does a looping clustering animation behind the name say "ML and physics" without slowing the page or pulling the eye off the text?

## Context
The canvas first drew a particle field descending contour lines, meant to read as a loss landscape, a potential and isobars at once.
It read as weather.
`clusters.html` already has animations that read as machine learning: a net of five layers whose points resolve into clusters.

## Design
First guesses, each to be checked by eye on a phone and a laptop.

- **Two variants from the study, severance and orbit.**
  Severance grows a minimum spanning tree across every point, cuts its two longest edges, and lets the three pieces drift apart.
  Orbit turns each cluster into a small system of points circling a centre, and keeps turning.
- **They alternate**, and each loop reseeds, at the net, where every seed looks the same, so the switch is never seen.
- **A loop is 32 s**: 11 s forward (2.5 s for the net to dissolve, 8.5 s for the algorithm), 5 s held at the end, 11 s back as an exact mirror, 5 s held at the net.
  The algorithm eases half linear and half smoothstep, so the middle of the run is not rushed.
- **The net is 40 points in five layers (6, 9, 10, 9, 6)**, up from the study's 24, so it fills a hero.
- **It draws in the right 57 % of the hero on a laptop and the top half on a phone**, away from the text, which also carries a soft glow in the background colour.
- **The caption at the hero's corner names the running variant** and is a button that switches to the other.
- **Colours come from the mode's palette**: the cluster colours are Warm Burnout's accents, the net is brass mixed with stone.
- **One script, `assets/js/hero.js`, on one `<canvas>`**, loaded only on pages that ask for it.
- **It pauses** when the tab is hidden or the hero is scrolled out of view, and **draws one finished frame** under `prefers-reduced-motion`.

## Alternatives considered
- **The particle field over contour lines.** It over-indexed on weather.
- **A collage of the owner's interests**: a net, a planet, a weather map. Busier, and harder to read at a glance than one motif.
- **Lloyd, agglomerative, repel and islands**, the study's other four. Drawn for a spinner; severance and orbit have the most movement at hero size.
- **A 10 s hold at each end.** Too long once the loop was slowed.

## Consequences & open questions
- The script is about 250 lines, the largest piece of code on the site, and the likeliest to break.
- Its cost on a phone's CPU and its effect on page load are unmeasured; both are checked before this graduates.
- At hero size the net may still read as sparse; point count, line weight and region are the knobs.
- In orbit the clusters keep turning through both holds, as in the study; whether a hold should stop it dead is open.
- Whether the article band animates too, or shows a still frame, is open: motion beside text is distracting, and the band scrolls away quickly.
- A whole loop is longer than many home-page visits, so most visitors see only the forward run.
