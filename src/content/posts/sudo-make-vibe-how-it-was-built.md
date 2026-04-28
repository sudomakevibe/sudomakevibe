---
title: "sudo make vibe: how it was built"
description: "The build log for sudomakevibe.com — stack decisions, six things that broke, and what a corrupted disk taught me about deployment pipelines."
pubDate: 2026-04-28T00:00:00-04:00
tags: ["vibecoding", "astro", "linux", "homelab", "webdev", "selfhosted"]
draft: true
---

This post is slightly absurd. It is a blog post, published on a blog, describing how that blog was built, using the same workflow the blog is about. The loop is intentional.

sudomakevibe.com is a documentation project. The homelab generates the experiments. The experiments generate the posts. The posts document the homelab. This post is where that loop closes for the first time.

Here is how it actually went.

---

## the name came first

Before a single line of code, there was a naming exercise. Poetic options, punchy tech-forward names, terminal-themed options — a full shortlist. Finalists included *Sudo Vibe*, *Echo $VIBE*, *Daemon Threads*, and *Latent Space*.

*sudo make vibe* won because it works on every layer.

`sudo` — superuser do. Elevated privileges. You are taking control of the system.
`make` — the classic Linux build tool. You turn source into something real.
`vibe` — vibe coding. AI as a creative partner, moving from idea to working implementation faster than you have any right to.

Read together it is a command: run with root, build something, let AI carry the flow. The hacker ethos of Linux meets the emerging era of AI-assisted development. The tagline followed naturally — *where the command line meets the creative line*.

The naming convention then propagated across the entire project structure. Every project card on the site follows it: `sudo make homelab`, `sudo make homelab secure`, `sudo make homelab ai`, `sudo make homelab observe`. Once the name was locked, the architecture of the content became obvious.

---

## the stack

The goals were simple: fast, static, version-controlled, deployable in one push, and visually coherent with the terminal aesthetic without being a parody of it.

The stack that emerged:

- **Astro** — static site generator with content collections for the blog
- **Tailwind CSS** with the typography plugin — styling without writing much CSS
- **Vercel** — hosting and auto-deploy from GitHub on every push
- **Shiki** with the Dracula theme — syntax highlighting
- **JetBrains Mono** — self-hosted, used for headings and code blocks to carry the terminal aesthetic into the typography
- **ConvertKit** — newsletter via a serverless function
- **remark-reading-time** — reading time per post
- **JSON-LD structured data** and Open Graph meta tags for SEO

Nothing exotic. The exotic part was making it hold together aesthetically while staying readable and performant.

---

## the build — and where it broke

This is the part worth reading. Anyone can write "I used Astro and Tailwind and it worked great." The useful version is what broke, what I tried, and what actually fixed it.

### 1. flash of unstyled content on theme load

The site has four themes: `sudo-dark` (default), `sudo-light`, `arctic-frost`, and `earthy-glow`. Theme persists via `localStorage` so returning visitors get their last selection.

The problem: the theme script was loading asynchronously, which meant there was a visible flash of the default theme before the saved one applied. On a site built around a deliberate visual identity, that flash is not acceptable.

The fix was to move the theme script into an inline `<script>` block inside `<head>` that executes synchronously before first paint. All four themes were inlined directly into `BaseLayout` — no network fetch required, no async gap, no flash.

### 2. Shiki syntax highlighting vs. custom CSS

The Dracula theme generates inline `style` attributes on `<span>` elements. That is by design — Shiki is thorough. The problem surfaced when plain-text pipeline strings like `prompt → review → test → harden → ship` were rendered inside fenced code blocks. Shiki treated them as code, applied syntax coloring, and the inline styles overrode the CSS variables the theme system relied on.

The fix had two parts. First, pipeline strings moved out of fenced code blocks and into a custom `<div class="code-block-plain">` with explicit `accent` and `muted` spans for visual structure. Second, a catch-all rule — `.prose pre code span { color: var(--code-text) !important; }` — was added to neutralize any stray Shiki spans that slipped through. Shiki stays enabled for future posts that contain actual code. The problem was the content type, not the tool.

### 3. reading time plugin failure

`remark-reading-time` is a remark plugin that injects reading time into frontmatter during Astro's build pipeline. It did not populate correctly through Astro's content collection schema.

The fix was to stop relying on the frontmatter injection and calculate reading time directly from `post.body` at render time. Fewer moving parts, same result, no dependency on the plugin's integration behavior.

### 4. homepage CTA button styling

Two CTA buttons on the homepage looked inconsistent across themes. The hover state was fighting the base state — the specificity order was wrong and the result was visually noisy.

The fix: both buttons default to grey. On hover, they shift to a blue border and blue text via a dedicated `.cta-btn:hover` class. Consistent across all four themes. Clean.

### 5. about page mobile overflow

The about page uses a terminal-block format — `$ whoami`, `$ cat origin-story.txt`, `$ ls ~/homelab`, and so on. The homelab directory listing and social links sections used fixed-width columns and space-padding for alignment. On mobile, the description text overflowed the card container.

The fix was converting both sections to `flex flex-wrap items-baseline gap-x-3 gap-y-1` with `overflow-wrap: anywhere` on description text. The homelab section moved from space-padded columns to a data-driven array with a proper flex layout. It now holds at any viewport width.

### 6. disk corruption mid-project

The ThinkBook developed a corrupted disk during the build. This is the failure that has nothing to do with code.

The fix was already in place before the failure happened: everything was in GitHub, deployment was on Vercel, the only thing not in version control was the `.env` file — which lives in Vercel anyway and never touches the local repo. After the rebuild, full restoration was `git clone` plus `npm install`.

