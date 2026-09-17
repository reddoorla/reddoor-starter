# Reddoor Starter — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom. [STARTER.md](STARTER.md) says what
the stack ships; this is the history of getting it there.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why
over what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, and 280 commits of history summarised rather than reconstructed (`chore/work-journal`)

> Superseded in part by 2026-09-08 — The Webflow rebuild pipeline has a home,
> and it is not this repo.

The journal starts today, so this first entry is a **backfill**: a deliberately
coarse summary of what came before, written from the commit log rather than
from memory. Detail below this line is trustworthy; detail above it is not, and
nothing here should be cited as though someone wrote it down at the time. The
commit log remains the record for anything before 2026-09-05.

**What this repo is.** A forkable SvelteKit 2 / Svelte 5 / Tailwind v4 /
Prismic starting point for every site Reddoor builds, deployed on Netlify. 280
commits from `initial` on 2024-02-22 to here — 72 in 2024, 68 in 2025, 140 in
2026, which is the shape of a template that stopped being a side project once
sites started shipping from it.

**The eras, roughly.** 2024 and 2025 are the slow build of the stack itself.
2026 is where the volume is, and it clusters: **July alone carries 61 commits**,
mostly the Blux migration track — a frozen-render pipeline for pixel-faithful
migration of an existing catalog site, proven on `the-pointe-burbank` and then
upstreamed (#78, #81–#84, #88, #89). That layer was snapshotted out to
[reddoor-starter-blux](https://github.com/reddoorla/reddoor-starter-blux) on
2026-08-31 as forward-merge-only, so this repo keeps the general case and the
Blux specifics live next door. August and September are consolidation: the
shared configs adopted so sync drift went to zero (#110), Prismic srcset widths
capped with a real `sizes` on every image (#109), and `Testimonial` and
`CtaBanner` added to the slice library, taking it to nine.

**One trap worth pulling forward, because it recurred downstream.** #74
(2026-07-18) reworded a comment in `src/app.html` so that `%sveltekit.body%`
was not trapped inside it — SvelteKit substitutes the **first** occurrence of a
placeholder and only the first, so merely _mentioning_ one in prose consumes
it. The fix was correct and it held. The lesson did not generalise: on
2026-09-04 the Vida Legacy Foundation site shipped the identical defect against
`%sveltekit.head%` **twice in one hour**, the second time while writing the
explanation of the first. A fix that lands in one repo as a one-line reword,
with no test and no note that the whole placeholder _family_ is affected, is a
fix that gets to happen again. That is a large part of why this journal exists.

**State as of this entry.** `main` at `2377e9c`, CI green. Nine shared slices,
each with `model.json`, `mocks.json` and a vitest suite. The `pnpm verify`
gate runs prettier → eslint → svelte-check → build → axe → unit + smoke, which
is exactly CI's order. `docs/NEW-SITE.md` lists what is still a template
default in a fresh clone.

**What changed today.** `CLAUDE.md` gained "The work journal", and this file
exists. Because this file ships with the template, every site generated from
the starter now starts with the convention rather than acquiring it later —
which was the actual gap: Vida Legacy Foundation accumulated four days of
hard-won detail in `CLAUDE.md` prose and PR bodies, where it is real but
unordered, because there was nowhere chronological to put it.

## 2026-09-05 — Ten retrospective rules made into defaults, and the half of the journal rule that was missing (#115, `15abd0d`)

Two changes, a few hours apart, and the second exists because a research pass
went looking for what the first got wrong.

**The ten rules landed (#115).** `scripts/figma-compare/` is now in the template
rather than in one site's repo, `package.json` ships
`reddoor.a11yRoutes: ["/"]` so a clone's axe gate measures a real page from the
first commit instead of only `/dev/a11y-fixtures`, and `CLAUDE.md` gained "Six
rules that came from shipping a site". The provenance of all ten is Vida Legacy
Foundation's `docs/workJournal.md`, written the same week.

**And the journal rule turned out to be half a mechanism.** It says an entry
that stops being true is never rewritten — a later entry corrects it and names
which one. That is right, and on its own it fails at the only moment it
matters. The correction goes to the bottom of the file. A reader searching for
"sticky band" or "Turnstile" lands in the middle, on the superseded paragraph,
and leaves with the answer that was already known to be wrong. Nothing in the
old entry points forward, because the rule forbade touching it.

So: one line under a superseded heading, `> Superseded in part by <date> —
<title>.` It asserts nothing and retracts nothing, so the record of what was
believed at the time survives whole; it only redirects. The distinction that
makes it safe is that a pointer is *navigation*, not *content* — the prohibition
is on editing the claim, and a pointer makes no claim.

The evidence it was needed showed up by accident. Sweeping the convention across
the fleet found `a-budget`'s `CLAUDE.md` already doing it by hand, uncommitted:
`**SUPERSEDED WHILE IN DEBT PAYOFF — see "Envelopes: pure retroactive" below.**`
Somebody hit the problem and invented the fix locally, which is usually the sign
that a convention is missing rather than that a person is wrong.

**One thing not to copy from the site that produced these rules.** Its
`CLAUDE.md` is 963 lines and ~13K tokens, loaded into every session whatever the
task. The only measured study of this file class (Gloaguen et al., ETH Zurich,
arXiv:2602.11988, Feb 2026 — 138 tasks, four agents) puts developer-written
context files at **+4% task success for +19% inference cost**, and concludes
that unnecessary requirements in them make tasks _harder_. The archive is worth
having; keeping all of it in the always-on file is not. Traps and history belong
in the journal, and `CLAUDE.md` should hold the minimum a session must not
violate. This starter’s own is 194 lines and should stay closer to that than to 963.

## 2026-09-08 — The Webflow rebuild pipeline has a home, and it is not this repo (`docs/webflow-pipeline-records`)

Docs only. Nothing Webflow-specific enters this template, and that is the
decision worth recording.

The 2026-08-31 track-split spec said the Webflow importer targets the native
`page` type. **That was a third true.** The importer also emits `person`,
`news_article` and `collection_item` documents, and Beachfront renders them
through a `CollectionList` slice and a collections loader wired into the page
route — all of which exist in the Blux track and in Beachfront, none of them
here. Believing the old sentence would have made "point the importer at a native
clone" sound like a small job.

So the pipeline lives next door: importer and seed runner in reddoor-maintenance,
round scripts and the `/dev/match` twin installed by a new `match-harness`
recipe, the phase protocol in the `matching-a-page` skill, the round rules
written into each site's own `CLAUDE.md`. This repo gets one orientation row. The
rule behind that placement is what the Blux split taught: **the template ships no
hook whose default does work, and no field an editor cannot fill.** A "three-line
seam" in `page-load` was considered and rejected — same species as the two
document types probed per page load that native-ize deleted in #106 (242 files
changed, 178 deleted, slices 28 → 9, custom types 7 → 1, build 840K → 412K).

Lists on a rebuilt site are content relationships by default (a repeatable group
restricted to a type; order is the group's order; no route change), and automatic
indexes are dedicated routes with their own server load, like `/contact`. Both
are site-side patterns, not template mechanisms.

**The largest thing NOT done, so it is not rediscovered as new.** Fourteen
generic product-quality fixes Beachfront made between 2026-08-07 and 2026-09-02 —
noindex prefixes, reveal state in the markup, a focus-ring floor, live
reduced-motion, modal scroll-lock, nav tap response — are absent here and are
already propagating into sites bootstrapped from this template; Vida Legacy
Foundation inherited five of them on 2026-09-01 and independently re-fixed a
sixth. It is the largest per-site saving measured anywhere in this work (~18% of
a Beachfront-sized build, against ~10% for every conversion layer combined), and
it is now #121 on this repo with commits, files, native counterpart and a test
for each, one PR per item.

**Honest accounting, because this entry was drafted before the work it
describes.** The paragraphs above were written into the plan on 2026-09-08 and
are unchanged; what follows is what actually happened, and some of it contradicts
what was believed while planning. Two of the plan's own predictions were wrong on
contact. An empty Prismic repository does not 404 — it 500s, because the Content
API rejects the _predicate_ when nothing of that type is published. And the error
it gives, `unexpected field 'my.page.uid'`, was then documented as meaning "the
type was never pushed", which is also wrong: the same error appears with the type
registered, byte-identical to the error for a type that has never existed. Both
corrections are in reddoor-maintenance, the second one twice, because the first
fix asserted a discriminating check in both directions when it only holds in one.

That pattern is the entry's real content. Across one session, eight separate
claims failed the same way — a derived, cached, or configuration view of state
read as though it were the state. A CDN served a `no-store` response as a cache
hit. An author-filtered PR search returned a confident empty set because
self-hosted Renovate authors as a person, not an app. A `>>` redirect denied by a
sandbox still printed "appended", because the `echo` after it reports on itself.
Three of the eight were committed by someone actively holding the fleet rule
about positive evidence in mind, and one _while writing the correction to a
previous instance of it_. They are enumerated as reddoor-maintenance#711.

The eighth is the one worth carrying into this repo, because it is a different
shape and no rule here covers it. A verification step existed, was correct, was
run, and passed — and its coverage was exactly complementary to its bug: it
checked a CLI entry guard by invoking the script through a real path, and the
guard only fails when invoked through a symlink. An absent check is visibly
absent. A check blind in precisely the configuration that breaks reads as green
diligence. `CLAUDE.md`'s existing rules tell you to demand positive evidence and
to enumerate the class; neither tells you to ask **under what invocation the
evidence was produced, and whether that is the invocation that fails.**

## 2026-09-17 — The maintenance bump and the CI pin, held together by a gate that was scanning a 404 (#148, `chore/bump-maintenance-0.96-ci-v142`)

Two pins were stale — `@reddoorla/maintenance` at `^0.93.1` against a published
0.96.0, and the reusable CI workflow at `v1.4.1`. They went in one PR because
bumping the first one alone turns this template's own CI red, and the reason it
does is worth more than either bump.

**The pairing.** 0.96.0 carries the route-status guard from
reddoor-maintenance#807 (closing #680): a route listed in
`package.json` → `reddoor.a11yRoutes` that does not answer 200 is recorded as
`route-missing`, impact `serious`, and axe is **not** run over the error page.
This template ships `a11yRoutes: ["/"]` and sits on the `your-prismic-repo-name`
sentinel permanently, so `/` 404s by design — `src/routes/[[preview=preview]]/+page.server.ts`
calls `error(404)` while `isPlaceholderRepo`, and `tests/smoke/routes.ts`
asserts exactly that 404. The two are not in conflict; they were never
introduced to each other.

**Measured, both directions, on this tree with 0.96.0 installed.** The rule is
that a guard you have not watched go red is not a guard you have tested, so the
`["/"]` case was restored on purpose and run:

```
a11yRoutes ["/"]  → exit 1
  a11y: 1 violations across 3 routes (2 fixtures + 1 from package.json) — route-missing on / (/ returned 404)

a11yRoutes []     → exit 0
  a11y: 0 violations across 2 routes (+1 hydration smoke)
```

**The belief that was wrong before contact.** The instinct was that this bump
merely _broke_ the template's a11y gate. It did the opposite: it exposed that
the gate had never been measuring anything here. For as long as `["/"]` has been
in this file against the sentinel, `pnpm test:a11y` was loading the 404 page,
running axe over it, finding nothing to flag on a bare error page, and reporting
a pass. The line `0 violations` was true and meant nothing — the exact shape
CLAUDE.md's "a pass needs positive evidence" rule names. 0.96.0 did not create a
red; it converted a false green into an honest one.

**Honest accounting: that diagnosis is not this session's.** It was made and
measured in the 2026-09-17 readiness audit (#147), whose verifier pinned 0.93.1
with `a11yRoutes ["/"]` in a clone and watched `pnpm test:a11y` exit 0 printing
"0 violations across 2 routes" for a home page that does not exist, then pinned
0.96.0 with the same config and watched it exit 1. This session measured only
the two runs above — 0.96.0 with `["/"]` and with `[]` — and did not re-run
0.93.1. Anyone re-deriving the blast radius should read #147's entry, not this
one; it also records the part that made the timing matter, which is that the red
would otherwise have landed on the grouped `renovate/all-minor-patch` PR on
2026-09-21, stalling eight unrelated updates behind one 404.

**The fix here is a workaround, and the better one is filed.** The template set
`a11yRoutes` to `[]` and `docs/NEW-SITE.md` grew a section saying why, and
saying that a real site adds `"/"` back at `/new-site` step 6 once the Prismic
repository exists and a `home` document is published — at which point the 0.96
guard becomes a genuine positive-evidence check instead of a scan of a 404.
Empty is not "gate off": the audit still scans `/dev/a11y-fixtures` and
`/dev/animate-in` and still hydration-smokes `/`, which is why the green above
reads `2 routes (+1 hydration smoke)`.

But `[]` is the only answer available to a template that can never have a real
route. It is the wrong answer for a real site, because an empty list is
precisely the configuration that once let a critical `image-alt` violation ship
to five production pages with CI green. The better fix is to make the audit
sentinel-aware the way `tests/smoke/routes.ts` already is — read
`slicemachine.config.json`, and on `your-prismic-repo-name` either expect the
404 or skip the route _with a labeled note in the summary_. That is
reddoorla/reddoor-maintenance#863. It matters well beyond this repo: `/new-site`
step 3c points the gates at real routes at bootstrap, step 6 replaces the
sentinel, and **every new site lives between those two steps** — so its first
maintenance-bump PR goes red for something that is not a defect in the site, and
whoever picks it up either debugs a non-bug or learns to route around the gate.

**The CI pin, and why it is not cosmetic.** `v1.4.2` adds one step before
`playwright install --with-deps`: `sudo rm -f /etc/apt/sources.list.d/google-chrome.list`.
On 2026-09-09 Google's Chrome apt repo served a `Packages.gz` whose hash did not
match its own signed `Release`, apt refused the entire update with "Hash Sum
mismatch", and every fleet CI run died there before a single test ran — three
times in forty minutes. Nothing in this stack installs `google-chrome`;
Playwright brings its own Chromium. Dropping the source takes a third party we
do not depend on out of the critical path. Pinned to the full SHA
`c714d9e472885bbf66f386e9f056a16aab7986d2`, tag comment kept, per the fleet
convention — a tag is a movable ref and a short SHA is not a pin.

**Found and not fixed.** The `/new-site` skill's step 3c still carries a "known
reporting trap" note claiming the a11y pass summary always reads
`0 violations across 2 routes` no matter how many routes ran (reddoor-maintenance#697),
and tells the operator to poll for the audit's temp spec file to learn the
truth. The run above disproves it — 0.96.0 prints
`3 routes (2 fixtures + 1 from package.json)`. The note lives in the
`claude-skills` repo, so it could not be fixed in this PR; it is recorded in
reddoorla/reddoor-maintenance#863 so it is not lost.

**In flight.** This branch is cut from `origin/main` while #147 (journal-only)
is still open against the same file, so a conflict in `docs/workJournal.md` at
merge time is expected and is not a sign either branch is wrong.
