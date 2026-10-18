# Prompt: ONNX Runtime GPU memory leak — article and upstream contribution

Context assembled 2026-08-19 from the Growth Journal (`2026/2026-08-02.md`) plus live checks against the `microsoft/onnxruntime` repo.
Everything marked VERIFIED was confirmed against GitHub on 2026-08-19.
Everything else came from the journal and should be re-checked against the internal post-mortem before publishing.

## What I want

Two deliverables, in this order:

1. **An upstream comment** on the open ONNX Runtime issue, contributing the Python/FastAPI reproduction and the release status.
2. **An article for my personal website** on the debugging process — the method, not the war story.

The article is the lower priority of the two but the one I care more about, so do the upstream comment first and quickly.

## The incident

On 2026-07-29 I deployed a fleet of GPU inference services onto a new base image, as part of a CUDA 12 → CUDA 13 and Python 3.10 → 3.12 migration.
The migration was required because outstanding torch and onnxruntime CVEs were hard-capped by the old base image: torch's default wheels had moved to CUDA 13, and the only CUDA 13 `onnxruntime-gpu` build had dropped Python 3.10 entirely.
Neither axis could move alone.

The deploy went badly for reasons that turned out to be mostly unrelated (AWS `insufficient_capacity` refusing 11 node launches, plus a concurrent node roll from another team).
But in the middle of the fallout I noticed something that was not deploy churn: one service was climbing at a steady 600 MiB/hour, linearly, all day.
A steady linear climb is not rollout noise.
A colleague independently corroborated it within minutes — two services, likely GPU co-tenants, growing linearly from ~40% to ~55% over about ten hours, never levelling off.

## The investigation — three experiments

This is the spine of the article. The sequence matters more than the conclusion.

**1. Is it the image?**
Measured cold GPU footprint on both the old and new images.
Byte-identical: 848 MiB.
So the new image does not itself allocate more, and "the new image is bigger" is dead as an explanation.

**2. What does the growth actually track?**
Established that memory growth tracked the number of *distinct threads that had run inference*, not concurrent request volume.
This is the finding that reframes the whole problem.
It rules out "the service is just busy" and points directly at per-thread allocation that is never reclaimed.

**3. Falsify the obvious fix.**
If it were a concurrency problem, reducing concurrency should mitigate it.
Reduced concurrency via semaphore tuning.
It did not help.
The obvious remedy was dead, which confirmed the allocation was per-thread-lifetime rather than per-in-flight-request.

## The mechanism

ORT 1.27 allocated memory-pattern blocks against a dummy root stream instead of the real per-device stream.
The stream-aware BFC arena therefore never marked those chunks reusable on cleanup.
Every worker thread that ran inference left one behind permanently.
FastAPI dispatching a synchronous endpoint into its default 40-thread `anyio` pool is what turned a per-thread leak into unbounded growth in practice.

The defect had shipped for three minor versions upstream with no release note describing it.

## Upstream state (VERIFIED 2026-08-19)

- **Issue [#29351](https://github.com/microsoft/onnxruntime/issues/29351)** — OPEN. Filed 2026-06-27 by `roytmana`, 10 comments. Title: "[Java] Multiple CUDA sessions cause unbounded GPU memory growth; shared-allocator fix (CreateAndRegisterAllocatorV2 / OrtArenaCfg) not exposed in the Java API". Note it is scoped to the **Java** API.
- **PR [#29589](https://github.com/microsoft/onnxruntime/pull/29589)** — MERGED 2026-07-30 by `skottmckay` into `main`. Title: "Fix usage of stream for memory pattern allocation with arena". Body: "Use real stream for memory pattern block allocation so that the cleanup of chunks from the arena correctly marks it as unused." Links #29351 as motivation.
- **Merge commit `7e2f3b930977e17fd92a419464064890af6fcf59` is an ancestor of tag `v1.29.0`** (released 2026-08-12). Compare against v1.29.0 returns ahead 0 / behind 102.
- **It is NOT in the 1.28.x line.** Compare against v1.28.1 (released 2026-08-18) returns "diverged". A patch bump will not pick it up; the upgrade has to be to 1.29.0 or later.

### What this means

The fix merged one day after my incident and shipped while I was on leave.
I did not drive it and must not imply that I did.
My contribution is an independent root-cause of a defect that had no release note, arrived at from the outside.

## The upstream comment — what to write

Do **not** open a new issue. The bug is known and the fix is merged; a new issue would be a duplicate.

Comment on the existing open issue #29351 instead. The gap worth filling is that the issue is titled and scoped to the **Java API**, and my manifestation is Python + FastAPI + `anyio`.
Same root cause, different surface, and people still subscribed to that thread will not know their case is covered.

The comment should cover:

- The Python/FastAPI/`anyio` thread-pool manifestation, briefly.
- The three measurements, because they are what makes a report actionable: byte-identical cold footprint, growth tracking distinct inference threads rather than concurrent load, and semaphore-based concurrency reduction failing to mitigate.
- That #29589 appears to resolve it and shipped in **1.29.0**, not in 1.28.x.

**Before posting**: I need to actually verify 1.29.0 fixes it in our environment rather than asserting it from commit ancestry.
Ask me whether I have done that. If I have not, either soften the claim to "commit ancestry suggests it is in 1.29.0, I have not yet confirmed empirically" or wait until I have tested it.

Keep it short and factual. No preamble, no thanks-for-the-great-library throat-clearing.

## The article — what I want it to be

The subject is **the method**, not the incident.
Hypothesis, controlled measurement, falsification, mechanism.
The interesting move is experiment 2 — separating thread-count from load — because that is what turns a vague "it grows" into a specific claim you can chase into someone else's C++.

What I want the reader to take away: when a number climbs, do not guess at causes.
Find the variable it actually tracks.

Things to get right:

- Lead with the concrete curve (600 MiB/hour, linear, never levelling off), not with an abstract statement about debugging.
- Explain the BFC arena and memory patterns in plain language before naming them. A reader who has never touched ONNX Runtime should follow the mechanism.
- The FastAPI 40-thread `anyio` default is a genuinely useful warning in its own right and worth its own short section — a per-thread leak is invisible until something silently gives you forty threads.
- Be honest that the fix was already in flight upstream when I found it. That is a better story, not a worse one: it says the diagnosis was independently correct.

## Constraints

**Voice.** My register: no contractions, plain and direct, no AI-isms ("delve", "moreover", "it is worth noting", "in today's fast-paced").
Do not write marketing copy. Grep the draft for contractions before handing it over.

**Employer material — this is the important one.**
This is an internal production incident at my employer.
Before anything is published, strip or generalise: internal service names, repository names, Jira ticket IDs, Confluence links, colleague names, and any quoted Slack.
The technical content (ORT, BFC arena, FastAPI, the measurements) is fine; the operational specifics are not.
Flag anything you are unsure about rather than deciding for me.

I also need to clear the article with my team lead before publishing.
Remind me of this at the end of the draft. Do not let me forget it.

**Attribution.**
The internal post-mortem for this incident is authored by my team lead; I ran the investigation and handed over notes.
The experiments and findings are mine to describe. The document is not mine to quote or reproduce.

## What I still need to supply

Ask me for these rather than inventing them:

- The actual memory graphs or measurement numbers, if I want figures in the article.
- Whether 1.29.0 has been tested in our environment yet.
- Whether the internal post-mortem appendix documenting my method has been written yet (separate task, agreed with my lead).
