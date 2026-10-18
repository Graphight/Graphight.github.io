# Article notes: Find the variable it tracks

- Status: Working notes for a rewrite
- Created: 2026-10-18
- Article: `articles/2026-08-24_FindTheVariableItTracks.md` (reduced to an outline, `published: false`)

## Read this first

These notes are for a Claude session on Tom's personal laptop, helping him rewrite this article in his own words.
That session has no access to the work machine, the employer's repositories, the internal post-mortem, or the work journal.
Everything needed is here; treat it as the whole record and do not invent anything beyond it.

This repository is public on GitHub, and `docs/` is excluded from the Jekyll build but still readable on GitHub.
So these notes are already generalised: no employer service names, colleague names, ticket IDs, internal links, or quoted chat.
Keep it that way when editing them.
Operational details of the incident (fleet layout, alerting, severity, contributing factors) were deliberately left out; if the article needs any of them, ask Tom.

Tom is writing the prose himself.
Help with structure, fact-checking against these notes, plain-language explanations, and the interactive figures; do not write finished paragraphs unless he asks.

## Ground rules

**Subject.** The article is about the method, not the incident: hypothesis, controlled measurement, falsification, mechanism.
The thesis line: when a number climbs, do not guess at causes; find the variable it actually tracks.
The interesting move is separating thread count from load, because that is what turns "it grows" into a specific claim you can chase into someone else's C++.

**Voice.** Tom's register: no contractions, plain and direct, no AI-isms ("delve", "moreover", "it is worth noting", "in today's fast-paced").
No marketing copy.
Grep any draft for contractions before handing it back.
Tom's general rule for shared writing: no personification of systems (they do not lie, want, refuse, or admit); name the mechanism instead.

**Employer material.** This was an internal production incident at Tom's employer.
Before publishing, strip or generalise internal service names, repository names, ticket IDs, internal doc links, colleague names, and any quoted chat.
The technical content (ONNX Runtime, the BFC arena, FastAPI, anyio, the measurements) is fine.
Flag anything uncertain to Tom rather than deciding for him.

**Clearance.** Tom must clear the article with his team lead before publishing.
Remind him at the end of every draft review. Do not let him forget it.

**Attribution.**
- The experiments and findings are Tom's to describe.
- The internal post-mortem was written by his team lead from Tom's handed-over notes; it is not Tom's to quote or reproduce.
- A colleague read the ORT source and proposed the stream-private-chunks mechanism (see experiment 2); credit "a colleague", unnamed.
- The interim mitigation (disabling memory patterns) was shipped by a colleague while Tom was on leave.
- The upstream fix was written and merged by an ONNX Runtime maintainer, one day after the incident. Tom did not drive it and must not imply he did. His contribution is an independent root cause, reached from the outside, for a defect with no release note.

## Timeline

