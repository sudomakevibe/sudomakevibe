# sudomakevibe — TODO

Living backlog for the sudomakevibe.com site. Parked work, durable rules learned through experience, and future ideas. Update as items land or new ones surface.

Last updated: 2026-05-17.

---

## Architectural cleanup

Items here are not blocking, but they are maintenance traps that will cost time later if left alone. Each is a session of focused work.

- [x] **Deduplicate `.prose strong` styling.** 2026-05-12, `2a843b6`. Removed the rule from `tailwind.config.mjs` typography extend. `global.css` is now the cascade-level source of truth (with `BlogLayout.astro` cleanup landing in the next commit).

- [x] **Deduplicate `.prose h3` styling.** 2026-05-12, `9834d99` + `025f920`. The dedup itself landed in `9834d99` (consolidated all `.prose`-element rules into `global.css`, removed `BlogLayout.astro` overrides). The h3 was also restyled in `025f920` to text-secondary color at 1.15em weight 600 so `###` produces a real subsection treatment rather than an accent-blue near-clone of `##`. Three-tier hierarchy (h2 → h3 → body) now works.

- [x] **Fix `remark-reading-time` plugin.** 2026-05-12, no commit. Investigated and determined the plugin was never broken. The original TODO entry was wrong on two counts: it claimed the plugin used 150 wpm (actually 265, calibrated against Medium) and that it did not strip non-prose tokens (actually it already strips html, code, inlineCode, table). Verified via diagnostic script that stripping link URLs would change zero words. Entry kept checked-off for the record so future-me does not relitigate. Related open decision moved to "Site features and styling" below.

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
- [ ] **"Why theme switches flash" post.** Raw material captured 2026-05-17. The story: theme switcher felt smooth within same-luminance pairs (light↔light, dark↔dark) but jarring across light↔dark. Three obvious fixes failed (slower global transition, opacity dip, smoother opacity dip). Real fix was surgical — detect cross-luminance switches in JS and apply a longer 0.5s transition only for those cases. The bug along the way: clipboard corruption produced invalid CSS that the browser silently dropped, making the broken state feel right. Lesson: motion that ignores luminance topology fails. The eye adapts to ambient luminance, and transitions that violate that adaptation register as flashes regardless of timing.

---

## Site features and styling

- [x] **Shiki `css-variables` theme for syntax highlighting.** 2026-05-14, `75b13c8`. Wired css-variables theme in astro.config.mjs with bash as defaultLang. Added --astro-code-* variables to all four theme blocks in BaseLayout.astro. Code blocks now show proper syntax colours that respect the active palette.

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

Longer-form context for what landed recently. Kept here as a changelog companion to the inline `[x]` checkmarks above. Prune anything older than 90 days.

