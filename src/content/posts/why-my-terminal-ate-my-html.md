---
title: "Why My Terminal Ate My HTML"
description: "A multi-day clipboard corruption mystery on a Wayland Ubuntu desktop, traced through five wrong diagnoses to ibus, the input method framework most users do not know is running."
pubDate: 2026-05-26T16:00:00-04:00
tags: ["linux", "homelab", "wayland", "debugging", "ubuntu"]
readingTime: "6 min read"
draft: true
---

For several days, my ThinkBook lied to me.

Every time I pasted a heredoc block from a chat interface into GNOME Terminal, something ate it. HTML angle brackets disappeared mid-block. Terminator markers — the `EOF` or `PYEOF` at the end of a heredoc — never arrived. The terminal would sit at the `>` prompt, waiting patiently for a closing line that the clipboard had silently discarded.

Single-line pastes worked fine. Simple Python one-liners: no problem. It was specifically multi-line content with special characters that went through a shredder somewhere between my browser and my shell.

The workaround was ugly. Every multi-line file edit became a chain of single-line `python3 -c "..."` calls. Work that should have taken one heredoc paste took three or four commands. Over several days, that friction compounded into hours. I kept telling myself I would debug it properly when I had a free moment.

The free moment arrived. Here is what I found — and, more usefully, the five wrong things I tried first.

---

## Five Dead Ends

A good debugging story is not a straight line from symptom to fix. It is a sequence of reasonable hypotheses that each turn out to be wrong in instructive ways. This one had five of them.

### 1. The copy button is buggy

The most obvious suspect was the Markdown "copy" icon in the chat interface. When you click it, the interface serializes the content block to the clipboard. There are several things that serialization can get wrong: newline encoding, character escaping, or length limits on large blocks.

The test was simple: copy the same content through different mechanisms and compare. Selecting text manually and using `Ctrl+C`. Using the copy button. Piping content from a file. All of them produced the same corruption in the terminal. The interface was not the cause.

### 2. wl-clipboard is the bug

Wayland's clipboard model is fundamentally different from X11's. Under X11, clipboard content is stored centrally. Under Wayland, the source application owns the clipboard data and must respond to requests for it. If the source application closes or stops responding, the data is gone.

This is a known footgun and I suspected it immediately. The test: `wl-paste` the clipboard content to a file, inspect the file directly. The file was clean — complete content, no truncation. Then I pasted that same clean content into the terminal. Still corrupted. The problem was not in the clipboard store; it was in the path from clipboard to terminal input.

### 3. GNOME Terminal has a paste buffer limit

GNOME Terminal uses bracketed paste mode — it wraps pasted content in escape sequences that tell the shell to treat it as a paste rather than direct keyboard input. Some terminals have limits on paste buffer size, and corruption near a consistent boundary is a classic symptom.

The test: switch to a different terminal emulator (xterm, which has its own paste handling) and try the same content. Same corruption. Not GNOME Terminal's fault.

### 4. The input method framework is interfering

By this point the pattern was clear enough that a different class of suspect became worth investigating: something sitting in the input path between the clipboard and the terminal, intercepting and mangling content before it arrived.

On Linux desktops, that something is often an Input Method (IM) framework. These are programs designed to support languages that require character composition — Chinese pinyin, Japanese kana, Arabic, and others where a single glyph is produced by a sequence of keystrokes. Ibus and fcitx are the two common ones. On an English-only system, they have no legitimate work to do. But they still run.

```bash
env | grep -i im_module
```

```
GTK_IM_MODULE=ibus
XMODIFIERS=@im=ibus
```

Confirmed. Ibus was active and routing input through itself. The hypothesis was right. But the standard fix did not work.

```bash
im-config -n none
```

Reboot. Check. Ibus was still running.

### 5. The standard fix targets the wrong boot path

This is where the real lesson lives.

`im-config -n none` writes to `~/.xinputrc`, which is sourced by `/etc/X11/Xsession.d/70im-config_launch` — the X11 session startup script. On older Ubuntu setups, that was the only path that mattered. On a modern GNOME desktop with systemd, it is not the only path. It might not even be the primary one.

Ibus on current Ubuntu is launched by a systemd user service:

```
org.freedesktop.IBus.session.GNOME.service
```