| Date | Event |
|---|---|
| 2026-06-27 | Upstream issue [onnxruntime#29351](https://github.com/microsoft/onnxruntime/issues/29351) filed (Java API, multiple CUDA sessions, unbounded GPU growth). |
| 2026-07-28 | Tom's migration merged: CUDA 12 to 13, Python 3.10 to 3.12, `onnxruntime-gpu` to 1.27.0, about a dozen GPU inference services. |
| 2026-07-29 | Rollout. Amid unrelated deploy trouble, one service climbs linearly at about 600 MiB/hour. Rolled back. |
| 2026-07-29 to 30 | Tom runs the experiments below and hands findings to his team lead. |
| 2026-07-30 | Upstream fix [onnxruntime#29589](https://github.com/microsoft/onnxruntime/pull/29589) merged. |
| 2026-07-31 | Colleague ships the mitigation: `enable_mem_pattern = False`. Tom is on leave for about two weeks from here. |
| 2026-08-12 | ONNX Runtime 1.29.0 released, containing the fix. Its release notes do not mention it. |
| 2026-08-24 | First draft of this article (the date in the filename; change it on publish). |
| 2026-08-26 | Tom bumps to 1.29.0, proves the fix with a per-thread probe, removes the mitigation, adds a version-floor test. |
| 2026-08-31 | Tom ships request-batch caps and chunked forward passes (a separate arena problem; possible sequel). |
| 2026-10-18 | Upstream state re-verified (see below). |

## Why the migration happened

Outstanding CVEs in `torch` and `onnxruntime` could not be closed on the old base image.
`torch` had moved its default wheels to CUDA 13, and the only CUDA 13 `onnxruntime-gpu` build had dropped Python 3.10.
Neither axis could move alone, so both moved at once.
That made the new image the obvious suspect, which is the setup for the article: an obvious suspect and a bad reason to trust it.

## The symptom

- About 600 MiB per hour, linear, all day.
- Roughly 40% to 55% of the card over about ten hours, never levelling off.
- A colleague independently saw the same shape on two services within minutes.
- Shape reasoning, worth keeping in the article: rollout churn is spiky and comes back down; a warming cache decelerates and flattens; a straight line that does not bend is something handed out and never given back.

## The experiments, with every number

### Experiment 1: is the new image simply bigger?

Same node type, same model, byte-identical 64-message batches, per-process readings.

| batches | old image | new image |
|---|---|---|
| cold | 848 MiB | 848 MiB |
| 2 | 938 MiB | 952 MiB |
| 15 | 938 MiB | 1,134 MiB |
| 80 | not run | 1,218 MiB, still climbing |

- Cold footprint byte-identical, so "the new image allocates more at load" is dead.
- Old image converges by batch 2. New image grows about 4 MiB per batch with no plateau across 5,120 messages.
- Idle check: 150 seconds, zero traffic, zero MiB of movement. No timer, background thread, or logging buffer; it is the request path.

Figure 1 (`resources/onnx-fig1-convergence.svg`): per-process memory across 500 identical requests, batch size 1.
Old image flat at about 938 MiB from request 52; new image still stepping at request 500.
Important caveat already in the draft caption: this pits the old image at its most aggressive concurrency setting against the new image at its gentlest, so level is not the point; slope is.
The SVG holds the only copy of that series; extract the path if the figure is redrawn.

### Experiment 2: what does the growth track?

A colleague read the ORT 1.27 source and proposed: a CUDA stream that cannot find a free chunk of its own extends the arena rather than borrowing from another stream, so chunks become stream-private and are never shared back.
Prediction: capping concurrent inference calls should shrink the leak.
The service already had that cap, a semaphore around the inference call.

Harness: 500 requests, batch size 1, identical payload, cold process per cell.

Axis 1, semaphore count, client concurrency held at 8:

| semaphore count | old image | new image |
|---|---|---|
| 1 | +26 MiB | +200 MiB |
| 2 (production) | +48 MiB | +232 MiB |
| 4 | +90 MiB | +230 MiB |
| spread | 3.5x | 1.15x |

Axis 2, client concurrency, semaphore count held at 2:

| concurrency | old image | new image |
|---|---|---|
| 1 | not run | +92 MiB |
| 2 | not run | +158 MiB |
| 4 | not run | +178 MiB |
| 8 | +48 MiB | +188 MiB |
| 16 | +48 MiB | +286 MiB |
| spread | 1.0x | 3.1x |

Run-to-run variance on the new image is about plus or minus 25%, so adjacent steps mean nothing; the crossed pattern between the axes is the result.
(The current draft prints axis 2 with the columns in the opposite order to axis 1; keep them consistent.)

Reading:
- Each image climbs on the axis the other ignores.
- Old image: grows with calls in flight at once, then stops.
- New image: grows with the number of distinct threads that have entered inference, and does not stop.
- The semaphore caps how many calls are inside inference at once; it says nothing about how many different threads take turns.
- Sixteen threads each running strictly alone: +286 MiB. Eight threads allowed four at a time: +230 MiB. Threads, not concurrent runs.
- This keeps the colleague's mechanism (stream-private chunks) and kills its prediction (the independent variable is threads, not concurrency).

It also explains an earlier apparent dead end: driving an inference session directly, one call at a time, did not reproduce the leak (flat from request 25 to 500 on the leaking image).
That was the thread axis reading zero: one thread, nothing to accumulate.

### Experiment 3: falsify the obvious fix

Proposed mitigation: semaphore to 1.
Result: +200 MiB against +232 MiB at the production setting, inside the plus or minus 25% noise.
Same finding as experiment 2, read from the other direction.

### Experiment 4 (new since the draft): the direct per-thread measurement

The first draft admitted the per-thread mechanism was an inference, never measured directly.
That gap is now closed.
On 2026-08-26 Tom wrote a probe that holds concurrency at 1 and varies only the number of retired threads (threads created, used for inference, then finished).
Growth with only one inference in flight at any moment rules out load as the cause.

| configuration | growth over 400 retired threads |
|---|---|
| ORT 1.27.0, memory patterns on (three runs) | +312, +316, +332 MiB |
| ORT 1.29.0 | within +4 MiB |
| second service on a Hugging Face Optimum pipeline, 1.27.0 | +12, +12, +10 MiB |
| same, 1.29.0 | +0.0 MiB |

Also confirmed: 1.29.0 was really running on the GPU, not silently falling back to CPU (CUDA first in `session.get_providers()`, 2.11 ms per inference against 161.71 ms CPU-only in the same pod).
Because the 1.29.0 release notes are silent on the fix, this probe is the only evidence the fix is present.
That is a good beat for the article: do not take a version number's word for it.

Roughly 0.8 MiB per retired thread on 1.27.0.

### Measurement lessons from building the probe

Each of these was learned the hard way and is worth a short "how to measure GPU memory honestly" box or section:

- **Use the per-process table, not the device total.** `nvidia-smi --query-compute-apps=pid,used_memory`, never `--query-gpu=memory.used`. The GPUs were shared between several services by time-slicing, which does not partition memory, so the device total is every tenant's sum.
- **Find your own process by diffing.** Inside a container, `nvidia-smi` reports host PIDs, so `os.getpid()` never matches. Snapshot the compute-apps table, create the CUDA context, snapshot again, and take the new entry. If it cannot be identified, report nothing rather than falling back to the device total.
- **Measure above a warm baseline, not from cold peaks.** Cold to plateau is about 10%, and baselines drifted between runs (840, 848, 876, 904, 908 MiB seen), enough to fake an effect.
- **Run leak cells three times.** They swing about 25%. Arena-sizing cells, by contrast, were bit-identical across runs.
- **A flat line can mean CPU fallback.** Check the providers list and the latency.
- **Set thread count directly, not through HTTP**, so keepalive behaviour cannot blur what "400 threads" means.

## The mechanism

Plain language first (the article should do this before naming anything):
- ONNX Runtime does not call the GPU allocator for every tensor. It keeps a pool: take a block, use it, hand it back, and the pool marks it free.
- The pool is stream-aware: it records which CUDA stream a block belongs to so it does not hand one stream's memory to another mid-flight.
- ORT precomputes a "memory pattern", a plan of the blocks a run will need, and allocates them up front.
- In 1.27, those memory-pattern blocks were allocated against a placeholder root stream instead of the real per-device stream.
- At cleanup, the pool looks for chunks belonging to the real stream, does not find these, and never marks them reusable. Not freed, not reusable.
- The draft's analogy: a coat left in the cloakroom under a ticket number nobody issued.

Names, after the plain version: the BFC (best-fit with coalescing) arena; `enable_mem_pattern`; upstream PR #29589, "Fix usage of stream for memory pattern allocation with arena", whose description reads "Use real stream for memory pattern block allocation so that the cleanup of chunks from the arena correctly marks it as unused."

The defect shipped for three minor versions with no release note describing it.

**Weakest link, verify before publishing.** The draft claims ORT keeps its stream and its cuBLAS and cuDNN handles in a per-thread context, so the number of streams equals the number of threads that have called inference.
The measurements show growth per thread; the exact chain from "thread" to "stream" to "orphaned chunk" was not traced in source.
Read the PR #29589 diff and `PerThreadContext` in `onnxruntime/core/providers/cuda/cuda_execution_provider.h` before stating it as fact, or soften it to "consistent with".

## Why the growth never stopped: thread churn (missing from the draft)

The draft says each worker thread leaves one block behind and that FastAPI supplies forty threads.
If that were the whole story, growth would stop once forty threads had each run once, at about 40 x 0.8 MiB.
It did not stop; it was linear for ten hours.

The missing piece: anyio stops a worker thread after it has been idle for 10 seconds (`WorkerThread.MAX_IDLE_TIME = 10` in `anyio/_backends/_asyncio.py`, checked in anyio 4.14.2), and starts a new one on the next request.
So the pool is at most forty threads at once, but over a day of bursty traffic it runs through an unbounded number of distinct threads, each leaving its block behind.
That is why the probe counts retired threads, and why a short staging soak (under an hour) did not show it: a soak measures time, but the leak tracks thread turnover.

Caveat: thread churn in production was not measured directly. The idle timeout is confirmed in the anyio source and the per-retired-thread cost is measured; the rate of churn in production is inferred.
The two-line check, if Tom wants it for the article: log `threading.get_ident()` per inference call and count distinct values against the memory curve.

## The forty threads you did not ask for

Worth its own short section; it is a useful warning on its own.

- Register a plain `def` endpoint and FastAPI does not run it on the event loop (it would block every other request). It hands it to anyio's default worker thread pool, which holds forty threads.
- Nobody chose forty. It arrived the day someone typed `def` instead of `async def`.
- The semaphore is the knob labelled concurrency: in the config, with a number in it, one layer below the thread pool, and blind to how many distinct threads queue for a turn. Tuning it felt like doing something and did nothing.
- The real lever is `anyio.to_thread.current_default_thread_limiter().total_tokens`.
- Throughput was flat at about 150 requests per second regardless of concurrency, because the GPU was saturated one request at a time. Extra concurrency bought queueing and paid for it in memory.
- Worker recycling was off, so no process got a fresh start in a nine-hour window. A finite per-worker request limit turns an unbounded climb into a sawtooth: duct tape, but useful duct tape.

Two more consequences of the same pool, from follow-up work (both by colleagues; ask Tom before using, and credit "a colleague"):
- **Health checks queue behind inference.** A synchronous `/ping` route shares the forty-thread pool with the synchronous inference routes. With the pool saturated (40 of 40 busy, 40 waiting), a colleague measured readiness probes: sync `/ping` answered 0 of 6 within a 1 s budget, async `/ping` answered 6 of 6 at p50 5.1 ms. With a 3 s budget, sync answered 1 of 6 at p50 1,647 ms. Starved liveness probes restart pods under load. Fix: make health routes `async def`, plus a test that fails if a health route reaches the thread pool.
- **Shared mutable state across the pool.** Per-request stats stored in a shared dict were overwritten by concurrent requests (39 of 40 concurrent requests read back the widest request's value). Fix: `threading.local`.

## The interim mitigation and the clean-up

- Mitigation (a colleague, 2026-07-31): set `enable_mem_pattern = False` on the ORT session options. This avoids the leaking allocation path entirely, at the cost of the memory-pattern optimisation.
- Clean-up (Tom, 2026-08-26): bump to 1.29.0, prove the fix with the probe, re-enable memory patterns, and add a test that fails if `onnxruntime` is below 1.29. The test failed on 1.27.0 and 1.28.0 and passed on 1.29.0, 1.30.1, and 2.0.0. Reason worth stating: with the workaround removed, a downgrade silently restores the leak.

## Upstream state (verified 2026-10-18)

- Issue #29351: OPEN, 11 comments, none from Tom (`Graphight`). Scoped and titled to the Java API.
- PR #29589: merged 2026-07-30; merge commit `7e2f3b930977e17fd92a419464064890af6fcf59`.
- The fix is in v1.29.0 and later. Latest release is v1.31.0 (2026-10-09).
- It is still NOT in the 1.28.x line: v1.28.3 (2026-10-02) has diverged from the fix commit, and its notes do not mention it. A patch bump on 1.28 does not pick it up.

**Upstream comment, still not posted.**
Plan: comment on #29351, do not open a new issue (the fix exists; a new issue would be a duplicate).
The gap worth filling is that the issue reads as Java-only; the same root cause shows up in Python through FastAPI's anyio thread pool.
Contents: the Python/FastAPI manifestation in a sentence or two; the measurements (identical cold footprint, growth tracking distinct threads rather than concurrency, semaphore reduction not mitigating, and the probe numbers: +312 to +332 MiB over 400 retired threads on 1.27.0, within +4 MiB on 1.29.0); that the fix is in 1.29.0, not 1.28.x.
Tom has now verified 1.29.0 empirically, so the claim no longer needs softening.
Short and factual, no preamble or thanks-for-the-library opener.
Ask Tom whether this needs his lead's clearance too, since it reveals the employer's stack in a public thread.

## What is still open

- The residual term: at concurrency 1, with one thread, the leaking image still climbed slowly and had not plateaued at request 500. A pure per-thread story predicts flat. Unexplained. The 1.29.0 probe shows within +4 MiB over 400 threads, but that probe varied threads, not requests per thread, so it does not settle this.
- The thread-to-stream link in the mechanism (see "Weakest link").
- Production thread churn rate (inferred, not measured).
- An internal post-mortem appendix documenting Tom's method was agreed with his lead and is not yet written. Separate from the article.

## Possible sequel: the arena that only grows

Separate from the leak, found while building the probe.
The CUDA execution provider's arena defaults to `arena_extend_strategy = kSameAsRequested` with an unbounded `gpu_mem_limit`, so it grows to the largest request shape it has seen and never gives memory back.

Arena ratchet, measured: 1x128 tokens 866 MiB; then 32x512 1,372 MiB; back to 1x128 still 1,372 MiB; then 64x512 2,046 MiB.

Fix: chunk forward passes (at most 32 rows per pass) and cap request batch size.
One 256x512 request:

| | resting arena | peak during request | latency |
|---|---|---|---|
| unchunked, shrinkage off | +4,034 MiB | +4,034 MiB | 504.8 ms |
| unchunked, shrinkage on | +0 MiB | +4,238 MiB | 579.1 ms |
| chunk 32, shrinkage off | +506 MiB | +506 MiB | 515.8 ms |
| chunk 32, shrinkage on | +0 MiB | +538 MiB | 637.3 ms |

Arena shrinkage was rejected on purpose: it zeroes the resting number (which looks better) but leaves the peak higher, and its cost scales with the number of runs, which interacts badly with chunking.
Choosing the worse-looking metric because it is the honest one is a good story.

Under contention (semaphore 2, one 256-message request mixed with single-message requests), chunking cut small-request p95 from 4,097 ms to 978 ms at concurrency 4, p50 from 266 ms to 43 ms; the large request paid about 5%.
Why: without chunking a small request waits behind a monolithic 500 ms pass; with chunking it waits at most one roughly 64 ms chunk.
Sizing signal: padded token width, not character count, because the arena ratchets on the padded dimension and characters per token run about 4 for Latin script and under 1 for CJK.

## Figures and interactives

- `resources/onnx-fig1-convergence.svg`: convergence, 500 requests.
- `resources/onnx-fig2-sweeps.svg`: the two sweep panels.
- Both were generated from the numbers above and can be redrawn freely.
- The site has a widget pattern for interactive figures: `_includes/widgets/<name>.html`, included with `{% include widgets/<name>.html id="..." %}`. Each widget renders a static fallback paragraph and swaps to the interactive version only when JavaScript runs. Colours come from `--widget-*` CSS variables; see `_includes/widgets/sigmoid-slider.html` and `assets/css/interactive.css`.
- Animation ideas are marked inline in the article outline.