### 2026-05-14 — full stack refresh (Ubuntu, Node, Astro 4→6, Shiki, solar-bloom, ThemeHint)
Three intensive sessions across May 14-17, capturing infrastructure refresh, theme system polish, and two published posts.
- **`f1088e0`** Node v24.15.0 LTS pinned via nvm. `.nvmrc` committed to repo root. Migrated from non-LTS v25.9.0 (EOL Oct 2026).
- **`d3218b6`** Astro 4.16.18 → 6.3.3 migration. Content Layer API: `src/content/config.ts` moved to `src/content.config.ts` with glob loader. `defineCollection` stays in astro:content; `z` moved to astro/zod. `entry.render()` → `render(entry)` throughout dynamic routes. `post.slug` → `post.id.replace(/\.mdx?$/, '')` everywhere it was referenced. `@astrojs/tailwind` removed (incompatible with Astro 6); replaced with direct PostCSS config + autoprefixer. Tailwind v3 stays. Migration done on `astro-v6-upgrade` branch, merged only after clean local build.
- **`75b13c8`** Shiki css-variables theme with bash as defaultLang. Theme-aware syntax highlighting across all four palettes. Ubuntu CVE post published (`/blog/ubuntu-upgrade-astro-6-zero-downtime`).
- **`5cf9d6b`, `57d9472`, `1e336d0`** Slug undefined fixes. Three pages still referenced `post.slug` after the Astro 6 migration — blog index, homepage latest posts, RSS feed. All fixed.
- **`e03f5c7`** Slug bug addendum added to Ubuntu post. 265 wpm standard documented in DECISIONS.md.
- **`ede4296`, `0816dc4`** Two custom SVG diagrams added to Ubuntu post (three-layer isolation model, practitioner upgrade flowchart). Inline code background removed for prose readability — kept transparent with accent colour, only code blocks retain bg fill.
- **`cf802a8`** Replaced earthy-glow (Solarized Dark) with solar-bloom (Solarized Light cream + warm caramel accent #8b5a2b). All four themes now pass WCAG AA. Note: canonical Solarized Light fails AA out of the box — caramel was chosen as a custom accent that hits 5.42:1 against cream.
- **`dc3eccc`** ThemeHint toast added. Bottom-right hint, slides in after 2s, dismissible. Session-scoped via sessionStorage. Returning visitors see it again the next session.
- **`8d23a43`, `80d715d`** Theme updates post published (`/blog/theme-updates-solar-bloom`). Documents solar-bloom replacement and ThemeHint discoverability work.
- **`c7225d0`** Smooth cross-luminance theme switches. 0.5s ease-in-out for light↔dark transitions, snappy 0.2s preserved within same-luminance pairs. `prefers-reduced-motion` respected.

### 2026-05-12 — architectural cleanup pass

Three commits resolved the duplicated prose-styling that consumed the May 12 debug session.

- **`2a843b6`** refactor: remove duplicate `.prose strong` rule from tailwind config. First step in the dedup work — eliminated the simplest of three competing definitions.
- **`9834d99`** refactor: consolidate prose styling in global.css, switch code to Option B. The structural commit. Removed all `.prose`-element overrides from `BlogLayout.astro` (kept only layout-component rules: `.post-tag` hover, `.callout` family). Moved full blockquote styling into global.css. Switched code block styling from `bg-card` + accent text to `code-bg` + `code-text`, making code visually distinct from prose treatments (callouts and blockquotes share `bg-card`) and freeing accent blue to mean "link or section header" without ambiguity.
- **`025f920`** style: restyle `.prose h3` as real subheading, convert post labels to use it. Made h3 visibly distinct from h2 (text-secondary color, 1.15em, weight 600 versus h2's accent-blue 1.5em). Converted the three cost labels in the new post from bold-on-own-line back to `###` headers, which now look correct. Three-tier hierarchy is real and usable.

### 2026-05-12 — earlier same day

- Site-wide bold-as-accent experiment shipped and then reverted same day. Cost labels in the new post settled as bold-on-own-line (later changed again in `025f920`). See commits `455d441` (revert) and `1acbcc1` (original attempt).
- New post: "AI Is Not Free. Inaction Has an Invoice Too" — coda to the AI-is-not-free trilogy. Live at `https://sudomakevibe.com/blog/ai-is-not-free-inaction-has-an-invoice-too`.

### Investigated, not actually a bug

- **`remark-reading-time` plugin "fix"** — investigated 2026-05-12, no fix needed. The plugin was always working correctly (already stripped HTML/code/inlineCode/table; calibrated to 265 wpm against Medium). The original TODO entry that called for "200 wpm and strip link URLs" was based on a mistaken understanding. Diagnostic script confirmed word counts identical with or without link URL stripping. Entry stays checked-off in the cleanup section for the record. The open question of "drop manual readingTime overrides" lives in Site features and styling.

### 2026-04-20

- Site launched. Astro, Tailwind, Vercel, GitHub auto-deploy, self-hosted JetBrains Mono, four brand-aligned themes (originally sudo-dark, sudo-light, arctic-frost, earthy-glow — earthy-glow replaced by solar-bloom on 2026-05-14, see Recently shipped), all WCAG AA compliant with FOUC prevention.
