---
title: "AI is not free — the costs that never appear on your invoice"
description: "Part two of the AI cost series. Technical debt, false confidence, and the quiet atrophy of engineering skill. The costs that determine whether AI pays off or breaks your systems."
pubDate: 2026-04-29T00:00:00-04:00
tags: ["ai", "vibecoding", "llm", "open-source", "philosophy", "cybersecurity"]
draft: false
---

AI is a powerful accelerator, and like every new tool before it, it takes over work humans used to do. Think about the last time you checked the math your spreadsheet did, or the route your GPS picked, or the spelling your phone corrected. You probably cannot remember. That is fine. Those tools get things wrong in predictable ways, and we learned to live with it. The difference is that AI sounds right whether it is or not. That is what makes the human-in-the-loop still essential. Not as a preference, but as the only part of the system that can tell. The hidden costs of AI are what happens when the human steps out of the loop.

Part one of this series covered the costs you can invoice: tokens, API fees, shadow infrastructure, compliance exposure. Those costs are painful but measurable. You can open a dashboard, see a number, and make a decision.

This post is about the costs you cannot invoice. They compound quietly, show up months or years later, and decide whether your AI investment paid off or quietly broke the systems you depend on. There are three of them, and they share a single mechanism.

## The hidden cost: technical debt

AI generates plausible code. It does not generate correct code by default. The difference between plausible and correct is exactly the gap that technical debt occupies.

Every piece of AI-generated code that ships without proper review carries debt:

- Logic that works in the happy path but breaks on edge cases
- Security assumptions that have not been validated
- Dependencies that have not been audited
- Patterns that do not scale
- Tests that were not written because the AI seemed confident

Technical debt does not appear on an API invoice. It appears six months later when a system breaks under real conditions, when a security audit finds what the model missed, when a new team member cannot understand code that no one fully reviewed when it was written.

The cost of fixing that debt (in engineering time, in incidents, in reputation) dwarfs any API savings.

## The most deceptive cost: false confidence

A model that sounds certain is not a model that is correct.

This is the hardest cost to quantify and the easiest to underestimate. AI systems generate responses with consistent fluency regardless of whether they are right or wrong. A hallucinated API endpoint sounds exactly like a real one. An incorrect security configuration is presented with the same confidence as a correct one. A subtle logic error in generated code looks like working code until it does not.

The danger is not that AI gets things wrong. Compilers have bugs. Databases return stale rows. Humans typo. The danger is that AI gets things wrong in a way that feels like it got things right.

Consider a generated database query that works perfectly in development: correct syntax, returns expected results, passes every test you run. Six months later it brings down production under load because the AI optimized for correctness, not for what happens when ten thousand users hit it simultaneously. It passed review because it looked right. That is not a testing failure. That is false confidence — and it scales with your deployment.

Developers who trust generated output without verification are not moving faster. They are accumulating invisible risk that will eventually become visible, at the worst possible time.

## The cost of dependency

There is one cost that does not appear in any invoice, audit report, or incident postmortem. It shows up years later, quietly, in the shape of a team that has forgotten how to think.

When AI becomes the default first step for every problem, something shifts in how developers work. The reflex to reason from first principles weakens. Junior engineers who start their careers with AI as a crutch never develop the mental models that come from wrestling with a problem directly. Senior engineers stop reading documentation because asking is faster. Teams lose the ability to debug when the service is slow, down, or returns something confidently wrong.

The depth of understanding that comes from building something yourself, being stuck for hours, and finally seeing the pattern — that is not replicable through generated output. It is earned through the struggle AI now lets you skip.

This is not an argument for doing things the hard way out of nostalgia. It is an argument for being deliberate about which parts of the work you delegate. There is a difference between using AI to move faster on the boring parts and using AI to avoid the learning that makes you a better engineer.

## How the three costs compound

So far these read as three separate problems. They are not. They are one problem, viewed at three different points in its lifecycle.

The mechanism is the same in each case: the human stepping further out of the loop.

Technical debt accumulates when humans stop reviewing carefully. Why do they stop reviewing carefully? Because the code looks right. Why does the code looking right undermine review? Because the reviewer has learned to trust the output. Why has the reviewer learned to trust the output? Because they have been doing it for long enough that the reflex to reason independently has weakened.

You do not get three problems in parallel. You get one progressive withdrawal.

A team early in this progression ships AI-generated code that is mostly fine, catches the occasional false-confidence failure in code review, and maintains the skills needed to reason about the codebase independently. Annoying, but manageable.

A team late in this progression ships code few people fully understood, cannot distinguish generated output from careful engineering, and has lost the muscle to tell the difference. When something breaks, the team cannot debug it — not because the problem is hard, but because the skill of sitting with a hard problem has atrophied. The team does not lack intelligence. It lacks practice.

This is why the costs compound. Each one removes the human a little further from the work, which makes the next cost harder to catch, which removes the human a little further, and so on. By the time the effect is visible, the return path is expensive.

## The objection worth taking seriously

There is a strong counter-argument to everything written so far, and it deserves a fair hearing rather than a dismissal.

