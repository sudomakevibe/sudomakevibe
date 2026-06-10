---
title: "sudo clear maze"
description: "Consolidating 30+ builds scattered across tools into a single source of truth. Discovery, comparison, and maintenance workflows for scattered work."
pubDate: 2026-06-10T12:00:00-04:00
tags: ["obsidian", "vibecoding", "python", "workflow", "knowledge-management"]
readingTime: "6 min read"
draft: false
---

I have been building across 30+ focused builds. The work lives in four places: working session notes, my ThinkBook, scattered markdown files, and the unreliable backup of memory. When I needed to answer "what am I actually working on," the search took 20 minutes.

I found the same project documented three different ways. One copy was current. Two were stale. I was not sure which was which.

Welcome to the maze.

---

## The Problem Space

Building across distributed tools creates a natural fragmentation. Working sessions are where you brainstorm architecture. Your laptop holds seed files and half-finished outlines. GitHub has version history. Obsidian has your second brain. Downloads has exports and scripts.

Each tool is optimized for its purpose. Together, they create chaos.

The cost is high:
- **Time wasted searching** for what you are actually working on
- **Projects forgotten** because they were only documented in one place
- **Context lost** when you cannot find the constraints, reasoning, or deadline
- **Mental load** from wondering if you are forgetting something important

The problem is not the tools. The problem is fragmentation.

---

## Domain Modeling: What Are We Solving?

Work backward from the goal: **a single source of truth for all projects, seeds, and completed work.**

Constraints:
- Multiple sources (session notes, files, Obsidian, GitHub, Downloads)
- Duplication across sources
- No validation that the master list is actually complete
- Dead projects masquerading as active ones

Required capabilities:
1. **Discovery**: find work scattered across the filesystem
2. **Comparison**: validate what is in the master list against what is scattered
3. **Consolidation**: merge duplicates, decide what stays
4. **Maintenance**: keep the list synced and backed up
5. **Validation**: ensure backups stay healthy

Trade-offs exist. Symlinks are fragile but automate sync. GitHub adds complexity but provides backup. Python scripts add tooling but eliminate manual grep.

Decision: accept tooling complexity for automation and safety.

---

## Discovery: Find What You Built

The maze is impossible to navigate without a map. First, you need inventory.

A simple Python script scans the filesystem:

```bash
python3 find-scattered-todos.py --verbose --export scattered-work.md
```

It finds TODO, FIXME, WIP, DONE, and BLOCKED patterns. It extracts markdown tasks. It searches `~/Documents`, `~/Developer`, `~/Downloads`, the Obsidian vault, and old Joplin exports.

My actual run:

```
🔍 Scanning your ThinkBook for scattered work...
Found 678 items across 95 files
```

Of those 678 items, the overwhelming majority were false positives from `node_modules`: dependency README files that happen to contain the word TODO. The real work lived in a handful of files: seed documents in Downloads, a decisions log in the site repo, and task lists buried in my Obsidian inbox.

The most useful discovery was embarrassing. I had three separate copies of my project TODO file in different folders, all slightly out of sync. One copy had notes the others missed. Consolidation forced me to merge them into a single authoritative version and delete the duplicates.

If that sounds familiar, you are not alone. This is how work actually lives in modern development.

---

## Comparison: Validating Coverage

Now the scattered work is exported to markdown. Next question: **what is missing from the master list?**

A second script compares them:

```bash
python3 compare-todos.py scattered-work.md Master-Todolist.md
```

My actual result:

```
🔍 Comparing scattered-work.md vs Master-Todolist.md
Found 243 actionable items (excluding node_modules)
Already in Master-Todolist: 189
Missing from Master-Todolist: 45
```

Roughly 78 percent coverage on the first pass. The remaining 45 flagged items revealed the blind spots, but most were not real gaps. Reviewing them took five minutes:

- **Genuinely missing work:** 3 items (a human-in-the-loop post idea, Medium post seeds, and a feature status)
- **False positives:** the rest (learning resource links, a shopping list, and hardware inventory already captured elsewhere)

Trade-off: false positives are acceptable. They are easy to skip. Missing real work is the actual problem.

---

## Consolidation: Merge Without Losing

Three states for any work item:

