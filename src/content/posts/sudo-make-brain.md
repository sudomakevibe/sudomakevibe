---
title: "sudo make brain"
description: "Building a five-device PKM system on plain Markdown: Obsidian, Neovim, PARA, and the ghost folder that kept coming back."
pubDate: 2026-06-05T12:00:00-04:00
tags: ["obsidian", "neovim", "pkm", "linux", "workflow", "homelab"]
readingTime: "6 min read"
---

## The folder that would not die

The folder was named `00 Inbox`. Every time I deleted it, it came back. I deleted it from the terminal. It came back. I deleted it from the file explorer. It came back. I deleted it, confirmed it was gone, closed the application, and reopened it. It came back.

This was not a bug in the traditional sense. It was Obsidian doing exactly what it was designed to do. That distinction matters, because understanding it is the difference between fighting your tools and working with them.

More on the ghost in a moment. First, why I was building this system at all.

---

## The Joplin exit

Joplin served its purpose. It is a solid, open-source note-taking application with cross-device sync, a clean Markdown editor, and a reasonable organizational structure. The problem was not Joplin. The problem was the proprietary container it kept notes in: a SQLite database that Joplin reads well and everything else reads poorly.

When the time came to move those notes somewhere, the migration path was scripted cleanup, location metadata stripping, and broken image references. That is not a Joplin problem specifically. It is what happens when notes live in any format that is not plain files on a filesystem.

The requirement for the replacement was simple: every note is a `.md` file in a folder. No database, no proprietary format, no vendor lock-in. The tool that reads the files is replaceable. The files are not.

---

## The architecture decision

Obsidian meets that requirement. Notes are plain Markdown files. Sync moves them between devices. The application reads them. When you stop paying for Sync or switch tools, the files remain exactly where they are.

The organizational framework I chose is PARA (Projects, Areas, Resources, Archive), developed by Tiago Forte. The core insight of PARA is that it organizes by actionability rather than topic. A folder named `30_Resources` holds reference material you might use someday. A folder named `10_Projects` holds things with a deadline and an outcome. The taxonomy maps to how you actually work rather than how you might imagine cataloging a library.

One deliberate decision: this vault is a knowledge repository, not a project management system. The heavy property schema that project-management setups use (`effort`, `blocked`, `priority`) is absent here. The properties that remain are `type`, `status`, `created`, and `tags`. Those four support the Bases dashboards that power retrieval. Everything else is noise until proven otherwise.

---

## Five devices and a 9-byte file

Installing Obsidian on Ubuntu 24.04 revealed the first failure path. The standard curl one-liner for the latest release:

```bash
curl -LO https://github.com/obsidianmd/obsidian-releases/releases/latest/download/obsidian_amd64.deb
```

Downloaded a 9-byte file containing the text "Not Found." The release asset includes a version number in the filename (`obsidian_1.12.7_amd64.deb`), and the unversioned path does not resolve. The correct approach is to ask the GitHub API for the actual asset URL:

```bash
curl -s https://api.github.com/repos/obsidianmd/obsidian-releases/releases/latest | grep -o 'https://[^"]*_amd64\.deb'
```

That returns the versioned URL. Download it, verify the file is a real Debian package with `file`, install with `apt`. The pattern applies to any GitHub release that bakes a version number into the asset filename, which is most of them.

The other four devices (Mac, Windows 11, iPad, iPhone) install from their respective stores and connect to the same remote vault through Obsidian Sync. The vault is end-to-end encrypted with a password that lives in a password manager, not a sticky note.

---

## The vault structure

The folder layout on disk:

```
00_Inbox/
10_Projects/
20_Areas/
30_Resources/
40_Archive/
99_Attachments/
Dashboards/
_meta/Templates/
```

Three decisions worth noting. The underscores instead of spaces are deliberate: every folder name is terminal-safe with no quoting required. The numbering uses tens (`10_`, `20_`) rather than ones (`01_`, `02_`) to leave room for categories between the existing ones if the taxonomy needs to grow. The `99_Attachments` folder, pointed to by Settings → Files and links → Attachment folder path, keeps every pasted image and dropped PDF out of the note folders where it would pollute search results and file listings.

