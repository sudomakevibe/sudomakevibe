---
title: "Theme Updates: Solar Bloom and a Discoverability Toast"
description: "Two small changes to sudomakevibe.com: a new warm light palette replacing earthy glow, and a session-scoped hint about the theme switcher."
pubDate: 2026-05-14T22:00:00-04:00
tags: ["design", "webdev", "homelab", "open-source"]
readingTime: "3 min read"
draft: false
---

Two small changes shipped to sudomakevibe.com today.

## Solar bloom replaces earthy glow

The site has shipped with four themes since launch: `sudo-dark`, `sudo-light`, `arctic-frost`, and `earthy-glow`. The earthy-glow palette was Solarized Dark derived, with deep teal backgrounds and warm cyan accents. It was the calm, evening-reading theme.

What was missing was a warm light theme. The `sudo-light` palette runs cool and blue, optimised for daylight readability. There was no equivalent for someone who wanted a light theme with warmth, like reading on paper instead of glass.

`solar-bloom` fills that gap. The background is Solarized Light cream (`#fdf6e3` <span style="display:inline-block;width:14px;height:14px;background:#fdf6e3;border:1px solid #ccc;vertical-align:middle;margin-left:4px;"></span>). The accent is a custom warm caramel (`#8b5a2b` <span style="display:inline-block;width:14px;height:14px;background:#8b5a2b;border:1px solid #ccc;vertical-align:middle;margin-left:4px;"></span>) that pairs against the cream with a 5.42:1 contrast ratio, comfortably above WCAG AA Normal. The hover state deepens to coffee (`#6f3f1a` <span style="display:inline-block;width:14px;height:14px;background:#6f3f1a;border:1px solid #ccc;vertical-align:middle;margin-left:4px;"></span>) at 8.11:1. Code blocks use a deeper burnt orange (`#7d3505` <span style="display:inline-block;width:14px;height:14px;background:#7d3505;border:1px solid #ccc;vertical-align:middle;margin-left:4px;"></span>) at 6.02:1 on the Solarized base2 background.

The visual character: paper, parchment, sunlit cream. It is Solarized-derived but with a custom warm accent rather than the canonical Solarized blue. The blue did not work for this site's voice, and the canonical version did not pass AA on cream backgrounds anyway. The caramel does both.

The four themes now ship as `sudo-dark`, `sudo-light`, `arctic-frost`, and `solar-bloom`. All four pass WCAG AA across their key colour pairs.

## A toast for theme discoverability

The theme switcher lives in the footer. That works for returning readers who have already found it. It does not work for new visitors who never scroll far enough to discover the site offers a palette choice at all.

The fix is a small hint toast. It appears in the bottom-right of the viewport, two seconds after the page loads, sliding in from below. The copy is terminal-styled to match the site's voice:

$ ls ~/palettes
four themes available, switch at the footer

A close button dismisses it. The dismissal is stored in `sessionStorage`, so the hint does not return for the rest of that browser session. The next time someone visits in a fresh session, it shows up again.

This is deliberate. A "first visit ever, then never again" hint misses returning visitors who never noticed the first time. A "always on" hint is annoying. Session-scoped hits the middle: it surfaces periodically without being a permanent fixture, and frequent readers see it once and move on.

The implementation is about 30 lines of code and a small block of CSS. The toast styling uses the active theme's CSS variables, so it adapts automatically to whichever palette is currently selected.

## Why these together

Both changes share a single principle: theme variety only works if people can use it. Adding a fourth theme that nobody discovers is the same as not adding it. The hint exists to close that gap. The new theme exists to make the gap worth closing.

If you have been here before and the theme switcher was unfamiliar, the answer is at the bottom of the page. Four palettes, one click each, no account needed.
