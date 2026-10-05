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

## 2026-09-17 — Ready for site #2, except the a11y gate has been measuring a 404 page (audit only, no code change; #147)

A fifteen-agent workflow asked one question before the second client site is built
from this template: can `/new-site` clone `origin/main` today and produce a green
site? Four readiness audits — the starter itself, the `/new-site` and
`/figma-slices` skills, the Vida Legacy Foundation backport, and the
fleet-maintenance side — each had an adversarial verifier whose job was to
confirm, partially confirm or refute, and to list the claims that rested on the
absence of an error rather than on an artifact. Nothing in this repo was changed
today. This entry records what the audit found about the template and the
pipeline; the client-specific inventory is being written into another repo.

**The answer is yes, with numbers.** A fresh clone of `origin/main` at `0859ab8`,
with `/new-site`'s bootstrap edits applied (package name, the `netlify-site` CI
input, `SITE_NAME`, the README placeholders), installs from the frozen lockfile
and passes `pnpm verify`: prettier clean, eslint over 165 files with 0 errors and
0 warnings, svelte-check `COMPLETED 4519 FILES 0 ERRORS 0 WARNINGS`, a build, the
a11y audit, 60 test files / 469 unit tests, and 12 smoke specs. CI on that same
SHA (run 35182451450) logged the same counts, so the local run is not a different
configuration that happens to agree. eslint and prettier really do reach the
`.svelte` files — 46 of them, 0 different — which is the hole `.prettierrc`
closed and is worth re-measuring rather than assuming.

**The most valuable correction is that the a11y green is vacuous at bootstrap.**
The template ships `reddoor.a11yRoutes: ["/"]`, and `/new-site` step 3c sets it
before Prismic exists. While the `your-prismic-repo-name` sentinel is in place,
`/` returns 404 on purpose — `tests/smoke/routes.ts` knows that and asserts it.
The a11y audit does not: `@reddoorla/maintenance` 0.93.1, which the lockfile
pins, calls `page.goto(path)` and hands the page straight to axe with no status
check, so axe scans the SvelteKit error page and reports zero violations for a
home page that does not exist. A verifier reproduced the whole shape in its own
clone rather than trusting the auditor's logs: on 0.93.1 with `a11yRoutes ["/"]`,
`pnpm test:a11y` exits 0 and prints "0 violations across 2 routes"; pinned to
0.96.0 with the same config it exits 1 with `{id: "route-missing", impact:
"serious", route: "/", help: "/ returned 404"}`; the control, 0.96.0 with
`a11yRoutes []`, exits 0 again. The status branch first appears in v0.96.0 and is
absent from 0.93.1 through 0.95.1.

That matters more than a stale pin. This repo's own first rule says a pass must
require an artifact only a working system produces, and that a field which can
only observe configuration must not be named after the thing it cannot observe.
Here the rule fails _inside the instrument that enforces the other rules_: the
gate whose whole job is to produce positive evidence about rendered pages has
been producing an absence-of-violations result on an error page, and every
previous audit that cited "a11y: 0 violations" as evidence of health — including
this one's own positive-evidence list, as its verifier pointed out — inherited
that vacuity. The verifier also corrected the blast radius. Nothing is red today,
because `main` and fresh clones pin 0.93.1 and the shared Renovate config only
acts before 6pm on Mondays with a one-day `minimumReleaseAge`, so the earliest
window is 2026-09-21. When it fires, the red lands on the grouped
`renovate/all-minor-patch` PR, which carries `@lucide/svelte`, `@playwright/test`,
eslint, prettier, svelte, vite, typescript-eslint and the `reddoorla/.github` pin
along with the maintenance bump. One 404 therefore stalls every non-major update
in the group, not just the bump that exposes it.

**A fix that looked obvious would have broken the template.** The natural
follow-on to bumping to 0.96.0 is to take the new `reddoor.gateServer:
"preview"` option, which answers this repo's "verify on a production build" rule
and VLF's open issue about it. Two verifiers independently showed that setting it
at bootstrap is wrong. Under `preview`, the v0.96.0 Playwright `webServer` runs
the build and probes `http://localhost:<port>/` for readiness, and Playwright
1.62.1 treats a server as ready only for `statusCode >= 200 && statusCode < 404`
— so on the placeholder, where `/` is a deliberate 404, the server never becomes
ready and both gates fail at the five-minute timeout. Separately, the starter's
own browser specs target `/dev/a11y-fixtures` and `/dev/animate-in`, which `#134`
made 404 in a production build, so they would fail under preview even with a home
page. The order is: bootstrap on the dev server and report explicitly that the
gate is not yet measuring the site, publish the home document, then opt into
preview and split the `/dev`-targeting specs into their own project. One more
correction from the same thread: `gateServer` moves the hydration smoke, not the
axe scan, which stays on `vite dev` by design.