1. **Active**: in progress, blocking other work
2. **Parked**: ready to write or build, waiting for bandwidth
3. **Completed**: shipped, archived

Consolidation is deciding which state each scattered item belongs in. Some real decisions from my pass:

I found a seed file from May titled "Why Theme Switches Flash." Still relevant? Yes. Written? No. Blocking anything? No. Decision: Parked Seeds.

I found a checklist entry for a post that shipped in April. The git log confirmed it. It was still sitting in an active list through pure oversight. Decision: Completed and Shipped, with the commit hash and date recorded.

I found "Learn Rust" in a downloads folder. Real project or passing interest? Passing interest, with no follow-up since. Decision: Learning and Reference, not Active Projects.

**The consolidation principle:** consolidation is not about capturing everything. It is about deciding what deserves cognitive load. Does the item have an owner? Does it have a deadline or dependency? If not, it becomes archive or reference material.

---

## Maintenance: Symlinks + Obsidian + GitHub

The architecture is simple:

```
GitHub repo (backup + version control)
    ↑
    symlink
    ↓
Obsidian vault (your working copy)
```

Why this design:
- **Obsidian is where you work**: native note-taking, no friction
- **The symlink keeps them synced**: no manual copying
- **GitHub is the safety net**: version history and backup

Setup:

```bash
cd ~/Developer/sudomakevibe-notes
ln -s ~/Documents/my_2nd_brain/Master-Todolist.md ./Master-Todolist.md

# Validate it works
python3 scripts/validate-symlinks.py
# Output: ✅ OK Master-Todolist.md
```

Workflow:
1. Edit in Obsidian (daily)
2. Commit to GitHub (weekly, or after major updates)
3. Validate the symlink (monthly)

If the symlink breaks:

```bash
python3 scripts/validate-symlinks.py --fix
```

Recovery is automatic. You are never more than one command away from a working system.

---

## Iteration: Knowing When to Split

**Starting point:** one file, Master-Todolist.md, around 400 lines.

**When to split:**
- You scroll past sections you do not need
- You create sub-sections within a section (the signal for a new file)
- You link to it from multiple places and want to reference parts independently

**Current decision:** keep everything in one file. Obsidian search and outline features handle 400 lines fine. Split only when friction appears.

The key insight: **start simple. Add complexity only when it solves a problem.**

---

## What You Discover

When you consolidate, you learn things the scattered version of your work could never tell you.

**How much you have actually built.** I stopped feeling like I was doing nothing and realized I had shipped more than I thought. Thirty builds is real work, and seeing it in one place proves it.

**What you are really prioritizing.** Not what you say you prioritize. What you actually spend time on. The list does not lie.

**What ideas are worth keeping.** Some scattered seeds are dead projects. Some are goldmines you forgot about. Consolidation forces the decision.

**Where the duplication hides.** Three copies of one TODO file, each holding a fragment of the truth, is not a filing problem. It is a signal that no single place was trusted enough to be the source of truth.

The maze becomes clear. You see the paths you took. You see where you got stuck. You see what you actually built.

---

## The Payoff

I started with scattered work across 30+ builds. I built scripts to discover it, compared the findings against a master list, consolidated the duplicates, and set up a system to maintain it.

Now when someone asks what I am working on, the answer is not a 20-minute search. It is "open Master-Todolist.md."

The payoff is not the perfect system. It is the clarity to know what you are actually building and the confidence to prioritize what comes next. You have tools to find the needle in the haystack when needed.

Clearing the maze does not require a perfect map. It requires one authoritative source of truth, updated regularly, backed up safely.

That is what "sudo clear maze" does.

---

## The Scripts

All three scripts are open source (MIT) at [github.com/sudomakevibe/sudo-clear-maze](https://github.com/sudomakevibe/sudo-clear-maze):
- `find-scattered-todos.py`: discover scattered work
- `compare-todos.py`: validate master list coverage
- `validate-symlinks.py`: health-check the backup system

Each is documented and runnable. Each solves one specific problem.

---

## Next Steps

1. Scan your filesystem for scattered work
2. Create a master list with everything in one place
3. Set up a symlink to keep it synced to your notes app
4. Back it up on GitHub
5. Validate monthly
6. Update weekly, or after major work

The system is simple. The payoff is clarity.

Start simple. Iterate as needed.
