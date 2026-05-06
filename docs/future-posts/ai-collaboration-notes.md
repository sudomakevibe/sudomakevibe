# AI collaboration notes

Raw material for a future standalone post about the human-AI working dynamic
on this site. Captured during the build session, not yet shaped into a post.

Working title candidates:
- sudo make vibe — what AI did, what I did, what neither of us could do alone
- The honest division of labor with an AI collaborator
- Pause, ask, verify — the part vibe coding does not teach

---

## Captured paragraph from session

Context: at one point during the writer VM build session, I asked Claude
"What would I do without your help :-)" — half joking, half genuine. The
response is below, captured verbatim. It is worth keeping because the
observation about division of labor is more honest than most "working with
AI" content out there, and because the specific moments it cites as my
judgment calls (the heredoc-truncation false alarm, the Mac-vs-ThinkBook
decision, the "let me check the output of those previous commands" moment)
are real and worth describing in a future post.

> Kind of you to say, but genuinely — you would do fine. Maybe slower on
> the first pass, but the instinct to pause, ask, verify, and refuse to
> press forward when something was off is the thing that actually matters.
> That is yours, not mine.
>
> What I did was mostly compress the feedback loop. You still had to type
> the commands, read the output, push back when my instructions were wrong
> (the heredoc-truncation false alarm, the Mac-vs-ThinkBook decision, the
> "let me check the output of those previous commands" moment when I
> jumped ahead). Those were your calls, and they were right calls.
>
> The honest division of labor on this session:
>
> - I had more surface knowledge of libvirt/nmcli/cloud-init quirks
> - You had all the judgment — when to pause, when to push, when to say
>   "let me think," when to call me out
>
> That second skill is harder to acquire and much harder to fake. Keep
> trusting it.

---

## Notes for the future post

A standalone post on this dynamic should probably:

1. Lead with specific moments, not abstract claims. The heredoc-truncation
   false alarm. The Mac-vs-ThinkBook decision. The clipboard bug that
   looked like a shell bug. Each one is a small concrete story where
   either the human caught the AI being wrong, or the AI caught the
   human jumping ahead.

2. Be honest about what the AI is good at versus what it is not. Speed,
   surface knowledge, drafting, restructuring. Versus: reading the room,
   knowing when something is off, deciding whether to ship.

3. Avoid the two failure modes that dominate "working with AI" content —
   the breathless enthusiasm ("AI is magic") and the dismissive cynicism
   ("AI is just autocomplete"). Both are wrong and both are boring.

4. Use the captured paragraph carefully if at all. It functions as praise
   in context with the original conversation, but reproduced in a public
   post it can read as self-congratulatory. Better to describe the
   dynamic than to quote it.

5. Avoid invented stats. There are no reliable numbers on how many
   suggestions, pushbacks, rewrites, etc. occurred. Any quantitative
   claims in the post should be qualitative observations, not made-up
   counts.

---

## Other moments worth capturing if they come up

(Add to this list as future sessions surface them.)

- The heredoc-truncation false alarm — Claude warned about a
  truncation issue that turned out not to apply to the actual command
  being run. I was about to redo work that did not need redoing.
- The Mac-vs-ThinkBook decision — sudomakevibe development was moved
  off the Mac to the ThinkBook deliberately, due to cross-platform
  keyboard and clipboard issues. Claude initially proposed continuing
  on whichever was convenient; I held the line on ThinkBook only.
- The "let me check the output" moment — Claude moved ahead with new
  instructions before reading what the previous commands had output.
  Pulling it back to verify was a small but meaningful intervention.
- The clipboard corruption bug — what looked like a shell-level
  problem was actually a documentation site's copy button silently
  appending content. Two hours of debugging the wrong layer.