**VLF's process lessons came back; its code lessons largely did not.** The six
standing rules, the journal convention with its forward-pointer clause, the
figma-compare harness with the cap-height trim recorded per style, real
`a11yRoutes` at bootstrap, the locale-string inventory and the review-round rules
all landed here or in the skills. The generic defects VLF found while fixing its
own did not, and four of them were re-measured today rather than taken on
report. A Prismic preview of any non-home page lands on `/`: since `#90` the
client is routes-free, so the Content API leaves `doc.url` null, `/api/preview`
passes the bare client to `redirectToPreviewURL`, and `asLink` with no
linkResolver returns null, falling back to `defaultURL`. Run against the
installed `@prismicio/client` 7.22.0 with a stubbed fetch returning
`{uid: "about", url: null}`, this template answers `Location: /preview/` where
VLF's wrapper answers `Location: /preview/about`. The `--screen-*` tokens in
`app.css` are Tailwind v3 naming that v4 ignores: compiling `@theme { --screen-sm:
560px; --screen-xl: 1340px }` with the installed `@tailwindcss/node` 4.3.3 emits
`@media (width >= 40rem)` and `@media (width >= 80rem)`, so `sm` is really 640px
and `xl` really 1280px and the declared 560/1340 are dead — the second site to
rediscover this, after the Beachfront note. The fleet's Typekit swap,
`media="print" onload="this.media='all'"`, is an inline handler that the nonce
CSP refuses; measured in Chromium, media stays `print` and `faces=0`. The
verifier refuted half of that finding as received: all 210 font URLs in kit
`noj4tji.css` are `use.typekit.net/af/...`, so faces register and load with only
`use.typekit.net` in `style-src` and `font-src`; `p.typekit.net` is needed only
to silence the console error from the `p.css` tracking `@import`, which matters
because a console-error smoke assertion would fail on it. And `Nav.svelte` has no
no-JS path below `lg`: the link list is `hidden ... lg:flex` and the menu exists
only inside `{#if isMenuOpen}`, so a phone visitor without JS cannot navigate at
all — while the fleet Playwright config still forces `reducedMotion: "reduce"` on
every test, which is what made a class of no-JS assertions vacuous before.

**Four fleet-side facts would bite site #2 on day one.** The local maintenance
`dist/` was built at 2026-09-15 11:05, four hours before `#812` landed at 15:10,
so `ensure-site --name` still behaves create-only there; the skill never passes
`--name` anyway, which is why two fleet rows still carry their bare slug as the
client-facing Name sixteen days later. Checking `--version` does not detect this,
because the CLI reads its version from `package.json` at runtime and this stale
build cheerfully prints `0.96.0`. `sync-configs` still decides by exact byte
match for eslint, playwright, lighthouse and prettier: today's starter plans zero
writes, but VLF's `origin/main` plans two, and one of them replaces a 3020-byte
`playwright.config.ts` carrying a four-project no-JS/phone rendering matrix with
the 74-byte re-export — the suite still passes afterwards and simply covers less.
Across 24 local checkouts the planner would overwrite 38 such files. The starter
sits on maintenance 0.93.1 against a released 0.96.0, and on `reddoorla/.github`
v1.4.1 against v1.4.2 (22 of 23 org repos are on the old pin); v1.4.2 is the
commit that stops apt reading Google's Chrome repo, the failure that took out
every fleet CI run three times in forty minutes on 2026-09-09.