The lesson is not "use GitHub." The lesson is that a clean deployment pipeline converts hardware failure from catastrophic to annoying. The system absorbed the failure because the architecture assumed it would eventually happen.

---

## the writing standards

The code decisions were straightforward compared to the voice decisions.

No contractions in body prose — contractions are allowed in titles and descriptions for punch, but body text uses the full form. This is not a style preference, it is a signal. It reads differently. More deliberate. American English spelling throughout.

The tone target: practitioner in the trenches, not expert on a mountain. The homelab exists, the failures happened, the patches are real. Nothing is shipped as finished output from a single AI prompt pass. Everything goes through review, iteration, and a final read.

"High-fidelity documentation" rather than "high-quality content" — the distinction matters. High-quality content is what a YouTuber promises. High-fidelity documentation is what a systems architect produces. Fidelity means accuracy to the source. In Linux, Kubernetes, and security work, one misplaced character breaks the reproduction. The word earns its place.

---

## visual aesthetics and cognitive impact

Color choice on a technical blog is not decoration. It is a readability decision, and on long-form posts about Linux, networking, and AI infrastructure, readability compounds. A theme that looks beautiful for thirty seconds but forces the reader to lean closer to the screen by paragraph four has failed at its actual job.

Two anchors shaped the work. The first was **WCAG AA** — the Web Content Accessibility Guidelines contrast standard. AA is the floor that keeps text legible across vision conditions, ambient lighting, and screen quality. Every theme that shipped had to clear it. Not as a checkbox, as a gate. A palette that did not meet AA did not become a theme.

The second anchor was **Solarized** — Ethan Schoonover's developer color scheme from 2011, designed around symmetric relationships in CIELAB color space rather than aesthetics. Solarized established something that mattered for this site: that a developer color scheme can be a research output, not a style choice. The palette has documented contrast ratios, deliberate lightness differentials, and dual-mode coherence from a single base. It is the reference point for treating color seriously.

`earthy-glow` is openly Solarized-derived — the `#002b36` background is Solarized Dark's `base03`. The other three themes are original work, built to the same standard:

- **`sudo-dark`** — the default. Cool blue-black for low-light reading.
- **`sudo-light`** — daylight readable, cool-toned, for outdoor or bright-office reading.
- **`arctic-frost`** — Nord-adjacent slate tones, softer than `sudo-dark` for extended sessions.
- **`earthy-glow`** — Solarized lineage, warmer cast, designed for evening reading.

Four themes exist because no single palette serves every reader and every environment. The same contrast standard applies to all of them. The variety is in the temperature, not the rigor.

---

## launch

The site went live April 20, 2026 with three posts: the welcome post, the manifesto, and *why your terminal doesn't care about my voice*. Two more — *AI is not free* parts one and two — were written and queued.

LinkedIn day-one: 1,028 impressions. X: minimal, as expected for a new account. Reddit posts were scheduled for day two to reach communities where the content is relevant rather than where the audience already knows me.

---

## what is next

The content roadmap follows the project card naming convention:

- `sudo make homelab` — the physical lab build
- `sudo make homelab secure` — WireGuard, SSH, NetBird, OpenZiti, Ansible, OpenTofu, Packer
- `sudo make homelab ai` — Ollama, InstructLab, RAG
- `sudo make homelab observe` — Prometheus, Grafana, AIOps

Technical debt still on the list: Shiki `css-variables` implementation for real syntax highlighting in code-heavy posts, mobile table overflow fix, OG image conversion from SVG to PNG, Giscus comments, and eventually an Astro 5 to 6 upgrade when it becomes relevant to production.

The longer-term picture is the closed loop: the site documents the homelab, the homelab runs the AI, the AI informs the content. This post is the first place that loop is visible end to end.

The source is on GitHub. The deploy is on Vercel. The disk can corrupt again whenever it wants.

---

## the writer VM

The writing happens in a box. Specifically, a 4GB Ubuntu Server VM running on a Lenovo ThinkBook in my home office, with no GUI, no browser, no ads, no notifications. Just a terminal, git, and a static site generator. If the box goes down, the blog goes down with it. That is the deal I made with myself.

**Why a VM.** The blog deserves its own environment — specifically, one that survives whatever I am doing to the rest of the lab. The homelab is a place where things get broken and rebuilt on purpose. Networks get reconfigured. Hosts get reimaged. Experiments fail in ways that take down adjacent services. A writing environment that lives inside that blast radius will eventually go down at exactly the moment a post needs to ship. Putting the writer on its own VM, with its own snapshot, on a host that is not part of the experimentation tier, means lab work and writing work do not share a fate. There is also a self-consistency point — I work in telco infrastructure for a living. Treating my own writing tools the way enterprise treats production, separated and reproducible, is the right substrate for someone writing about infrastructure.

**What it actually is.** Ubuntu Server 24.04.4 LTS on the GA kernel. 2 vCPUs, 4GB RAM, a 40GB thin-provisioned qcow2 disk. NAT'd networking — the VM only needs to reach out to GitHub, npm, and Vercel, never inbound. SSH key authentication only, no passwords. The user inside is named `writer`. Hosted on the ThinkBook running KVM. Built reproducibly from a cloud-init seed and snapshotted clean before any customization, so a `virsh snapshot-revert` returns the VM to pristine in about thirty seconds. The full host story — hypervisor, bridges, the three-tier writing-rehearsal-production design — lives in the homelab project card.

The setup is unglamorous on purpose. Fire up the VM, SSH in, `cd ~/Developer/sudomakevibe`, write. The infrastructure is boring and that is the win.
