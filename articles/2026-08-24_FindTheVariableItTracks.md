---
layout: article
title: "Find the variable it tracks"
date: 2026-08-24
author: Tom Marsh
published: false
---

<!--
OUTLINE ONLY. Rewrite in your own words.
Full facts, numbers, attribution and constraints: docs/article-notes/find-the-variable-it-tracks.md
`published: false` keeps this off the site; remove it (and fix the date and filename) when it is ready.
Clear with your team lead before publishing.
-->

## Opening: the curve

- Lead with the concrete curve, not a statement about debugging: 600 MiB/hour, linear, about 40% to 55% of the card over ten hours, never levelling off.
- Shape reasoning: churn is spiky and recovers, a warming cache flattens, a straight line is something handed out and never returned.
- Set up the trap: a forced CUDA 12 to 13, Python 3.10 to 3.12 migration (CVE-driven, both axes at once) made the new image the obvious suspect. A story, not a measurement.
- Suggestion: keep the migration context to two or three sentences; it is setup, not subject.
- **Animation:** three curves on one axis (sawtooth churn, decelerating cache, straight line), drawn over time, with "which one is the leak?" Static fallback: the three as a small multiple.

## Experiment 1: is the image simply bigger?

- Cold footprint byte-identical: 848 MiB on both.
- Old image converges by batch 2; new grows about 4 MiB per batch, no plateau over 5,120 messages.
- Idle check: 150 s of zero traffic, zero movement. It is the request path.
- Keep the table; keep the caveat that figure 1 compares the old image's harshest setting with the new image's gentlest. Slope, not level.
- **Animation:** figure 1 as a scrubber over requests 0 to 500; the old line goes flat at request 52 while the new one keeps stepping.

## Experiment 2: what does the growth track?

- The heart of the article. Give it the most room.
- A colleague's proposed mechanism (stream-private chunks) and its prediction (fewer concurrent calls, smaller leak).
- Two sweeps: semaphore count and client concurrency. Each image climbs on the axis the other ignores.
- The punchline: threads, not concurrent runs. Sixteen threads alone cost more than eight threads four at a time.
- The direct-session probe that "failed" to reproduce was the thread axis reading zero. Nice beat: a null result that was really a data point.
- Suggestion: say plainly that the mechanism survived and the prediction died. That distinction is the method.
- **Animation (centrepiece):** a toggle between "vary semaphore" and "vary concurrency" that redraws the bars for both images, so the crossing is something the reader does rather than reads. Static fallback: figure 2.

## Experiment 3: the obvious fix, falsified

- Semaphore to 1: +200 against +232 MiB, inside the plus or minus 25% noise.
- Keep it short; it is experiment 2 read from the other side.
- Suggestion: mention the noise band explicitly, because "it went down a bit" is exactly the result people over-read.

## Experiment 4: measure the thing directly

- New since the first draft, and it closes the old "what I did not establish" gap.
- Probe: concurrency fixed at 1, vary only retired threads. 1.27.0: +312 to +332 MiB over 400 threads. 1.29.0: within +4 MiB.
- The 1.29.0 release notes say nothing about the fix, so the probe is the only evidence it is there. Do not take a version number's word for it.
- Optional box: how to measure GPU memory honestly (per-process table, not device total; diff to find your own PID; warm baseline; three runs; check for CPU fallback).
- **Animation:** two counters side by side, threads retired against MiB, for 1.27.0 and 1.29.0. One climbs, one does not.

## The mechanism, in plain language

- Explain the pool, stream-awareness, and memory patterns before naming the BFC arena.
- The bug: blocks tagged with a placeholder stream; cleanup looks for the real stream; the blocks are never marked reusable.
- Keep the cloakroom analogy: a coat checked under a ticket number nobody issued.
- Verify the thread-to-stream link against the ORT source before stating it as fact (see notes, "Weakest link").
- **Animation:** the cloakroom. Each thread hangs a coat; tickets that match get collected at cleanup; the mismatched ones stay on the rail.

## The forty threads you did not ask for

- `def` instead of `async def` sends the endpoint to anyio's forty-thread pool. Nobody chose forty.
- **Correction to the first draft:** forty threads alone would plateau. anyio retires a worker after 10 s idle and starts a fresh one, so a day of bursty traffic runs through an unbounded number of distinct threads. That is what makes the line straight. It is also why a short staging soak missed it: a soak measures time, the leak tracks thread turnover.
- The semaphore is the knob labelled concurrency, and it sits one layer below the real lever (`current_default_thread_limiter().total_tokens`).
- Throughput flat at about 150 req/s regardless of concurrency; extra concurrency bought queueing, paid in memory.
- Worker recycling off; a request limit turns a climb into a sawtooth.
- Optional, ask first (a colleague's measurement): sync health checks starve behind the same pool and get pods restarted.
- **Animation:** a door with a semaphore of 2 and a queue of threads behind it. Threads go through, hang a coat, idle out after 10 s, and are replaced by new threads. Slider for traffic burstiness; the coat count climbs while "threads alive" never exceeds forty.

## The fix was already in flight

- Upstream PR #29589 merged one day after the incident; shipped in 1.29.0, not in 1.28.x (still true as of 1.28.3).
- No release note in three minor versions.
- Be plain that you did not drive the fix. Independent agreement is the better story.
- The interim workaround (disable memory patterns) and the version-floor test that stops a downgrade from silently restoring the leak.

## What is still open

- The residual slow climb at concurrency 1. Unexplained; say so.
- Production thread churn was inferred, not measured. The two-line check: log thread id per inference, count distinct.
- Suggestion: keep this section. Being clear about the limits is worth more than the tidy version.

## Close

- One line: when a number climbs, do not guess at causes. Find the variable it actually tracks.
- Suggestion: do not summarise the article; end on the line.