**Two of the traps the verifiers found are not about code at all.**
`ensure-site` throws unless the display name slugifies back to the slug, and
`siteSlug` lowercases and collapses non-alphanumerics, so the skill's own example
slug cannot take the client's real name — the slug decides the client-facing
name, in auto-reply copy and report subjects, and it also becomes the GitHub repo,
the Netlify site, the forms-ingest path and the suggested Prismic repo name.
Deciding it late means renaming five systems; the operator has now settled on
`roalson-interests`. The second: `FIGMA_PAT` is the only working Figma REST
credential on this machine — a read-only `/v1/me` with it returns 200 — and it is
what `scripts/figma-compare/pull-figma.mjs` in _this_ repo consumes at Stage A.
It appears on the maintenance meta-week list of "the four keys nothing reads",
tagged as measured, because that census grepped only the maintenance repo and
never saw the consumer that lives here. Carrying out that five-minute rider would
have deleted Stage A's credential days before it is needed.

**Honest accounting about the audit itself.** The verifiers' most useful output
was not the confirmations but the list of claims resting on absence of evidence:
grep finding no analytics IDs or font-kit strings is not proof the routes are
clean; `gh repo create --help` listing `--public` is not a repo created;
`node --check` passing on the figma-compare scripts is not the harness run
against a comp; "`/dev` routes 404 in production" was verified by observing that
the guard file exists in both repos, with no production build loaded; the
scroll-reveal no-JS spec was read, not mutated to watch it go red. Several
severities were corrected downward on contact — the missing capability-index
mention in the skills is belt-and-braces now that `docs/COMPONENTS.md` is tracked
and `CLAUDE.md` points every session at it, and the chrome-link prerender failure
names its own referrer in the error, so it costs one failed build rather than an
afternoon. Two side effects are worth recording because someone will otherwise
pay for them without knowing why: the starter-health agent's unsandboxed run of
`playwright install chromium` made Playwright 1.62.1 evict the cached
`chromium-1243` and `chromium_headless_shell-1243` builds from
`~/Library/Caches/ms-playwright`, so every other checkout pinned to 1243 will
re-download them on its next install; and one agent briefly wrote a probe script
into the `reddoor-maintenance` checkout before deleting it seconds later.

**Nothing was fixed today.** No file in this repo changed; this entry is the only
artifact. The skill patches — the `--name` argument, the rebuild step, the gate
order, the Typekit and Turnstile traps — are being made in the `claude-skills`
repo, and the template-side work (bump maintenance to 0.96.0 behind a
sentinel-aware a11y audit, the CI pin to v1.4.2, and the VLF backports named
above) is a separate batch that has not landed.

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

**Merge order.** This branch was cut from `origin/main` while #147
(journal-only) was still open against the same file. The conflict in
`docs/workJournal.md` duly happened; it was resolved by rebasing onto #147 and
keeping both entries in the order they merged, since they are appends to the
same tail and neither contradicts the other.

## 2026-09-17 — Two template defects the second site paid for: a frozen copyright year and a text token that cannot be trusted with a brand colour (`fix/footer-year-and-text-contrast`)

Both of these were found by bootstrapping roalson-interests earlier today, and
both are template problems rather than that site's, so they are fixed here.

**The copyright year could only be right once.** `SiteConfig.footer.text` is a
plain string and `<Footer>` rendered it verbatim, falling back to
`© ${new Date().getFullYear()} Company Name`. So a site had two options: leave
the placeholder, which says "Company Name" on every page, or set `text` to its
own line — which freezes whatever year it typed. Correct in the January it is
written, wrong every January after, in a repo nobody is looking at. Roalson took
the second option at bootstrap and its footer now reads a hardcoded 2026.

`footer.owner` is the fix: the site names the entity, `<Footer>` supplies the
year. `text` stays, documented down to what it is actually for — a rights line
that is not of the form `© <year> <owner>`, which is why composition-hospitality
has one. Its test asserts the CURRENT year computed at assertion time rather
than a literal, because a literal expectation would pass for a year and then
start failing on a date nobody associates with the change.

**`--color-secondary` asserts something the template never checked.** The name
says the token is text-capable. A brand's "secondary colour" very often is not,
and the template spends this one as text in eight places a new site never
touches — footer copyright, `Field.svelte`'s description, the eyebrows on
LeadText, TextColumns and Testimonial, the testimonial role line, the contact
intro, a dev fixture. So assigning a light tint to it does not fail somewhere; it
fails on every page that renders a footer.