The Bases dashboards (Obsidian's native database view, introduced in 1.9) live in `Dashboards/` and give three entry points: Inbox (notes to triage), Projects (active work), Resources (the knowledge base). They are bookmarked, not browsed to. Opening Obsidian means opening a dashboard.

---

## The ghost

Here is what `workspace.json` is: a session state file. Obsidian writes it on every close, recording which files were open, which folders were expanded, which panels were visible. On the next launch, Obsidian reads it and restores that state. This is useful behavior.

Here is what `workspace.json` is not: a configuration file. It does not belong in the same sync bucket as your notes and settings. But Obsidian Sync does not make that distinction. It syncs `workspace.json` alongside everything else, using last-write-wins conflict resolution.

The consequence in a multi-device setup: whichever device closes Obsidian last wins. Its session state overwrites everyone else's. When that session state references a folder path (say, `00 Inbox`) and that folder no longer exists because you renamed it to `00_Inbox`, Obsidian reads the stale reference on the next launch and recreates the missing folder. Every device that still has the old path in its `workspace.json` will push it back out when it closes. The ghost is not a ghost. It is a consensus failure.

The fix requires breaking the cycle rather than fighting individual instances:

1. Close Obsidian on all devices simultaneously
2. Fix `workspace.json` on the source device with `sed`:

```bash
sed -i 's/00 Inbox/00_Inbox/g' ~/Documents/my_2nd_brain/.obsidian/workspace.json
```

3. Temporarily make the file read-only so Obsidian cannot overwrite the fix on launch:

```bash
chmod 444 ~/Documents/my_2nd_brain/.obsidian/workspace.json
```

4. Open Obsidian, confirm the ghost is gone
5. Restore normal permissions:

```bash
chmod 644 ~/Documents/my_2nd_brain/.obsidian/workspace.json
```

The broader lesson: any tool that syncs its own session state across devices will create this class of problem during structural changes. The correct response is to exclude session state from sync. Obsidian provides no toggle for that in the current version. The workaround is the one above. It belongs in the documentation. It is not there.

---

## Neovim integration

The vault is plain Markdown. Neovim reads plain Markdown. The integration is direct.

The plugin is `obsidian-nvim/obsidian.nvim`, a community-maintained fork of the original. It installs through lazy.nvim, which bootstraps cleanly from the LazyVim starter configuration: a single git clone rather than a hand-assembled `init.lua`. The workspace points at the vault:

```lua
workspaces = {
  {
    name = "my_2nd_brain",
    path = "~/Documents/my_2nd_brain",
  },
},
```

One dependency that was not obvious: telescope.nvim requires `ripgrep` for its search functionality. The error message (`rg: Executable not found`) appears as a flash in the command area and disappears before it can be read. If vault search returns no results and the Grep Preview panel is empty, install ripgrep:

```bash
sudo apt install ripgrep
```

The keymaps use the Space leader that LazyVim sets by default:

```lua
map('n', '<leader>on', '<cmd>ObsidianQuickSwitch<cr>', { desc = 'Obsidian: find note' })
map('n', '<leader>os', '<cmd>ObsidianSearch<cr>',      { desc = 'Obsidian: search' })
map('n', '<leader>oc', '<cmd>ObsidianNew<cr>',         { desc = 'Obsidian: create note' })
map('n', '<leader>ob', '<cmd>ObsidianBacklinks<cr>',   { desc = 'Obsidian: backlinks' })
map('n', '<leader>of', '<cmd>ObsidianFollowLink<cr>',  { desc = 'Obsidian: follow link' })
```

LazyVim sets `Space` as the leader key. In normal mode, `Space o n` opens the quick switch finder, `Space o c` creates a new note, and `Space o s` searches the vault.

---

## The workflow

Obsidian and Neovim read the same files. There is no conversion, no intermediate format, no sync between applications. The question is not which tool to use. It is which tool fits the task.

Obsidian owns what Neovim cannot do: the Bases dashboards, the visual graph, Canvas, Excalidraw, Sync management, and mobile capture on the iPhone and iPad. These are GUI-native features. Neovim does not replicate them and should not try.

Neovim owns what Obsidian does poorly: terminal-native editing, Vim motions on long-form writing, staying in the shell during a coding session without switching applications. For someone who spends most of their day in a terminal, context-switching to a GUI to write a note is friction. `nvim ~/Documents/my_2nd_brain/Home.md` is not.

The capture rule is the same regardless of tool: every new note lands in `00_Inbox`. Both `Ctrl+N` in Obsidian and `Space o c` in Neovim deposit to the same folder. Triage happens during the weekly review, not in the moment of capture. The weekly review is ten minutes: open the Inbox dashboard, file or delete every note, drag finished projects to `40_Archive`.

---

## The second-brain stack

| Component | Version |
| --- | --- |
| Obsidian | 1.12.7 |
| Neovim | 0.12.2 |
| obsidian.nvim | v3.16.4 |
| LazyVim starter | 459a4c3b (stable branch) |
| telescope.nvim | v0.2.2 |
| ripgrep | 14.1.0 |
| Ubuntu | 24.04 LTS |

---

## What comes next

The vault runs on Obsidian Sync. That is the right call for now: five devices, cross-platform, no infrastructure to maintain while the K3s cluster is still being built. But plain Markdown files synced through a self-hosted CouchDB instance via the Self-hosted LiveSync plugin is the end state. The dependency on a paid service exists by choice, not by necessity.

That migration is its own post.
