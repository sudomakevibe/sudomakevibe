# sudomakevibe — TODO

Living backlog for the sudomakevibe.com site. Parked work, durable rules learned through experience, and future ideas. Update as items land or new ones surface.

Last updated: 2026-05-12.

---

## Architectural cleanup

Items here are not blocking, but they are maintenance traps that will cost time later if left alone. Each is a session of focused work.

- [ ] **Deduplicate `.prose strong` styling.** Currently defined in both `tailwind.config.mjs` (typography extend) and `src/styles/global.css`. They agree today; they will not always agree. Pick one source of truth (recommendation: keep the global.css rule, remove the Tailwind config customization for `strong`).

- [ ] **Deduplicate `.prose h3` styling.** Defined in both `src/styles/global.css` (`color: var(--accent)`) and `src/layouts/BlogLayout.astro` (`color: var(--accent) !important`). Both render h3 in accent blue, which makes `###` subheadings visually indistinguishable from `##` section headers. If h3 should ever be a distinct visual layer (e.g. text-secondary color), this is where to change it. The base `h3` rule in global.css already uses `var(--text-secondary)` outside of `.prose`, so the precedent exists.

- [ ] **Fix `remark-reading-time` plugin.** Currently uses default 150 wpm and counts SVG/HTML/code/markdown link syntax as words. Should use 200 wpm and strip non-prose tokens before counting. Until fixed, `readingTime` stays in frontmatter as a manual value.

---

## Content — distribution and republication

- [ ] **Medium republication of "Why Your Terminal Doesn't Care About My Voice".** Canonical URL setup, tag strategy (Homelab, Linux, Self Hosted, Technical Writing, Kubernetes), typographic header graphic in brand colors using JetBrains Mono. Distribution plan across Hacker News, Dev.to, Hashnode, Reddit (r/homelab, r/selfhosted), and LinkedIn.

- [ ] **LinkedIn post draft for "AI Is Not Free. Inaction Has an Invoice Too".** Standard format: opening hook → `"5 min read →"` on its own line → body → CTA. The three-generation knowledge cost is the strongest beat to lead with.

- [ ] **LinkedIn profile alignment project.** Bridge Red Hat professional identity with sudomakevibe practitioner positioning. Open structural decision: parallel Experience entry for sudomakevibe, or surface only via Featured + About + Websites sections.

---

## Content — new writing

- [ ] **`sudo make blog` site-build post.** Document how the Astro/Tailwind/Vercel site was built, theming, FOUC prevention, ConvertKit integration, self-hosted JetBrains Mono.

- [ ] **`/human` or `/beyond-the-terminal` personal page.** A page that sits alongside `/about` for personal context — not the professional bio, the human one. Open question on title.

- [ ] **Detailed lab diagram.** Visual of the homelab: Raspberry Pi 5s and Lenovo laptops running K3s, full K8s, Kali, observability stacks, hardened Linux. Brand-color SVG.

- [ ] **HITL (human-in-the-loop) post.** Flagged in part 3 of the AI-is-not-free series as a separate subject. The architecture is necessary but not sufficient; HITL is the missing discipline.

---

## Site features and styling

- [ ] **Shiki `css-variables` theme for syntax highlighting.** Replaces the current plain-text code block treatment with real syntax highlighting that respects the four-theme palette.

- [ ] **Cross-post visual sweep on part 3 after any future site-wide styling change.** Part 3 has the most varied use of bold elements in the corpus (labels, inline emphasis, defined terms). Any change to `.prose strong`, `.prose h3`, or related rules should be verified on part 3 before shipping.

---

## Durable rules and workflows

These are the rules of engagement for working on this repo. Surfaced through experience; not negotiable until a better approach is found.

### Content and writing standards

- No contractions in body prose. Contractions acceptable in post titles for punchiness.
- American English spelling throughout.
- No em dashes in new posts (parts 1, 2, 3 of the AI series predate this rule and keep them).
- Direct, measured language. No sycophantic framing.
- Reading time target: 5–7 minutes at **200 wpm** (not the plugin default 150). That is roughly 1,000–1,400 words of body prose. Exclude code blocks, SVG, frontmatter, and markdown link syntax from the count.
- `readingTime` in frontmatter is set manually. Do not trust the remark plugin until it is fixed.
- Blog posts use `.md` extension. Content lives in `src/content/posts/`. Routes are `/blog/<slug>`, not `/posts/<slug>`.

### File workflow rules