Roalson's dust `#B2AC9F` measured **1.97:1** on the page ground. The a11y gate
caught it, and that is later than it sounds: the gate needs a built site and a
browser, it names one node rather than the class, and on a fresh clone it is
pointed at fixtures — on a site that had not yet published a home document it
would not have run on a real page at all.

`src/lib/theme-contrast.test.ts` now parses the `@theme` block and measures
every text/ground pair the template actually composes, failing below 4.5:1 in
milliseconds with no browser. Both halves were proven by mutation rather than
asserted:

- setting `--color-secondary` to Roalson's dust fails two cases with
  `--color-secondary on --color-background is 2.26:1, below AA (4.5:1)` — and
  the message names the fix, which is to split the token rather than to change
  the pair being measured;
- changing one `text-secondary` to `text-accent` fails the completeness case
  with `unmeasured: accent`, so a new text token cannot quietly arrive without
  someone saying which ground it lands on.

**One measurement worth recording, which is NOT asserted.** In the shipped
placeholder palette `secondary` `#6b7280` on `light` `#e5e7eb` is **3.90:1** —
already below AA. `bg-light` is used 17 times and `text-secondary` 12 times, but
no component currently nests one in the other: in `/dev/animate-in`, the only
file with both, they are siblings. So the pair is not asserted, because
asserting it would fail the template's own defaults for a composition that does
not exist. It is one nesting away from being real, and that is written into the
test beside the list rather than left to be rediscovered.

**Honest accounting.** The class was not obvious from the failure. The first fix
here repointed the dev fixture at a new `-aa` token, which left the gate red,
because the fixture was never the failing element — the footer was.
`grep -rn "text-secondary"` returns eight files and was available the whole
time. CLAUDE.md already says to enumerate the class before fixing an instance;
this session still had to pay for it once before doing so.

## 2026-09-29 — The none-hued Tailwind palette gets explicit hues, so axe can measure the Hero (#152, PR to follow)

Tailwind 4.3 writes 13 palette entries with a `none` hue: every `neutral-*`,
`zinc-50` and `mauve-50`. The Hero slice's `bg-neutral-900`, for example, is
`oklch(20.5% 0 none)`. Browsers render `none` as 0. axe-core 4.13.0, the
latest release, cannot parse it. The Hero's white "Explore" CTA sits on that
band, so axe finds the CTA's white first. It then parses every element under
the CTA to build the stacking context, reaches the band, and throws. The
color-contrast rule is skipped for the whole `/dev/a11y-fixtures` page. The
gate fails only on violations, so the page read as clean. Contrast had not
been measured there at all.

@reddoorla/maintenance#916 turns that crash into a `rule-errored` failure. It
also turns text sitting directly on such a colour into a
`contrast-unmeasured` failure. Measured in a copy of this repo at `f96b4ac`
with a packed build of that PR:

- On main: `rule-errored on a11y fixtures`. The crash node was the CTA
  (`.inline-block`), and 0 color-contrast nodes were measured on the page.
- With this change: `0 violations across 2 routes`. 64 color-contrast nodes
  were measured on the fixtures page.
- On main with the locked 0.97.0: `0 violations`. That was the blind green.

The fix overrides the 13 tokens in `@theme` with Tailwind 4.3.3's own values,
with the hue written as 0. The screenshots of `oklch(L 0 none)` and
`oklch(L 0 0)` are byte-identical at all 11 lightness values, so nothing on
screen moves. Once Tailwind or axe is fixed upstream, the override can go,
but only after the gate has been seen passing without it.

The override sits inside the `@theme` block that `theme-contrast.test.ts`
scans, and it stays there. That put the 13 tokens in front of a guard that
read only hex. A later `text-neutral-600` would have failed as unclassified,
and classifying it would then have failed as "cannot measure oklch". This
was found by review, by adding a throwaway `text-neutral-600` line. The guard
now reads an achromatic `oklch(L 0 H)` as the sRGB encoding of L³ in linear
light, which gives Tailwind's own greys: #fafafa, #525252, #171717, #0a0a0a.
It still refuses a `none` hue. With the fix, the same probe passes both
steps (15 tests), and the probe was removed. This is the first part of #152.
Field's `red-600` failing AA off white, the issue's second part, is not
touched here.

## 2026-10-04 — A cloud session can run `pnpm test:a11y`: the starter gets a cloud setup hook (reddoor-maintenance decision 70)

