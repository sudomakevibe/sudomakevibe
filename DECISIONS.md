# sudomakevibe.com — Decisions & Conventions

This file captures key decisions, conventions, and standards established during the build of sudomakevibe.com. Reference this in any new conversation to maintain consistency.

---

## Site Identity

- **Primary tagline:** where the command line meets the creative line
- **Secondary tagline:** where the cursor meets the cluster
- **Philosophy:** AI acceleration + systems discipline
- **Core workflow:** prompt → script → container → cluster → system
- **URL:** https://sudomakevibe.com
- **Owner:** Farooq Ganai — Telco Delivery Executive, Red Hat, Greater Toronto Area

---

## Tech Stack

- **Framework:** Astro
- **Styling:** Tailwind CSS + custom CSS variables
- **Hosting:** Vercel (commercial, not open source — acknowledged transparently)
- **Domain:** Spaceship
- **Newsletter:** ConvertKit
- **Font:** JetBrains Mono (self-hosted in `/public/fonts/`)
- **Syntax highlighting:** Shiki (dracula theme) — plain text pipeline blocks use `<div class="code-block-plain">` instead
- **Reading time:** Calculated directly from `post.body` in page components (not from remark plugin)
- **Repo location (Mac):** `~/Developer/sudomakevibe`

---

## Writing Conventions

- **No contractions** in body copy — "do not", "is not", "it is" not "don't", "isn't", "it's"
- Contractions are acceptable in **titles and headings** only (e.g. "Why Your Terminal Doesn't Care About My Voice")
- **No em dashes** replaced by semicolons where appropriate
- **Sentence case** everywhere — never Title Case in body, headers, or nav
- **No bullet points** for prose — convert to flowing paragraphs where possible
- **High-fidelity** not "high-quality" — site standard term for documentation quality
- Posts end with a **call to action** linking to manifesto and/or projects

---

## Theme System

Four themes, all defined in `BaseLayout.astro` using `data-theme` on the `html` element:

| Theme | Background | Accent | Notes |
|---|---|---|---|
| `sudo-dark` (default) | #0b1623 | #3d8ab5 | Brand palette, warm navy |
| `sudo-light` | #f4f8fb | #236a8a | Brand palette, cool white |
| `arctic-frost` | #2e3440 | #6aaee0 | Nord-based |
| `earthy-glow` | #002b36 | #3498d8 | Solarized-based |

All themes WCAG AA compliant. No flash on load or palette switch.

CSS variables available in all themes:
- `--bg-primary`, `--bg-secondary`, `--bg-card`
- `--text-primary`, `--text-secondary`
- `--accent`, `--accent-hover`
- `--code-bg`, `--code-text`
- `--border`

---

## Navigation

Order: `~/home | ~/start-here | ~/blog | ~/projects | ~/about`

Footer: `home | start here | blog | projects | about` (plain, no ~/)

Active states use trailing-slash-stripped pathname comparison.

---

## Project Naming Convention

All projects follow the `sudo make` naming pattern:

```
sudo make vibe              ← the blog (active)
sudo make homelab           ← the lab (in progress)
sudo make homelab secure    ← securing it (planned)
sudo make vibe --toolkit    ← the workflow (planned)
sudo make homelab ai        ← local AI stack (planned)
sudo make homelab observe   ← observability (planned)
```

Status badges: `active` (blue #3d8ab5), `in progress` (amber #d49436), `planned` (muted #7a9bb5)

---

## Blog Posts

| Post | Slug | Status | Notes |
|---|---|---|---|
| Welcome to sudo make vibe | welcome-to-sudo-make-vibe | published | Complete rewrite |
| Manifesto | manifesto | published | Updated opening, combined sections, prose throughout |
| Why Your Terminal Doesn't Care About My Voice | why-your-terminal-doesnt-care | published | New post |
| AI is not free | ai-is-not-free | draft: true | Ready to publish when needed |

---

## Code Block Convention

Plain text pipeline strings (e.g. `prompt → script → container → system`) use:

```html
<div class="code-block-plain">
  <span style="color: var(--accent);">prompt</span>
  <span style="color: var(--text-secondary);"> → </span>
  <span style="color: var(--accent);">script</span>
  ...
</div>
```

NOT fenced code blocks — Shiki applies syntax highlighting that clashes with the theme.

---

## Reading Time

Calculated directly from `post.body` in page components — not from the remark plugin:

```typescript
function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
```

Applied in both `blog/index.astro` and `index.astro` (homepage).

---

## Social Handles

All @sudomakevibe:
- GitHub, X, Mastodon (mastodon.social), Reddit, Dev.to, Discord, Hashnode, Hackster.io, Hackaday.io
- LinkedIn uses personal profile: linkedin.com/in/farooqganai/
- X personal account: @FarooqGanai — used to amplify @sudomakevibe on launch

---

## Launch Plan

- **Date:** Tuesday April 14, 2026 at 9am EST
- **Platforms:** LinkedIn, X (@sudomakevibe + @FarooqGanai amplification), Reddit (r/homelab, r/selfhosted), Mastodon, Dev.to, Hashnode, Hackster.io, Hackaday.io
- **Key messages:**
  - Site is live
  - Three posts published
  - Built on open source, code will be open sourced as starter template
  - Hosted on Vercel for now — self-hosting on homelab is on the roadmap

---

## Open Source Plan

- **Code** — will be open sourced as `sudomakevibe-starter` or `sudo-make-blog` (MIT or Apache 2.0)
- **Content** — All Rights Reserved, not open sourced
- **Two repo approach:** private repo for full site, public repo for starter template
- Vercel is commercial — acknowledged transparently, self-hosting planned as future project

---

## Pending Items

- [ ] Migration from Mac to Ubuntu ThinkBook
- [ ] Final local test on Ubuntu
- [ ] Push to GitHub and verify Vercel deployment
- [ ] Convert OG image SVG to PNG — `rsvg-convert -w 1200 -h 630 og-default.svg -o og-default.png`
- [ ] Finalise launch copy for all platforms (include open source signal and Vercel transparency)
- [ ] Lab setup diagram — Option 3 (kubectl table) primary + Option 1 (tree) collapsible
- [ ] Personal/hobbies page — `/human` or `/beyond-the-terminal`
- [ ] `sudo make blog` post — documenting how sudomakevibe.com was built
- [ ] `sudo make vibe --self-hosted` — future project when site moves off Vercel
- [ ] Open source starter template — separate public repo
- [ ] Shiki css-variables theme — for future posts with real code
- [ ] Giscus comments in BlogLayout
- [ ] CONTENT-CONVENTIONS.md — slug naming guide

---

## Known Issues / Fixed

- Shiki dracula theme was overriding CSS variables with inline styles — fixed by using `<div class="code-block-plain">` for plain text blocks
- Tailwind prose plugin overriding theme variables — fixed via `global.css` `!important` rules
- Reading time remark plugin not propagating to `post.data` — fixed by calculating from `post.body` directly
- FOUC on theme switching — fixed in BaseLayout with inline theme script
- Homepage newsletter card had gradient — removed, now flat consistent with site design
