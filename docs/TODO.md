# sudomakevibe — TODO

Living backlog for the sudomakevibe.com site. Parked work, durable rules learned through experience, and future ideas. Update as items land or new ones surface.

Last updated: 2026-05-12.

---

## Architectural cleanup

Items here are not blocking, but they are maintenance traps that will cost time later if left alone. Each is a session of focused work.

(All previously-listed items shipped 2026-05-12 — see Recently shipped.)

- [ ] *(no open items at this time — surface new ones as they appear)*

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

- [ ] **Decide whether to drop manual `readingTime` overrides in frontmatter.** The `remark-reading-time` plugin works correctly (calibrated to 265 wpm against Medium, strips html/code/inlineCode/table from word count). Posts currently override the auto-calc manually in frontmatter. Manual workflow has a real cost (remember to set it, recalibrate when content changes); auto-calc may be close enough to trust. Decision deferred. Not urgent.

- [ ] **Cross-post visual sweep on part 3 after any future site-wide styling change.** Part 3 has the most varied use of bold elements, headings, and links in the corpus. Any change to `.prose`-family rules should be verified on part 3 before shipping.

---

## Durable rules and workflows

These are the rules of engagement for working on this repo. Surfaced through experience; not negotiable until a better approach is found.

### Content and writing standards

- No contractions in body prose. Contractions acceptable in post titles for punchiness.
- American English spelling throughout.
- No em dashes in new posts (parts 1, 2, 3 of the AI series predate this rule and keep them).
- Direct, measured language. No sycophantic framing.
- Reading time target: 5–7 minutes at **265 wpm** (calibrated against Medium reading-time estimates for posts of similar length and structure). That is roughly 1,300–1,800 words of body prose. The `remark-reading-time` plugin already strips HTML, SVG, code blocks, inline code, and tables — trust its auto-calc unless a post is exceptional.
- `readingTime` in frontmatter can be set manually if needed but is no longer required (see "Site features and styling" item for the open decision on whether to drop manual overrides entirely).
- Blog posts use `.md` extension. Content lives in `src/content/posts/`. Routes are `/blog/<slug>`, not `/posts/<slug>`.

### Markdown element usage (post 2026-05-12 cleanup)

- **Bold** (`**text**`) renders in body color, no weight change. Use for inline emphasis only. Do not use bold-on-own-line as a label-style treatment — use `###` for that now.
- **`###` headers** render at text-secondary color, 1.15em, weight 600. Use for real subsections. Visibly distinct from `##` (accent blue at 1.5em) and from body prose. Screen readers see them as real h3 elements.
- **`####` (h4)** still renders accent blue. Rarely used; revisit if a post needs four hierarchy tiers.
- Three-tier hierarchy works: h2 (accent, sections) → h3 (secondary, subsections) → body (primary).

### File workflow rules

- **Immutable repo files.** Never edit files in `~/Developer/sudomakevibe` directly. Generate files in the container, download to `~/Downloads/`, verify md5, `cp` to repo location, then `rm` from `~/Downloads/`.
- **Verify md5 BEFORE `cp`.** Browser cache can serve stale downloads. If md5 does not match expected, `rm ~/Downloads/<file>` and re-download. Hard-reload the chat tab or use "Save Link As" if needed.
- **Clear clipboard before every paste into terminal.** Run `wl-copy --clear` (Wayland session). The Markdown copy icon and the chat code-block copy button have both caused clipboard corruption bugs.
- **Specify paste-as-block vs. one-at-a-time for every command block.** Every time. No exceptions.
- **Delete files from `~/Downloads/` immediately after `cp` into the repo.** Prevents silent overwrites in future sessions.
- **Long commit messages via `git commit -F <file>`.** Bash history expansion treats `!` as a special character and aborts commits that contain it. File-based commit messages bypass this entirely. Use the same workflow as for repo files: generate the message file, download, `git commit -F`, then `rm` the message file.
- **Confirm `git status` after every `git reset` or `git checkout`.** Operations that affect staging or working-tree state are easy to misread; verify what is actually staged before the next `git add` or commit.

### Diagnostic protocols

Learned the hard way during 2026-05-12 sessions.