- **Immutable repo files.** Never edit files in `~/Developer/sudomakevibe` directly. Generate files in the container, download to `~/Downloads/`, verify md5, `cp` to repo location, then `rm` from `~/Downloads/`.
- **Verify md5 BEFORE `cp`.** Browser cache can serve stale downloads. If md5 does not match expected, `rm ~/Downloads/<file>` and re-download. Hard-reload the chat tab or use "Save Link As" if needed.
- **Clear clipboard before every paste into terminal.** Run `wl-copy --clear` (Wayland session). The Markdown copy icon has caused clipboard corruption bugs.
- **Specify paste-as-block vs. one-at-a-time for every command block.** Every time. No exceptions.
- **Delete files from `~/Downloads/` immediately after `cp` into the repo.** Prevents silent overwrites in future sessions.

### Diagnostic protocols

Learned the hard way during the 2026-05-12 session.

- **Ask for the served output FIRST when debugging visual or CSS issues.** Not "second after one round of guessing." First. The browser is the source of truth — view source (Ctrl+U) and inspect element show every rule competing in the cascade, every override, every specificity conflict. Editing source files based on intuition before reading the served HTML wastes rounds.
- **Cross-post visual sweep BEFORE shipping a site-wide styling change.** The change that fixes one post can break twelve others. Open at least three existing posts in the browser after a styling change and visually verify, including parts 1, 2, and 3 of the AI-is-not-free series, which use bold and headers in the most varied ways.
- **Two competing rules with the same specificity → later rule wins.** `.prose strong` defined in two CSS files? The one loaded later in the cascade wins. Tailwind-generated `:where()` rules have zero specificity, so any direct `.prose strong` rule beats them regardless of file order.
- **One commit per logical change.** When in doubt, prefer separate commits. Easier to revert one without the other. Combined commits are only correct when the changes genuinely serve one purpose.

### Markdown bold rules (current state, post-2026-05-12)

After a full debug cycle on `.prose strong` styling:

- Bold in markdown (`**text**`) renders in **body color, default weight** site-wide. Use it for inline emphasis and label-style bolds on their own line. Both work visually because the label sits on its own paragraph and is distinguishable from prose by isolation, not by color.
- `###` subheadings currently render in accent blue (same as `##`), which makes them visually indistinguishable from section headers. **Do not use `###` for now.** Either revisit the h3 styling first (see cleanup section), or use bold-on-own-line for subsections.
- Never use bold + accent color as a label-style treatment. The accent color reads as "link" to readers, even when there is no actual link. This was tried in the May 12 session and reverted.

---

## Future ideas

Speculative items, not committed work. Move to a section above if and when they become real plans.

- **Sourcing alternative reference architectures for the R7 stack.** Part 3 acknowledges R7 is one practitioner's synthesis. There may be value in a follow-up that compares R7 to other published reference architectures for regulated AI (NIST AI RMF, EU AI Act compliance patterns, vendor white papers from the major hyperscalers).
- **A "How I write" or "What sudomakevibe is for" essay.** Personal post about the editorial standards, the writing process, the role of the site in a Red Hat professional identity.
- **Newsletter strategy.** ConvertKit integration is in place but not actively driving signups. Worth a dedicated session: signup CTA placement, welcome sequence, cadence, what subscribers get that the RSS feed does not.
- **An "AI deployment journal" series.** Real deployments, real problems, real architecture decisions. Adjacent to the AI-is-not-free series but field reports rather than synthesis.
- **Open-sourcing the site itself as a template.** The Astro + Tailwind + Vercel + four-theme + JetBrains Mono setup is genuinely good and could be a reference template for other technical writers. Would need a real README and a `npm create` flow.
- **A talk or conference submission based on the R7 architecture.** The four-post series has the structural backbone of a 30-minute keynote.

---

## Recently shipped (last 30 days)

Kept for context. Prune anything older than 90 days.

- **2026-05-12.** Site-wide bold-as-accent experiment shipped and then reverted same day. Cost labels in the new post settled as bold-on-own-line. See `git log` commits `455d441` (revert) and `1acbcc1` (original attempt).
- **2026-05-12.** New post: "AI Is Not Free. Inaction Has an Invoice Too" — coda to the AI-is-not-free trilogy. Live at `https://sudomakevibe.com/blog/ai-is-not-free-inaction-has-an-invoice-too`.
- **2026-04-20.** Site launched. Astro, Tailwind, Vercel, GitHub auto-deploy, self-hosted JetBrains Mono, four brand-aligned themes (sudo-dark, sudo-light, arctic-frost, earthy-glow), all WCAG AA compliant with FOUC prevention.
