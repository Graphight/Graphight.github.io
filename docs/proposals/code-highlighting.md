# Code highlighting

- Status: Draft
- Created: 2026-10-14
- Reflects: the article boards of the design canvas drawn on 2026-10-14 (link in decision `own-theme`), where a Python block was coloured by hand in Warm Burnout's roles; the two articles in `articles/`, read at `29cacb4`; not built

## Summary
Fenced code is coloured by Rouge's classes mapped onto Warm Burnout's syntax roles, in one partial stylesheet.
The question: can Rouge's token classes map onto Warm Burnout's roles closely enough that a code block reads like the editor theme?

## Context
GitHub Pages highlights fenced code with Rouge, which wraps tokens in short classes (`.k`, `.nf`, `.s`, `.c` and dozens more).
Slate supplies their colours today, so they go when the theme does.
Both articles carry Python, and the ML systems guide has a directory tree in a plain block.

## Design
First guesses, each to be checked on the two articles as they stand.

- **One partial, `_sass/_syntax.scss`**, maps Rouge's classes onto the roles Warm Burnout names: keywords burnt orange, functions amber, types and classes steel blue, strings dried sage, numbers and constants dusty mauve, decorators gold, comments warm stone, operators the operator orange.
- **A code block is always dark**, in both modes, with a `surface` panel and a `line` border.
  On the canvas a dark block on the light page read as deliberate, and it keeps the AAA dark palette for every token.
- **A label above the block shows the language**, from Rouge's `language-*` class, in mono.
- **Inline code is terra cotta on `surface`**, so it is told apart from a link.

## Alternatives considered
- **Light code blocks in light mode.** The light variant is AA, not AAA, and a light block on a light page loses its edge.
- **A client-side highlighter** (Prism, highlight.js). It adds a script to every article for what Rouge already does at build time.

## Consequences & open questions
- Which class Rouge's Python lexer gives a decorator, and so whether `@dataclass` comes out gold, is unchecked.
- A filename in the label needs a per-block attribute (kramdown's `{: data-file="…"}`), which nothing sets today.
- Line numbers are not proposed.