A Claude cloud container could not run this template's axe gate.
`pnpm test:a11y` printed `a11y: no results written (exit 1)`, and in the
published 0.97.0 of `@reddoorla/maintenance` the only text behind it was
an npm warning. The cause, measured from reddoor-maintenance on
mantis-landscaping (reddoor-maintenance #1132, #1136): the lockfile
resolves `@playwright/test` 1.63.0, which launches
`chromium_headless_shell-1243`, and the image's `/opt/pw-browsers` held
only revisions 1194 and 1234. The sandbox was not the problem; Playwright
handles root itself. With 1243 aliased to 1234 the audit passed, so the
missing revision was the only thing in the way. The operator approved this
hook as decision 70.

`.claude/hooks/cloud-session-setup.sh` runs on startup and resume, and only
when `CLAUDE_CODE_REMOTE=true`, so CI and the laptop never run it. It is
reddoor-maintenance's hook minus that repo's GA key, `gh` and unshallow
steps. It puts `.nvmrc`'s Node on `PATH` (the image ships 22), runs
`pnpm install --frozen-lockfile`, installs the chromium and headless-shell
revisions the pinned Playwright names when they are missing, exports
Playwright's Chromium as `CHROME_PATH` when no Chrome is on `PATH` (lhci
finds none otherwise), and adds the egress proxy's CA to Chromium's NSS
store. It says nothing when all of that worked.

Measured in a container on this branch. The first run took 33 s,
downloaded both 1243 builds, and wrote `PATH` (Node 24.21.0) and
`CHROME_PATH` to the env file. A second run took 3 s and downloaded
nothing. Then, with only what the hook set up, `pnpm test:a11y` passed:
`0 violations across 2 routes (+1 hydration smoke)`, in 35 s. Before the
hook, the same command on the same image failed.

Sites already generated from this template do not get the hook. Each would
need its own PR, and that backfill is a separate decision for the operator.
The Blux track (`reddoor-starter-blux`) can take it with a cherry-pick.

The hook needed `.claude/settings.json` tracked again. #32 untracked it and
ignored all of `.claude/`, because the file then held the operator's
personal permission allowlist, which must not ship to client sites. The
ignore is now narrowed: `.claude/*` stays ignored except `settings.json` and
`hooks/`. The tracked `settings.json` registers the hook and nothing else;
personal permissions belong in `.claude/settings.local.json`, which is still
ignored. One consequence for a laptop checkout that still has #32's
untracked `.claude/settings.json`: the pull will refuse to overwrite it, so
that file has to move to `settings.local.json` first.

## 2026-10-04 — The simulator leaves the public pages' bundle; an encoded path gets the simulator's framing (#168)

Two findings from the adversarial review of caltex-landing#69, both inherited from #166.

**The simulator rode every Prismic page.** #166 imported `SliceSimulator` from the `@prismicio/svelte` barrel. Measured from `.svelte-kit/output/client/.vite/manifest.json`, the home and `[uid]` nodes' static imports went from 37,093 to 40,331 B gzipped between `f538398` and `631f9a5`, and both now reached the chunk holding `@prismicio/simulator/kit` (13,655 B gz). Before #166 that code lived only in the simulator route's node. caltex saw the same thing as +3.3 KB of modulepreload on `index.html`.

The cause is how Rolldown assigns modules to chunks: it follows the static import graph, and the barrel statically re-exports `SliceSimulator`, so once the simulator route uses it, it lands in the barrel's chunk, which every page that renders a `SliceZone` loads. Four fixes were tried, each measured the same way. A dynamic `import("@prismicio/svelte")` in the route made it worse (41,428): it is the same barrel module. A deep path to `dist/SliceSimulator.svelte` produced a byte-identical chunk, because the barrel's edge decides, not the importer's path (and the package's `exports` do not allow a deep import anyway). A local copy of the component importing `@prismicio/simulator/kit` moved the component out but left the kit in the shared chunk (39,881). A `codeSplitting` group swallowed `SliceZone` and its dependencies into a 75 KB chunk, and Rolldown refuses the group's `includeDependenciesRecursively: false` under SvelteKit's `preserveEntrySignatures: "strict"`.

