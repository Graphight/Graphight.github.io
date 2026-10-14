# Design docs

Notes on why the site is shaped the way it is, kept out of the published site (`_config.yml` excludes `docs/`).

- **`proposals/`**: an idea, not yet acted on. Mutable.
- **`decisions/`**: dated, what shipped or was deliberately rejected. Accepted decisions are immutable.
- **`pages/`**: the design pages a look was judged on: evidence, kept as drawn and not edited afterwards.

A proposal is sized to one session: pick one, build it on a branch, check it on a phone and a laptop, write the decision, delete the proposal.
It graduates by moving to `decisions/YYYY-MM-DD-topic.md` with its status set to `Accepted`.

## Conventions

- One file per idea: `proposals/topic.md`, no date; it gains one on graduation.
- Other docs cite a decision by topic alone, as `` decision `topic` ``.
- Status: `Draft` | `Accepted` | `Superseded by <topic>` | `Withdrawn`.
- `proposals/README.md` lists what is open, in build order.

## Template

```markdown
# Title

- Status: Draft | Accepted | Superseded by <topic> | Withdrawn
- Created: YYYY-MM-DD
- Reflects: <branch / commits / study / check this describes>

## Summary
One or two sentences: what this is, then the question it answers.

## Context
The problem and the constraints.

## Design
The decisions made and the why behind each.

## Alternatives considered
What was rejected and why.

## Consequences & open questions
What this enables, what it costs, what might bite later.
```
