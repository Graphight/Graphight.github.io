# Hero animation

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `hero-animation`, built locally with the `github-pages` gem and measured in headless Chrome (numbers under Consequences), with headless screenshots at 1280×800 and 390 wide; `docs/pages/clusters.html`, a study of six clustering animations drawn in an earlier Claude session; the Field boards of the design canvas drawn on 2026-10-14, where the severance and orbit variants were ported to a hero (link in decision `own-theme`); not yet checked by eye on a real phone or laptop, in either mode

## Summary
Behind the home page's name, a small neural net dissolves into points that are clustered by one of two animations, then plays back to the net; the two alternate each loop.
The question was: does a looping clustering animation behind the name say "ML and physics" without slowing the page or pulling the eye off the text?
Built; the page cost is small in the headless measurements, and whether it reads well is the eye check still to come.

## Context
The canvas first drew a particle field descending contour lines, meant to read as a loss landscape, a potential and isobars at once.
It read as weather.
`clusters.html` already has animations that read as machine learning: a net of five layers whose points resolve into clusters.
Decision `home-page` left the hero's right 57 % free for it.

## Design
- **One script, `assets/js/hero.js`, draws on one `<canvas>`** in the hero.
  `index.md` loads it with a `defer` script, so no other page loads it and it does not block first paint.
  The canvas is `aria-hidden`.
- **Colours are read from the CSS tokens**: stone is `--mute`, the net is `--dec` mixed with `--mute`, and the clusters take `--fn`, `--tag`, `--ty`, `--con`, `--str`, `--op` and `--kw`.
  Both modes work with no second palette.
  The script re-reads the tokens when the theme toggle is used and when the OS mode changes.
- **The net is 40 points in five layers of 6, 9, 10, 9 and 6.**
  Row spacing is scaled so the 10-point layer fits; the study's 0.115 spacing would overflow.
- **A loop is 32 s**: 2.5 s for the net to dissolve, 8.5 s for the algorithm, 5 s held at the end, 11 s back as an exact mirror, 5 s held at the net.
  The algorithm eases half linear and half smoothstep, so the middle of the run is not rushed.
- **Severance and orbit alternate**, and each loop reseeds at the net, where every seed looks the same, so the switch is never seen.
  Severance grows a minimum spanning tree across every point, cuts its two longest edges, and lets the three pieces drift apart.
  Orbit turns each cluster into a small system of points circling a centre.
  Orbit keeps turning through both holds, as in the study.
- **A caption button at the hero's bottom right names the running variant.**
  A click restarts the loop at the net with the other variant.
  It is hidden until the script runs, the same pattern as the theme toggle, so a visitor without JavaScript sees no dead button.
  Its text is the variant name only.
- **The loop clock only advances while running**, so a pause does not make the animation jump on resume.
  It pauses when the tab is hidden and when the canvas is out of view.
- **Reduced motion is read once at load.**
  The script then draws one finished frame and does not start the loop; the caption still switches the variant, and redraws that frame.
- **The canvas fills the hero, and the net is drawn on a centred square inside it**, so it never stretches.
  Sizes scale by the square's side over 250, clamped to between 1 and 2.
  The text carries a soft glow in the background colour so lines passing behind it stay legible.

## Alternatives considered
- **The particle field over contour lines.** It over-indexed on weather.
- **A collage of the owner's interests**: a net, a planet, a weather map. Busier, and harder to read at a glance than one motif.
- **Lloyd, agglomerative, repel and islands**, the study's other four. Drawn for a spinner; severance and orbit have the most movement at hero size.
- **A 10 s hold at each end.** Too long once the loop was slowed.
- **A front-matter flag or an include to load the script.** One page uses it, so `index.md` carries the script tag.

## Consequences & open questions
- **Measured in headless Chrome on a laptop**, through the DevTools protocol, with CPU throttling at 4×, the home page served from `_site` by `python3 -m http.server`.
  After 3 s of load, `Performance.getMetrics` was read, then 10 s later again; the figures are script seconds and task seconds per wall second.
  At 1280×800 with the hero in view: 0.018 script and 0.051 task.
  At 390×844 at 3× scale, mobile emulation, in view: 0.017 script and 0.049 task.
  With the hero scrolled out of view, over 10 s: 0.000 script and 0.000 task at 1280×800, 0.000 script and 0.001 task at 390 wide.
  So about 5 % of one throttled core while animating, and none while paused.
- **What the numbers do not show.**
  Headless Chrome painted at about 60 frames per second here, which may differ from a real display; the throttle is a multiplier on this machine's CPU, not a measured phone; and paint and compositing cost outside the page's own tasks, and battery, were not measured.
- **Page load.**
  `hero.js` is 10,287 bytes raw and 4,231 gzipped, in 235 lines against the proposal's guess of about 250.
  It is loaded with `defer`.
  A load time before and after was not measured.
- **On a phone the net overlaps the text.**
  In the 390-wide screenshot the net sits in the top half of the hero and passes behind the kicker and the name, because the hero's text is vertically centred in its 580 px minimum height.
  The glow keeps the text legible, but "away from the text" is not met on a phone.
  Moving the text to the bottom of the hero on a phone, or shrinking the canvas region, are the knobs.
- At 1280×800 the net sits in the right of the hero, clear of the text.
- At hero size the net may still read as sparse; point count, line weight and region are the knobs.
- The reduced-motion preference is read once at load; a change while the page is open is not followed.
- In orbit the clusters keep turning through both holds, as in the study; whether a hold should stop it dead is open.
- The article band is still not animated; whether it shows a still frame is open, since motion beside text is distracting and the band scrolls away quickly.
- The caption shows the variant name only, so a visitor may not know it is a button.
- A whole loop is longer than many home-page visits, so most visitors see only the forward run.
- The script is the largest piece of code on the site, and the likeliest to break.
- The hero has not been checked by eye on a phone or a laptop, in either mode.
