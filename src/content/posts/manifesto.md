---
title: "Manifesto"
description: "Correctness, reliability, security, maintainability — these are not features. They are disciplines. AI doesn't ship them. You do."
pubDate: 2026-04-09T00:00:00-04:00
tags: ["vibecoding", "linux", "open-source", "philosophy", "manifesto", "raspberry-pi", "cybersecurity", "kubernetes"]
draft: false
---

Something is happening in the way software gets built.

Prompts replace planning. Generated code ships without review. Systems that work in a demo collapse in production. And the people building them move on to the next prompt before they understand why.

This is not a critique of AI. It is a description of what happens when a powerful tool is used without the discipline to back it up.

## Vibe coding — an accelerator, not a replacement. A starting point, not a finish line.

AI can generate code quickly. What it cannot guarantee is correctness, reliability, security, or maintainability. And the gap between what gets generated and what those words actually mean in a real running system is where most vibe coding projects quietly fall apart.

The problem is not the speed, and it is not the AI. A detailed, well-crafted prompt that includes your architecture, your constraints, and your threat model will produce significantly better output than a vague one. Prompt quality matters — and anyone telling you otherwise has not spent enough time with the tools.

But even the best prompt only captures what you already know. It cannot capture the failure mode you have not encountered yet, the edge case you did not think to test, or the security gap that only becomes visible when someone actively tries to find it. AI generates code based on what you ask. It cannot account for what you did not know to ask — and in production systems, that is precisely where things break.

AI is not the system. It is an accelerator. It helps you move faster at the start — exploring ideas, generating scaffolding, getting to a first working version in minutes rather than hours. That is genuinely valuable. But it does not replace judgment. It does not replace the ability to debug something that has never been seen before. It does not make architecture decisions, and it cannot anticipate the failure modes of a system it has never run.

That is why generation is the beginning of the process, not the end of it. The prompt gets you to a starting point. Engineering discipline — review, testing, hardening, iteration — determines whether that starting point becomes something you can actually trust. If anything, the speed AI provides increases the need for these skills — because the gap between a working prototype and a production system fills up faster than ever.

## What actually matters

Real systems are not defined by how they are generated. They are defined by how they behave under real conditions — how they run consistently under load, how they recover when something fails, how they can be inspected and debugged when something goes wrong, and how they can be secured against the threats that appear the moment anything touches a network.

That kind of behaviour does not emerge from a prompt. It requires Linux fundamentals, an understanding of containerisation and orchestration, networking awareness, and the kind of defensive thinking that comes from having seen things break in production.

## The workflow

<div class="code-block-plain"><span style="color: var(--accent);">prompt</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">script</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">container</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">cluster</span><span style="color: var(--text-secondary);"> → </span><span style="color: var(--accent);">system</span></div>

Each step adds reality:

- A prompt becomes a script
- A script becomes a service
- A service becomes a container
- A container becomes part of a system

If you stop early, you do not have a system. You have a prototype.

## Why Linux and open source matter

This approach depends on visibility and control. You need to:

- see what the system is doing
- modify it when it breaks
- understand how components interact

That is why this is a Linux-first, open-source approach.

Not out of preference — but because closed systems limit understanding.

## Where Kubernetes fits

Kubernetes is not the starting point. It is where things go when:

- they need to scale
- they need resilience
- they need structure

Used too early, it adds complexity. Used at the right time, it makes systems durable.

## Security is not a layer

Security is not something you add later. It is part of:

- how you build
- how you expose services
- how you manage access

Ignoring it early creates fragile systems. Addressing it early creates confidence.

## What this site is

This site is a working lab. You will see:

- AI-generated starting points
- systems that fail
- debugging steps
- improvements over time

Not everything will be polished. That is intentional.

Because real systems are not built in a straight line.

## The point

If it only works inside a prompt window, it is not a system.

The goal is not to generate code. The goal is to build something that:

- runs
- survives
- evolves

AI changes how we start. Linux, systems thinking, and engineering discipline determine how things finish.

---

New here? Start with the philosophy behind the site, or see what is being built in the lab.

→ [Start here](/start-here)

→ [See the projects](/projects)
