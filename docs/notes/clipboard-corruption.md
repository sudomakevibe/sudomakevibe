# Clipboard corruption — root cause and findings

Technical notes from investigating the recurring clipboard corruption issue
on the ThinkBook (Ubuntu 24.04, GNOME Wayland). Captured after a dedicated
debugging session.

Status: investigated, root causes identified, mitigations documented
Potential post: yes — fits the "here is what broke and why" pattern of the site

---

## The symptom

Commands pasted into GNOME Terminal included unexpected content from previous
clipboard operations. Old commands ran alongside new ones, causing hard-to-
diagnose failures. The corruption was inconsistent — it did not happen every
time, which made it difficult to trace.

First documented occurrence: during the sudomakevibe homelab VM build session.
The specific incident: a documentation site copy button silently appended
content to the clipboard rather than replacing it. The resulting paste ran
old commands alongside new ones. Two hours of debugging shell-level symptoms
of a problem that was not actually in the shell.

Recurred during the contact prompt build session despite the `wl-copy --clear`
mitigation being in use — suggesting the mitigation was not being applied
consistently.

---

## Environment

- **Machine:** Lenovo ThinkBook (linuxtb01 / tb-00)
- **OS:** Ubuntu 24.04 LTS
- **Desktop:** GNOME on Wayland (`XDG_SESSION_TYPE=wayland`)
- **Terminal:** GNOME Terminal (`/usr/libexec/gnome-terminal-server`)
- **Clipboard tools installed:** `wl-copy`, `wl-paste` (from `wl-clipboard` package)
- **Clipboard manager:** none running

---

## Root cause 1 — two clipboard buffers on Wayland

Wayland maintains two separate clipboard buffers:

1. **Primary selection** — automatically populated by any mouse highlight.
   Available for middle-click paste.
2. **Clipboard** — explicitly populated by `Ctrl+C` or a copy button.
   Available for `Ctrl+V` paste.

These are independent. Content in one does not automatically appear in the
other.

GNOME Terminal supports middle-click paste from the primary selection buffer.
This means:

1. You highlight text somewhere (a command in chat, a file path, anything) —
   primary selection buffer is populated automatically, silently.
2. You copy a new command with `Ctrl+C` — clipboard buffer is populated.
3. You middle-click in the terminal to position your cursor — GNOME Terminal
   interprets this as a paste from the primary selection and inserts the
   highlighted text.
4. You then `Ctrl+V` to paste the intended command — clipboard content is
   inserted after the primary selection content.
5. The terminal now has two commands concatenated, which runs in unexpected ways.

This is not a bug — it is intended GNOME Terminal behavior. The middle-click
paste feature exists for a reason. The problem is that it is easy to trigger
accidentally, especially when using a mouse to position the cursor in the
terminal.

**Fix:** Use `Ctrl+V` exclusively to paste in the terminal. Never middle-click
inside a terminal window. No tooling needed — discipline is the fix.

---

## Root cause 2 — documentation site copy buttons

Some documentation site copy buttons use `document.execCommand('copy')` as
a fallback alongside the modern `navigator.clipboard.writeText()` API. On
Wayland under certain conditions, this can write to the primary selection
buffer and the clipboard buffer inconsistently, or append rather than replace.

The specific site that triggered the original incident was not identified with
certainty, but the behavior — copy button appending rather than replacing —
is a known issue with certain implementations of browser copy buttons on
Wayland.

**Fix:** `wl-copy --clear` before pasting any command copied from a browser.
This explicitly clears the Wayland clipboard buffer before the new content
is written, eliminating any stale content.

---

## What was investigated and ruled out

### `wl-paste --primary --watch wl-copy`

The standard Wayland fix for the two-buffer problem is to run a background
process that syncs the primary selection to the clipboard automatically:

```bash
wl-paste --primary --watch wl-copy &
```

**Result: failed with the following error:**
```
Watch mode requires a compositor that supports the wlroots data-control protocol
```

**Root cause:** GNOME uses Mutter as its Wayland compositor. Mutter does not
implement the `wlroots` data-control protocol (`zwlr_data_control_manager_v1`).
This protocol is implemented by wlroots-based compositors (Sway, Hyprland,
River, etc.) but not by GNOME's compositor.

This means automatic primary-to-clipboard sync is not possible on GNOME
Wayland without additional tooling or a compositor switch.

### `cliphist`

`cliphist` is available in the Ubuntu package repositories and provides
clipboard history management on Wayland. It has a GNOME Shell extension
(`gnome-shell-extension-cliphist` or similar) that could provide more
robust clipboard management.

**Status: not installed, not tested.** The complexity of setting up a
clipboard manager and GNOME extension was not justified given that the
simpler behavioral fixes (always `Ctrl+V`, `wl-copy --clear`) address
the root causes directly.

Worth revisiting if the corruption issue recurs despite the behavioral fixes.

---

## Mitigations in use

1. **`wl-copy --clear` before pasting** — standard practice for all paste
   operations that involve commands copied from a browser. Clears any stale
   content from both clipboard buffers before the new command is pasted.

2. **`Ctrl+V` only in the terminal** — eliminates middle-click paste as a
   corruption vector. No tooling needed.

3. **Python scripts for file writes** — clipboard is no longer used for
   multi-line file content. Python scripts write directly to the filesystem,
   bypassing the clipboard entirely for anything more complex than a single
   command.

---

## Potential blog post angle

The story has three layers worth writing about:

1. **The symptom looked like a shell bug.** Two hours of debugging the wrong
   layer — checking command history, looking for shell aliases, reviewing
   terminal settings — before realising the problem was in the clipboard,
   not the shell. The lesson: when commands behave unexpectedly, check what
   was actually in the paste buffer before assuming the shell is at fault.

2. **Wayland's two-buffer model is not obvious.** Most Linux users coming
   from X11 know about the primary selection, but the distinction between
   the two buffers and how they interact with GNOME Terminal's middle-click
   paste is not well-documented in a single place. Worth explaining clearly.

3. **The standard fix does not work on GNOME.** The `wl-paste --watch`
   solution appears in many StackOverflow answers and blog posts. It fails
   silently on GNOME Wayland with a protocol error that is not easy to
   interpret if you do not know about compositor protocol differences.
   Documenting the failure and the reason is more useful than repeating
   the standard answer.

---

## Working title candidates

- the bug that was not in the shell
- sudo make paste: clipboard corruption on GNOME Wayland
- two buffers, one problem: Wayland clipboard on GNOME
- why wl-paste --watch fails on GNOME (and what to do instead)
