# Code highlighting

- Status: Accepted
- Created: 2026-10-14
- Reflects: branch `code-highlighting`, built locally with the `github-pages` gem (Rouge 3.30.0) and checked by eye in headless Chrome on `articles/2025-12-10_BundleYourColumnNames` in both modes; proposal `code-highlighting`

## Summary
Fenced code is coloured by Rouge's token classes mapped onto Warm Burnout's syntax roles, in one partial, `_sass/_syntax.scss`.
The question was: can Rouge's token classes map onto Warm Burnout's roles closely enough that a code block reads like the editor theme?
Yes for keywords, functions, types, strings, numbers, comments and operators; not for Python decorators, which Rouge 3.30 does not tag as decorators.

## Context
GitHub Pages highlights fenced code with Rouge, which wraps tokens in short classes (`.k`, `.nf`, `.s`, `.c` and dozens more).
Slate supplied their colours, so since `own-theme` a block was plain `fg` on `surf`.
The built articles hold three Python blocks and one plaintext block, the directory tree.

## Design
- **One partial, `_sass/_syntax.scss`**, imported at the end of `assets/css/site.scss`.
  Keywords (`.k .kd .kn .kp .kr .kv .ow`) are `kw`; functions and builtins (`.nf .fm .nb`) `fn`; types (`.nc .kt .bp`) `ty`; strings `str`; numbers and constants (`.m*`, `.il .kc .no`) `con`; decorators (`.nd`) `dec`; comments `mute` in italic; operators (`.o`) `op`.
  Punctuation and plain names stay `fg`.
- **A code block is always dark.** `div.highlighter-rouge` applies the `dark` mixin, so the block's custom properties, and every token colour read from them, take their dark values on a light page.
  Inline code is `code.highlighter-rouge`, not a `div`, so it keeps the page mode's terra cotta (`tag`) on `surf` from `own-theme`.
- **A tab above the block carries the language name**, in mono `mute` on `surf`, joined to the block by squaring its top-left corner.
  The tab is drawn inside the dark scope; a bare label would be dark-mode `mute` on the light page, about 2:1.
  CSS cannot read a class name into `content`, so the languages are a Sass list; today it holds `python`, and plaintext blocks have no tab.
- **Comments are JetBrains Mono's real italic**, loaded with the `ital` axis, not a slant the browser synthesises from the roman.

## Contrast
WCAG ratios for each token on the block's dark `surf` (`#221c15`); all meet AAA (7:1).

| Token | Ratio |
|-------|-------|
| `fg` | 8.97 |
| `mute` | 7.25 |
| `kw` | 7.43 |
| `fn` | 9.57 |
| `str` | 8.36 |
| `ty` | 7.23 |
| `con` | 8.11 |
| `tag` | 7.51 |
| `dec` | 9.86 |
| `op` | 7.50 |

## Alternatives considered
- **Light code blocks in light mode.** The light variant is AA, not AAA, and a light block on a light page loses its edge.
- **A client-side highlighter** (Prism, highlight.js). It adds a script to every article for what Rouge already does at build time.
- **A label read from the class by script.** It would cover every language with no list, at the cost of a script on every article for one word.

## Consequences & open questions
- Rouge 3.30's Python lexer emits `@dataclass` as an operator `@` (`o`) and a name (`n`), and `@classmethod` as `o` and a builtin (`nb`); its `Name::Decorator` rule is never reached.
  So decorators show an orange `@`, not gold, and the `.nd` rule applies only to lexers that emit `nd`.
- A new language in an article needs its name added to the list in `_syntax.scss` before its block gets a tab.
- A filename in the label needs a per-block attribute (kramdown's `{: data-file="…"}`), which nothing sets.
- Line numbers are not built.
- The phone-width check in headless Chrome showed the whole page clipped on the right, header included, which points at the headless window rather than this change; it has not been checked on a real phone.
