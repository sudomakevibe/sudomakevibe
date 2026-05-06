# Publish checklist — sudo make vibe: how it was built

Target launch: Tuesday, May 6, 2026, ~9 AM ET

---

## Pre-flight (the night before or morning of)

- [ ] Pull latest from main: `cd ~/Developer/sudomakevibe && git pull`
- [ ] Confirm the post is in `src/content/posts/sudo-make-vibe-how-it-was-built.md`
- [ ] Open the file and flip `draft: true` to `draft: false`
- [ ] Final read-through on the dev server: `npm run dev`, then `http://localhost:4321/blog/sudo-make-vibe-how-it-was-built`
- [ ] Cycle through all four themes — confirm rendering holds in `sudo-dark`, `sudo-light`, `arctic-frost`, `earthy-glow`
- [ ] Check mobile width — narrow the browser, confirm nothing wraps awkwardly
- [ ] Stop the dev server (Ctrl+C) once the review is done

## Ship the post

- [ ] `git add src/content/posts/sudo-make-vibe-how-it-was-built.md`
- [ ] `git commit -m "publish: sudo make vibe — how it was built"`
- [ ] `git push`
- [ ] Wait for Vercel build to complete (~1–2 min)
- [ ] Verify live: `https://sudomakevibe.com/blog/sudo-make-vibe-how-it-was-built`
- [ ] Verify the homepage updated to show the new post in the latest-posts section
- [ ] Verify RSS feed includes the new post

## Day 1 — Tuesday, May 6, ~9 AM ET

### LinkedIn

```
Last month I launched sudomakevibe.com. The first thing I did after launch was start writing the post about how I built it.

That post is now live.

"sudo make vibe: how it was built" walks through the stack (Astro, Tailwind, Vercel), the six things that broke during the build, and what a corrupted disk taught me about deployment pipelines.

The decisions it covers:
– Why four themes instead of one, and why every theme had to clear WCAG AA before shipping
– Why the writing happens on a 4GB Ubuntu Server VM with no GUI, no browser, no notifications
– Why "high-fidelity documentation" beats "high-quality content" every time
– Why disk corruption mid-project was annoying instead of catastrophic

The post is a build log, not a tutorial. The useful parts are not "I used Astro and it worked." The useful parts are "here is where it broke, here is what I tried, here is what worked."

Read it: https://sudomakevibe.com/blog/sudo-make-vibe-how-it-was-built

sudo make vibe

#Linux #Astro #WebDev #Homelab #VibeCoding #SelfHosted #ContinuousLearning
```

### X / Twitter

```
Wrote a blog post about how I built the blog the post is on.

The loop is intentional. The failures are honest. The Shiki fight, the FOUC, the disk that corrupted mid-project — all of it.

sudomakevibe.com
```

(X has a 280-character limit per post. The above is under 280. Posting as a single tweet, not a thread.)

## Day 2 — Wednesday, May 7

### Reddit

Reddit needs a different framing — story-first, no hashtags, no marketing tone. Two candidate subreddits:

- **r/selfhosted** — frame around the writer VM and self-hosted philosophy
- **r/webdev** — frame around the Astro stack and the failures

Draft the Reddit posts the night before. Each subreddit gets its own framing, not a copy-paste of LinkedIn.

Suggested Reddit titles (pick one per subreddit):

- "I wrote a build log for my blog — including the six things that broke" (r/webdev)
- "Built a no-GUI writer VM for my blog. Here is the why and the how" (r/selfhosted)

## Day 3 — Thursday, May 8

### Mastodon

Short, casual, link plus one line:

```
new post: sudo make vibe — how it was built

A build log for sudomakevibe.com. The Shiki fight, the FOUC, the disk that corrupted mid-project — all of it.

https://sudomakevibe.com/blog/sudo-make-vibe-how-it-was-built
```

### Dev.to

Cross-post the full article. Use the canonical URL feature pointing back to sudomakevibe.com so SEO credit stays with the original.

- Title: keep as-is
- Tags: webdev, astro, opensource, showdev
- Cover image: same OG image as the site (or skip if not ready)
- Canonical URL: https://sudomakevibe.com/blog/sudo-make-vibe-how-it-was-built

### Hashnode

Same approach as Dev.to — full cross-post with canonical URL.

## Holding for later

- **Hackster.io** and **Hackaday.io** — project-platform sites. The build post is not a project writeup. Hold for the eventual `sudo make homelab` series.
- **Discord** — drop the link in any communities you are active in, with one line of context. Not a launch event.

## Post-launch

- [ ] Check LinkedIn impressions and engagement at end of Day 1
- [ ] Reply to any comments on LinkedIn and X within a day
- [ ] Note which platforms drove the most traffic (Vercel analytics or referrer logs)
- [ ] Capture lessons for the next post launch in `docs/launch-notes.md`

---

## Things to remember

- The post has `draft: true` right now. It will not appear on production until that flag is flipped and pushed.
- Vercel auto-deploys on push to main. No manual deploy step needed.
- The newsletter is paired to the blog (every two weeks). When the post goes live, also send the newsletter using the template in `docs/newsletter-template.md`. Subject: `new post: sudo make vibe — how it was built`.