Systemd user services start independently of X11 session scripts. They have their own environment, their own lifecycle, and their own configuration path. `im-config` does not touch any of it. The X11 path was being configured correctly; the systemd path was not, and the systemd path won.

---

## The Actual Fix

Three commands, then a logout.

Enter these one at a time:

```bash
systemctl --user mask org.freedesktop.IBus.session.GNOME.service
```

```bash
systemctl --user stop org.freedesktop.IBus.session.GNOME.service
```

```bash
mkdir -p ~/.config/environment.d
```

Then paste this block as a single heredoc:

```bash
cat > ~/.config/environment.d/99-disable-ibus.conf << "INNEREOF"
GTK_IM_MODULE=gtk-im-context-simple
QT_IM_MODULE=simple
XMODIFIERS=@im=local
INNEREOF
```

Then enter this final command:

```bash
systemctl --user unset-environment IM_CONFIG_PHASE QT_IM_MODULE XMODIFIERS GTK_IM_MODULE CLUTTER_IM_MODULE
```

Log out and back in. Verify with:

```bash
env | grep -iE "im_module|xmodifiers"
```

The output should show the new safe values, not the old ibus ones. Heredoc pastes will work cleanly.

---

## Why You Cannot Just Use Empty Values

The intuitive fix, once you know about `environment.d`, is to blank out the variables:

```
GTK_IM_MODULE=
XMODIFIERS=
```

This does not work. `systemd-environment-d-generator` does not accept empty values — it treats them as invalid syntax and silently ignores the entire file. The fix uses functionally harmless placeholder values instead. `gtk-im-context-simple` and `simple` are the built-in no-composition modules, present on every GTK and Qt installation. They do nothing, which is exactly what an English-only system needs from an input method framework.

---

## What This Actually Means

**Input methods are not keyboard layouts.** A keyboard layout maps physical keys to characters. An input method framework intercepts those characters and transforms them, potentially replacing a sequence of ASCII keystrokes with a composed Unicode glyph. This interception happens at a low level, before the terminal sees the input. On a system typing only English, that interception has no value and demonstrable downside.

**Wayland sessions still carry X11 input infrastructure.** Even on a pure Wayland session with no XWayland involvement, `ibus-x11` runs. The GNOME session manager includes legacy compatibility layers regardless of the display server. If you migrated to Wayland expecting a clean break from X11 complexity, the input stack is not part of that clean break yet.

**systemd user environment outlives the processes that set it.** Variables injected early in a session — by a systemd service, a PAM module, or a user generator — persist in the user manager's environment even after the process that set them exits. New shells inherit from that environment. `im-config` was doing its job correctly, but writing to a config file that the systemd path never read.

**Linux desktop startup has multiple independent boot paths.** X11 session scripts, XDG autostart desktop files, systemd user services, GNOME session manager modules — each is a separate vector, each has separate configuration, and changes to one do not propagate to the others. When a configuration change does not stick, the question is not "did I write the right config?" but "did I write it to the path that this service actually reads?"

---

## What I Would Do Differently

Start from a completely fresh shell before investigating environment variables:

```bash
env -i bash -lc 'env | grep -iE "im_module|xmodifiers"'
```

Half the time I spent on diagnosis was looking at variables that were inherited from an already-tainted parent shell — values that reflected runtime state, not configuration. A clean shell shows you what the configuration actually produces at boot time, not what accumulated during a session.

Check `systemctl --user list-units` early, before assuming a problem is in shell scripts or config files. Systemd user services are increasingly common for desktop infrastructure — audio, Bluetooth, input methods, keyring — and they are easy to miss if your mental model of desktop startup is still built around `.desktop` files and Xsession scripts.

The five wrong diagnoses were not wasted time. Each one eliminated a layer and narrowed the problem. But the investigation would have been shorter if I had asked "what services are running as my user?" before I asked "what is wrong with my clipboard?"

---

## References

- `im-config(8)` — Ubuntu's input method configuration tool
- `environment.d(5)` — systemd user environment configuration
- `/etc/X11/Xsession.d/70im-config_launch` — the X11 session script that sources `~/.xinputrc`
- `/usr/lib/systemd/user/org.freedesktop.IBus.session.GNOME.service` — the systemd user service unit for ibus