The objection goes like this: every tool in software history has taken over work humans used to do. Almost nobody inspects assembly output anymore. Almost nobody audits the queries their database library builds. Almost nobody opens the instructions the scheduler is running. Each of those abstractions was once a place where humans exercised judgment, and now it is not. The world did not end. The industry got more productive. Worrying about AI erasing human judgment is just the latest version of a worry that has always been wrong.

This argument is not weak. It is half right.

Where it is right: abstractions have been eating human judgment for decades, and the results have been mostly good. Compilers are more reliable than the humans they replaced. Database libraries write better queries than most application developers would. Automation at scale has been a net gain.

Where it breaks down: those earlier abstractions produced output that was wrong in *predictable* ways. Compiler bugs were reproducible. Database libraries failed in documented patterns. You could learn the failure modes and route around them. The human stopped checking the output because the output had become trustworthy.

AI does not work that way. Its output varies between runs on the same input. Its failures are not patterns you can learn once; they are novel each time. And most deceptively, its wrong answers look exactly like its right answers. There is no feature you can learn to detect that says "this one is hallucinated." The only way to tell is to verify.

That is what makes AI different from prior abstractions. Not that it replaces human judgment — every tool does that to some extent — but that it replaces human judgment with output that cannot be trusted without checking, while simultaneously looking like output that can. That is a new kind of abstraction, and it deserves a new kind of discipline.

The human-in-the-loop is not nostalgia for an older way of working. It is a response to what is actually new about this tool.

## The discipline that keeps the human-in-the-loop

None of this is an argument against using AI. It is an argument for using it in a way that keeps the human where the human needs to be.

The workflow that works is not "generate and ship." It is:

<div class="code-block-plain"><span style="color: var(--accent);">prompt</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">review</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">test</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">harden</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">ship</span></div>

This is not a defensive posture. It is how humans retain authorship of the work they put their name on.

**Review** defeats false confidence. The AI's output is a proposal, not a deliverable. A human who actually reads it, line by line, catches the confidently wrong parts the AI cannot flag for itself.

**Test** catches technical debt. The AI's code is plausible. Tests verify that plausible is also correct. Every time a test fails on generated code, a piece of debt got caught before it shipped.

**Harden** is the discipline of asking what the AI did not consider. Edge cases. Load. Adversarial inputs. Security implications. The AI optimized for correctness on the path you described; hardening is the human thinking about the paths you did not.

**Ship** is the human taking responsibility for what went out the door. Not the AI. The human. That responsibility is the thing that cannot be delegated.

This workflow does not slow you down. It redirects the time AI saved you into the parts of the work that mattered most in the first place.

## A four-question self-audit

Before treating AI as a cost-free accelerator, answer these four questions honestly. If you cannot, you do not yet know what AI is costing you.

- What are your actual monthly AI costs across every tool, subscription, and API in use?
- What percentage of AI-generated code do you review before it ships?
- How many times has generated code broken in a way no one on the team caught until production?
- What would it cost to audit the AI-generated code already running in your systems?

These are not rhetorical questions. They are the real cost of AI-assisted development, and very few teams are tracking any of them.

## The point

AI is not free.

It costs money. It costs engineering time. It costs the discipline to review what it generates. And it costs the intellectual honesty to admit when it got something wrong.

The developers who get the most value from AI are not the ones who use it the most. They are the ones who never stop being the authors of their own work. Who treat generated output as a proposal that a human still has to accept. Who understand that the speed AI gives them is only worth having if what survives the prompt window closing is something they can defend.

Not the speed of generation. The quality of what the human-in-the-loop decides to ship.

---

Part one of this series covered the measurable costs: tokens, APIs, shadow infrastructure, and compliance. If you missed it, start there.

→ [Read part one — the real cost of tokens, APIs, and cloud AI](/blog/ai-is-not-free-part-1)

→ [Read the manifesto](/blog/manifesto)

---

## Further reading

If you want to go deeper into the research and thinking behind this post:

- Shen and Tamkin, ["How AI Impacts Skill Formation"](https://arxiv.org/abs/2601.20245) (arXiv, 2026) — a randomized controlled trial of 52 software engineers. Those who used AI completed coding tasks at similar speeds but scored 17% lower on follow-up comprehension quizzes.
- Simon Willison, ["Hallucinations in code are the least dangerous form of LLM mistakes"](https://simonwillison.net/2025/Mar/2/hallucinations-in-code/) — the counter-intuitive argument that obvious hallucinations are the best kind of LLM failure, because they fail loudly. The dangerous ones are the plausible outputs that pass review.
- Ward Cunningham's original [technical debt metaphor](https://martinfowler.com/bliki/TechnicalDebt.html), via Martin Fowler. Coined in 1992 to explain the cost of shipping not-quite-right code. Still the clearest framing of the problem thirty years later.

---

<div class="callout">
  <strong>Coming in part three</strong>
  <p>Every cost in this series multiplies in regulated industries. Data residency, audit trails, and the obligations that come with operating in Telco, finance, or healthcare turn the human-in-the-loop discipline from a best practice into a non-negotiable. That post is coming.</p>
</div>