What worked: `scripts/prismic-barrel.ts` declares the barrel module alone side-effect-free. It is nothing but `export { default as X } from "./X.svelte"` lines, so the declaration is true, and Rolldown then binds `SliceZone` straight to its own module and the barrel stops being an edge. Home and `[uid]` drop to 36,145 B gz, 948 below the pre-#166 baseline, and the simulator code is reachable only from the simulator node. The re-exported components keep their own side effects. If an upgrade ever puts anything but re-exports in the barrel, the plugin fails the build rather than declare it.

Why the baseline was clean in the first place: the old adapter imported its own copy of the simulator, a different module from the barrel's, so the barrel's edge never reached it. Nothing about the old setup was deliberate.

`scripts/prismic-barrel.test.ts` reads the built manifest when CI has built first (the shared workflow builds before `pnpm test`), asserts the simulator node does reach the simulator code (the positive control) and every other client entry does not.

**An encoded path missed the framing exception.** `isCmsFramedRoute` matched `event.url.pathname`, which is the raw path, while SvelteKit routes on the decoded one. From `vite preview` on `main`, `/slice%2Dsimulator` rendered the simulator with `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`. That fails closed here, but a site whose hook touches only the simulator fails open to no framing header. The hook now asks `event.route.id === "/slice-simulator"`. Measured from `vite preview` after the change: `/slice-simulator` 200, no XFO, widened frame-ancestors; `/slice%2Dsimulator` and `/slice%2dsimulator` the same; `/slice-simulator/` a 308 to the canonical path, as before; `/Slice-Simulator` 404 and SAMEORIGIN; `/privacy` SAMEORIGIN with `frame-ancestors 'self'`.

Seven mutations, all red: the plugin removed (the build test), the hook back on the pathname, the check always true, a null route treated as framed, the re-export guard disabled, the plugin applied to every id (the suite fails to load), and the simulator markers changed to miss (the positive control).

An adversarial review found no blocker and five minor findings, all folded in. First, the framed route is a route id, so moving the page into a route group (`/(cms)/slice-simulator`) would have unframed it silently; a test now requires each id in `CMS_FRAMED_ROUTES` to name a directory with a `+page`. Second, the encoded-path unit test could not prove SvelteKit's decoding, since the hook no longer reads the URL; `tests/smoke/slice-simulator.spec.ts` now asks the server for `/slice%2Dsimulator` and `/slice%2dsimulator`. On `main` it fails both encoded paths, and on this branch it passes. Its control first failed on both, because it checked the whole CSP for `*.prismic.io`, which `connect-src` and `img-src` legitimately name; it now looks only at `frame-ancestors`. Third, under `CI` the build test fails instead of skipping when there is no build to read. Fourth, the re-export guard no longer accepts `export {} from` or `export * from`, since each can pull a module in for its side effects alone, and declaring the barrel side-effect-free would then drop it. Fifth, the production client was proven in a browser. The whole Playwright suite ran against `vite preview` of this branch and of `main`. Both fail the same seven `/dev` fixture specs, which 404 in a production build, and pass everything else. The shared config's own preview mode cannot start on the placeholder starter, because its readiness probe waits for `/`, and `/` is a 404 here.

## 2026-10-05 — A pre-commit hook runs prettier on what is staged, as on roalson-interests (`claude/trusting-hawking-aauv3f`)

Ported from roalson-interests#259. That site's #251 went red in 20 seconds on `prettier --check` before any test ran, and formatting is the one CI failure a machine can fix without judgement. `pnpm install` now runs `prepare`, and `simple-git-hooks` writes `.git/hooks/pre-commit`. The hook runs `lint-staged`, which runs `prettier --write --ignore-unknown` on the staged files. Every site generated from this template gets it on its first install. The cloud-session setup hook already runs `pnpm install --frozen-lockfile`, so cloud sessions get it too.

The same four cases were re-measured here, because this repo pins pnpm 12.5.1 where roalson pins 11.11.0:

| case                              | result                                                  |
| --------------------------------- | ------------------------------------------------------- |
| staged, badly formatted line      | committed as `export const uglyThing = { a: 1, b: 2 };` |
| unstaged edit in the same file    | left unstaged and untouched                             |
| staged syntax error               | hook rc 1, HEAD unmoved                                 |
| worktree with no `node_modules`   | commits, with the `pre-commit:` line                    |
| install with no `.git`, `CI=true` | `No .git root folder found, skipping`, rc 0             |

