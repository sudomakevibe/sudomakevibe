---
title: "Your Notes Are Not a Second Brain. They Are a Haystack!"
description: "After months in Joplin, I went looking for the needle under pressure and found out which retrieval features actually matter at 11pm."
pubDate: 2026-06-02
readingTime: "6 min read"
tags: ["pkm", "obsidian", "joplin", "homelab", "workflow"]
draft: false
---

It is 11pm. A Kubernetes cluster is down. You know you have seen this exact symptom before, maybe six months ago, on a different cluster, and you know you wrote it down. So you open your notes, type the symptom into search, and get three results. None of them link to each other. You start reading all three. Twenty minutes later you find the one line that matters, apply it, and the cluster recovers.

The fix worked. The twenty minutes lost forever!

I have been using Joplin as my technical notebook for the last few months. It is a good tool. It syncs cleanly across several platforms (Ubuntu, macOS, iPadOS, iPhone, and Windows 11), it is fully open source, and it never lost a note on me. But as my content grew, I started running into that 11pm problem more often, and I started paying attention to a different question than the one most people ask when they pick a notes app.

## Your notes are not for writing

The question most people ask is "which app is nicer to write in." That is the wrong question — and it is the reason most personal knowledge management (PKM) systems end up as expensive haystacks. Writing is the easy part. Capture is solved. Every tool on the market lets you get words onto a page quickly.

The hard problem is quick retrieval. The value of a PKM is not the writing you did six months ago. It is your ability to find that writing in the ninety seconds you have before the incident gets worse. A second brain that you cannot search under pressure is just a haystack with your handwriting on it.

So the real evaluation is not about themes or markdown editors. It is about how well a tool answers the questions you actually ask when something is broken.

## The five questions you ask at 11pm

Strip away the feature lists and every retrieval need collapses into five questions:

1. Did I write about this before? This is plain full-text search.
2. What else did I write that mentions this without explicitly linking to it? These are unlinked mentions.
3. Where exactly inside that 800-word note is the part I need? This is heading-level linking.
4. What other notes connect to this one? These are backlinks.
5. What have I written about this topic recently? This is a live query index.

These are not features. They are jobs. And the difference between a notebook and a second brain is how many of these jobs the tool does for you instead of making you do them by hand.

## How Joplin handles the five jobs

I want to be fair here, because I used Joplin for real work and it earned my respect.

Full-text search works well. It is fast and it finds the phrase. Backlinks exist, but only through third-party plugins such as Easy Backlinks or the Note Link System, not in the core app. A graph view exists, again through a community plugin, and it works, though the community itself documents performance problems on larger vaults where the graph becomes unresponsive.

Then the list runs out. Unlinked mentions: not available, with or without plugins. Heading-level links to a specific section of another note: not available. A live query that builds an always-current index of your recent notes: not available.

This is not a knock on the project. It reflects what Joplin was built to be. It is a notebook, descended in spirit from Evernote, optimized for clean capture and reliable sync. Retrieval under pressure was simply not the design goal. The gaps are architectural, not a backlog waiting to be cleared.

## How Obsidian handles the five jobs

Obsidian was built with linking as a first-class idea rather than a bolt-on, and it shows in exactly the places that matter at 11pm.

Unlinked mentions is the feature I did not know I was missing. Say you wrote about `CrashLoopBackOff` in four different notes over the past year and never linked them, because at the time they felt unrelated. Obsidian surfaces all four automatically the moment you open any note on the topic. The connections you forgot to make get made for you. Joplin cannot do this at all.

Heading-level links change how you write runbooks. A Linux permissions note might run 800 words across `chmod`, `chown`, ACLs, and `umask`. In Obsidian you link straight to `[[linux-permissions#ACL]]` and land on the exact heading. In Joplin you link to the whole note and start scrolling, which is the last thing you want to do while a ticket is open.

Composable search is the quiet workhorse. Obsidian lets you scope a query the way you would scope a log filter:

```
tag:#kubernetes path:homelab "CrashLoopBackOff"
```

That returns only the homelab notes, tagged kubernetes, that contain the exact phrase. One query, scoped three ways. Joplin search finds the phrase but cannot compose tag scope and path scope into a single expression, so you get more noise and do more reading.

The live index is the payoff feature, and it deserves an honest caveat: it comes from the Dataview community plugin, not from core Obsidian. With it, a single note can hold a query like this:

```dataview
TABLE file.mtime AS "Last edited"
FROM #kubernetes
WHERE file.mtime >= date(today) - dur(30 days)
SORT file.mtime DESC
```

That note becomes a live dashboard of everything you have touched on Kubernetes in the last thirty days. It is always current and you never maintain it by hand. Joplin has no equivalent.

## Where Joplin still wins

If I only told you the retrieval story, you would walk away thinking Joplin is the weaker tool across the board. It is not. It wins cleanly on several things, and most of them matter more for capture than for retrieval.

Sync is free and needs no setup. Joplin talks to Nextcloud, Dropbox, OneDrive, S3, and WebDAV out of the box. I have been running it against OneDrive across all my devices without a single sync failure. Obsidian sync is either a paid subscription or a self-hosted project you stand up yourself. End-to-end encrypted sync ships in Joplin's core, with no plugin and no paid tier. There is a first-party web clipper for Firefox and Chrome, which Obsidian does not match natively. And Joplin is fully open source under the AGPL, end to end, while Obsidian's application is free but closed source.

These are real advantages. If your bottleneck is fast, private, zero-cost capture across a fleet of devices, Joplin is arguably the better pick. The tools are not better and worse. They are optimized for different jobs.

## The job decides the tool

My job is retrieval under pressure. I write runbooks so that future-me can find a fix at 11pm without reconstructing it from scratch. For that specific job, unlinked mentions, heading-level links, and a live index are not luxuries. They are the difference between ninety seconds and twenty minutes.

So I am moving my technical vault to Obsidian, with two honest caveats I am not going to hide. Two of its strongest retrieval wins, the live index and the deeper graph features, depend on community plugins rather than core. And cross-platform sync is a decision I have deliberately parked. For now I am using Obsidian's own sync while my homelab matures, and I will revisit a self-hosted option in a later post once the infrastructure is actually standing.

The migration itself is almost anticlimactic. Joplin exports clean Markdown. You open that folder as an Obsidian vault and your content is already there, links and all. The barrier is far lower than it looks from the outside, which is the other reason I stopped agonizing over the decision and just ran the test with my own notes.

Back to the cold open. Same cluster, same 11pm, same `CrashLoopBackOff`. This time I type the symptom, unlinked mentions surfaces the note I forgot I wrote eight months ago, a heading link drops me straight onto the exact fix, and a Dataview index shows me three related notes I have written since. Ten seconds, not twenty minutes.

That gap does not come from being more organized or more disciplined about linking notes at the time of writing. It comes from the tool doing the connective work that a notebook leaves to you. A second brain is not a place where you store things. It is a system that surfaces the right thing at the right moment without you having to remember you wrote it down.

The tool did not make me smarter. It removed the twenty minutes of friction between what I already knew and when I needed it. At 11pm, with a cluster down and a ticket open, that is the only metric that matters.

If you are sitting on a Joplin vault right now, run the export and open it in Obsidian before you commit to anything. The migration takes ten minutes and you will see immediately whether your own notes light up differently. That test is worth more than any feature comparison, including this one.