- **Ask for the served output FIRST when debugging visual or CSS issues.** Not "second after one round of guessing." First. The browser is the source of truth — view source (Ctrl+U) and inspect element show every rule competing in the cascade, every override, every specificity conflict. Editing source files based on intuition before reading the served HTML wastes rounds.
- **Measure before fixing.** When the problem statement involves "this number is wrong" or "this should be X but it shows Y," write a diagnostic script that produces the actual measurement before generating any fix. The May 12 reading-time saga consumed real time because a fix was written and deployed before measuring whether the alleged bug existed. (It did not.) Five minutes of measurement saves an hour of unwinding.
- **Cross-post visual sweep BEFORE shipping a site-wide styling change.** The change that fixes one post can break twelve others. Open at least three existing posts in the browser after a styling change and visually verify, including parts 1, 2, and 3 of the AI-is-not-free series, which use bold and headers in the most varied ways.
- **Two competing rules with the same specificity → later rule wins.** Tailwind-generated `:where()` rules have zero specificity, so any direct `.prose strong` rule beats them regardless of file order. Specificity conflicts within the codebase were the root cause of multiple debug cycles. The May 12 cleanup pass eliminated most of these by consolidating prose styling in `global.css`.
- **One commit per logical change.** When in doubt, prefer separate commits. Easier to revert one without the other. Combined commits are only correct when the changes genuinely serve one purpose. Use file-based commit messages for anything with shell special characters.
- **Verify the dev server actually restarted.** Astro's dev server can survive a Ctrl+C and keep running in the background. After a restart, run `ps -ef | grep astro | grep -v grep` and check the process start time. If the time predates the restart, run `pkill -f "astro dev" && sleep 2` and confirm with `ps` again before starting fresh.
- **Astro/Vite cache clear sequence:** `rm -rf .astro node_modules/.vite` before `npm run dev`. Plugin changes especially need this; some changes hot-reload, others require a full restart, and the cache directories can hold stale compiled output across both.

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

### 2026-05-12 — architectural cleanup pass (three commits)

- **`2a843b6`** refactor: remove duplicate `.prose strong` rule from tailwind config. First step in the dedup work — eliminated the simplest of three competing definitions.
- **`9834d99`** refactor: consolidate prose styling in global.css, switch code to Option B. The structural commit. Removed all `.prose`-element overrides from `BlogLayout.astro` (kept only layout-component rules: `.post-tag` hover, `.callout` family). Moved full blockquote styling into global.css. Switched code block styling from `bg-card` + accent text to `bg-card`-distinct `code-bg` + `code-text`. global.css is now the single source of truth for prose-element styling.
- **`025f920`** style: restyle `.prose h3` as real subheading, convert post labels to use it. Made h3 visibly distinct from h2 (text-secondary color, 1.15em, weight 600 versus h2's accent-blue 1.5em). Converted the three cost labels in the new post from bold-on-own-line back to `###` headers, which now look correct. Three-tier hierarchy is real and usable.

### 2026-05-12 — earlier same day

- Site-wide bold-as-accent experiment shipped and then reverted same day. Cost labels in the new post settled as bold-on-own-line (later changed again in `025f920`). See commits `455d441` (revert) and `1acbcc1` (original attempt).
- New post: "AI Is Not Free. Inaction Has an Invoice Too" — coda to the AI-is-not-free trilogy. Live at `https://sudomakevibe.com/blog/ai-is-not-free-inaction-has-an-invoice-too`.

### Items removed from cleanup section because they were not actual bugs

- **`remark-reading-time` plugin "fix"** — investigated 2026-05-12, no fix needed. The plugin was always working correctly (already stripped HTML/code/inlineCode/table; calibrated to 265 wpm against Medium). The TODO entry that called for "200 wpm and strip link URLs" was based on a mistaken understanding. Removed from cleanup; the open question of "drop manual readingTime overrides" lives in Site features and styling.

### 2026-04-20

- Site launched. Astro, Tailwind, Vercel, GitHub auto-deploy, self-hosted JetBrains Mono, four brand-aligned themes (sudo-dark, sudo-light, arctic-frost, earthy-glow), all WCAG AA compliant with FOUC prevention.