The hook calls `node_modules/.bin/lint-staged` rather than `pnpm exec lint-staged` for the reason the roalson entry gives. Hooks live in the shared `.git/hooks` and fire in every worktree. There, pnpm's dependency-status check aborted a commit in a worktree with a symlinked `node_modules`, and a worktree with no install would have been blocked outright.

`simple-git-hooks: false` sits under `allowBuilds`, because the root `prepare` does the install and pnpm refuses an unlisted build script (`ERR_PNPM_IGNORED_BUILDS`).

Not done: `reddoor-starter-blux` does not carry this yet. Per its README it adopts native changes by cherry-pick, never by merge.

## 2026-10-05 — Tests build; they don't freeze: the template ships a `@smoke` gate, a nightly tier and a scaffold tier (`claude/trusting-hawking-aauv3f`)

> Follows 2026-10-05 — A pre-commit hook runs prettier on what is staged.

A fleet survey that day found one shape on every site but roalson-interests. `test:smoke` ran every Playwright spec inside the required `ci / ci`, and CLAUDE.md had no rule saying where a design pin belongs, so every pin went in the gate. Six sites were rated high freeze risk. The template is where that starts, because every site copies it. The template now ships the tiers roalson-interests#256 introduced, together with CLAUDE.md's "Tests build; they don't freeze".

**The gate.** It is vitest without design pins, plus 12 of the 17 Playwright tests tagged `@smoke`:

- slice-simulator (4)
- a11y fixtures (2)
- pages (3)
- landscape (2)
- reveal-no-js with scripting off (1)

`test:nightly` runs the reveal's first-frame trace and the modal scroll lock, which moved into its own `modal-scroll-lock.spec.ts`. `test:scaffold` holds the modal-centring geometry. `nightly.yml` runs nightly and on dispatch, and blocks nothing.

**The inherited pins, rewritten as properties.** These are the files every site copied:

- **focus-floor:** the ring's contrast against the light grounds must be at least 3:1, replacing the `outline: 2px solid` regex.
- **reduced-motion-reset:** each forced duration and delay must be under 1 ms, replacing the `0.01ms` regex.
- **reveal-hidden-state:** runs `animateIn` and compares its inline writes with the gated CSS, instead of regexing `animateIn.ts`.
- **theme-contrast:** checks converter correctness on literal inputs, replacing pinned token RGBs and a count of 13.
- **Field:** the border is a theme token at 3:1 or better.
- **Modal:** the close button has a hit box of at least 24px, replacing the exact class list.
- **animateIn and ContentWidth:** the literal 2400ms and `translateY(50%)` are gone, and a no-op is checked against the element's own prior state.

Measured on scratch worktrees, with each mutation reverted:

| change                                                 | `main`     | this branch                           |
| ------------------------------------------------------ | ---------- | ------------------------------------- |
| Field border `border-secondary` → `border-dark`        | 1 unit red | green                                 |
| close button `min-h-11 min-w-11` → `min-h-12 min-w-12` | 1 unit red | green                                 |
| focus ring 2px → 3px                                   | 1 unit red | green                                 |
| reveal duration 2400 → 1200                            | 2 unit red | green                                 |
| reveal travel 50% → 40% in JS only                     | —          | 1 unit red (the coupling, on purpose) |
| Field label loses its `for`                            | —          | 10 unit + 1 smoke red                 |
| close button loses `aria-label`                        | —          | 3 unit red                            |
| focus ring colour → `--color-light`                    | —          | 1 unit red                            |

`pnpm verify` passes: 564 unit tests, 12 Playwright, and 0 a11y violations across 2 routes, in 279 s. The 17-test suite took 57 s before this change, so the time saved on the template is small. What changes is what a red means on every site that starts from it.

**Found and filed, not fixed here:**

- #170: the focus floor draws a near-black ring on dark grounds, 1.01:1 on Hero and 1.21:1 on CtaBanner dark. The new contrast test measures the light grounds only, so it does not turn red on this. It is a real accessibility defect with an issue, not a test that hides it.
- #176: filed from the beachfront-dentistry pass.
- #178: landscape's `@smoke` tests each wait a fixed 8 s.
- #179: `capability-index.mjs` rewrites `docs/COMPONENTS.md` on any argument but `--check`, including `--help`.
