#!/usr/bin/env python3
"""
Writes the full ContactPrompt.astro component directly to the repo.
FAB pill pattern — persistent $ ask button in lower right, opens prompt on click.
"""

content = '''---
// ContactPrompt.astro
// Persistent FAB pill ($ ask) in lower right — click opens the two-step contact prompt
// Prompt closes on dismiss, pill stays visible until successful form submission
---

<!-- FAB pill — always visible -->
<button id="cp-fab" class="cp-fab" aria-label="Ask a question">
  <span class="cp-fab-dollar">$</span>
  <span class="cp-fab-label">ask</span>
</button>

<!-- Prompt widget — hidden until FAB clicked -->
<div id="contact-prompt" class="contact-prompt" aria-live="polite" style="display: none;">
  <!-- Step 1: prompt -->
  <div id="cp-step-1">
    <div class="cp-header">
      <span class="cp-header-label"><span class="cp-dollar">$</span> hello@sudomakevibe.com</span>
      <button class="cp-close" id="cp-dismiss" aria-label="Dismiss">×</button>
    </div>
    <div class="cp-body">
      <p class="cp-message">got a question about the lab, the stack, or the posts?</p>
      <div class="cp-actions">
        <button class="cp-btn-primary" id="cp-yes">I have a question</button>
        <button class="cp-btn-secondary" id="cp-no">no, thanks</button>
      </div>
    </div>
  </div>

  <!-- Step 2: form -->
  <div id="cp-step-2" style="display: none;">
    <div class="cp-header">
      <span class="cp-header-label"><span class="cp-dollar">$</span> hello@sudomakevibe.com</span>
      <button class="cp-close" id="cp-close-2" aria-label="Dismiss">×</button>
    </div>
    <div class="cp-body">
      <p class="cp-message">send me a message — I read everything.</p>
      <form id="cp-form">
        <div class="cp-field">
          <label class="cp-label" for="cp-name">name</label>
          <input class="cp-input" type="text" id="cp-name" name="name" placeholder="your name" required />
        </div>
        <div class="cp-field">
          <label class="cp-label" for="cp-email">email</label>
          <input class="cp-input" type="email" id="cp-email" name="email" placeholder="your@email.com" required />
        </div>
        <div class="cp-field">
          <label class="cp-label" for="cp-message">question</label>
          <textarea class="cp-input cp-textarea" id="cp-message" name="message" placeholder="what is on your mind?" required rows="3"></textarea>
        </div>
        <button class="cp-btn-primary cp-submit" type="submit" id="cp-send">send &#x2192;</button>
      </form>
      <div id="cp-success" style="display: none;">
        <p class="cp-success-msg">&#x2713; message sent. I will get back to you soon.</p>
      </div>
      <div id="cp-error" style="display: none;">
        <p class="cp-error-msg">&#x2717; something went wrong. try again or email hello@sudomakevibe.com directly.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .cp-fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: var(--bg-primary);
    border: 1px solid rgba(61,138,181,0.6);
    border-radius: 24px;
    padding: 10px 18px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    cursor: pointer;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    transition: box-shadow 0.2s, border-color 0.2s;
  }

  .cp-fab:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.5);
    border-color: var(--accent);
  }

  .cp-fab-dollar {
    color: var(--accent);
    font-size: 14px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
  }

  .cp-fab-label {
    color: var(--text-primary);
    font-size: 13px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
  }

  .contact-prompt {
    position: fixed;
    top: 80px;
    right: 24px;
    width: 320px;
    z-index: 9998;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    background-color: #1e3a52;
    border: 1px solid rgba(61,138,181,0.6);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    overflow: hidden;
    animation: cp-slide-in 0.25s ease-out;
  }

  :global([data-theme="sudo-light"]) :global(.contact-prompt) {
    background-color: #c8d8e8;
    border-color: rgba(35,106,138,0.5);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }

  :global([data-theme="arctic-frost"]) :global(.contact-prompt) {
    background-color: #546070;
    border-color: rgba(106,174,224,0.6);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  :global([data-theme="solar-bloom"]) :global(.contact-prompt) {
    background-color: #c8b89a;
    border-color: rgba(139,90,43,0.5);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  }

  @keyframes cp-slide-in {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    background-color: rgba(0,0,0,0.15);
  }

  :global([data-theme="sudo-light"]) :global(.cp-header),
  :global([data-theme="solar-bloom"]) :global(.cp-header) {
    background-color: rgba(0,0,0,0.08);
    border-bottom-color: rgba(0,0,0,0.1);
  }

  .cp-header-label {
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
  }

  .cp-dollar {
    color: var(--accent);
    margin-right: 4px;
  }

  .cp-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 18px;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
    transition: color 0.15s;
  }

  .cp-close:hover { color: var(--accent); }

  .cp-body { padding: 16px; }

  .cp-message {
    font-size: 13px;
    color: var(--text-primary);
    margin: 0 0 14px;
    line-height: 1.5;
  }

  :global([data-theme="sudo-light"]) :global(.cp-message),
  :global([data-theme="solar-bloom"]) :global(.cp-message) {
    color: #0f1a24;
  }

  .cp-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cp-btn-primary {
    width: 100%;
    padding: 10px 16px;
    background-color: var(--accent);
    color: var(--bg-primary);
    border: none;
    border-radius: 6px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .cp-btn-primary:hover { opacity: 0.85; }

  .cp-btn-secondary {
    width: 100%;
    padding: 10px 16px;
    background: none;
    color: var(--text-secondary);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 13px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  :global([data-theme="sudo-light"]) :global(.cp-btn-secondary),
  :global([data-theme="solar-bloom"]) :global(.cp-btn-secondary) {
    border-color: rgba(0,0,0,0.2);
  }

  .cp-btn-secondary:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .cp-field { margin-bottom: 12px; }

  .cp-label {
    display: block;
    font-size: 11px;
    color: var(--accent);
    margin-bottom: 4px;
    letter-spacing: 0.04em;
  }

  .cp-input {
    width: 100%;
    padding: 8px 10px;
    background-color: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 6px;
    color: var(--text-primary);
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 12px;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }

  :global([data-theme="sudo-light"]) :global(.cp-input),
  :global([data-theme="solar-bloom"]) :global(.cp-input) {
    background-color: rgba(255,255,255,0.4);
    border-color: rgba(0,0,0,0.15);
    color: #0f1a24;
  }

  .cp-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .cp-textarea {
    resize: vertical;
    min-height: 72px;
  }

  .cp-submit { margin-top: 4px; }

  .cp-success-msg {
    font-size: 13px;
    color: var(--accent);
    margin: 0;
    padding: 8px 0;
  }

  .cp-error-msg {
    font-size: 12px;
    color: #ef4444;
    margin: 0;
    padding: 8px 0;
    line-height: 1.5;
  }

  @media (max-width: 400px) {
    .contact-prompt {
      width: calc(100vw - 32px);
      right: 16px;
      top: 70px;
    }
    .cp-fab {
      bottom: 20px;
      right: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-prompt { animation: none; }
  }
</style>

<script>
  const STORAGE_KEY = "smv_contact_submitted";
  const FORMSPREE_URL = "https://formspree.io/f/mwvdlddq";

  const fab = document.getElementById("cp-fab");
  const prompt = document.getElementById("contact-prompt");
  const step1 = document.getElementById("cp-step-1");
  const step2 = document.getElementById("cp-step-2");
  const btnYes = document.getElementById("cp-yes");
  const btnNo = document.getElementById("cp-no");
  const btnDismiss = document.getElementById("cp-dismiss");
  const btnClose2 = document.getElementById("cp-close-2");
  const form = document.getElementById("cp-form");
  const btnSend = document.getElementById("cp-send");
  const successMsg = document.getElementById("cp-success");
  const errorMsg = document.getElementById("cp-error");

  function resetPrompt() {
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";
    if (form) (form as HTMLElement).style.display = "block";
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";
    if (btnSend) btnSend.textContent = "send \u2192";
  }

  function openPrompt() {
    resetPrompt();
    if (prompt) prompt.style.display = "block";
  }

  function closePrompt() {
    if (prompt) prompt.style.display = "none";
  }

  function submitSuccess() {
    if (form) (form as HTMLElement).style.display = "none";
    if (successMsg) successMsg.style.display = "block";
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => {
      closePrompt();
      if (fab) fab.style.display = "none";
    }, 3000);
  }

  if (sessionStorage.getItem(STORAGE_KEY)) {
    if (fab) fab.style.display = "none";
  }

  fab?.addEventListener("click", openPrompt);
  btnYes?.addEventListener("click", () => {
    if (step1) step1.style.display = "none";
    if (step2) step2.style.display = "block";
  });
  btnNo?.addEventListener("click", closePrompt);
  btnDismiss?.addEventListener("click", closePrompt);
  btnClose2?.addEventListener("click", closePrompt);

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btnSend) btnSend.textContent = "sending...";
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";

    const data = new FormData(form as HTMLFormElement);

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        submitSuccess();
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      if (errorMsg) errorMsg.style.display = "block";
      if (btnSend) btnSend.textContent = "send \u2192";
    }
  });
</script>
'''

path = "/home/isra/Developer/sudomakevibe/src/components/ContactPrompt.astro"
with open(path, "w") as f:
    f.write(content)

print(f"✓ Written to {path}")

# Verify
with open(path, "r") as f:
    written = f.read()

checks = [
    ("cp-fab", "FAB pill class"),
    ("cp-fab-dollar", "FAB dollar span"),
    ("cp-fab-label", "FAB label span"),
    ("formspree.io/f/mwvdlddq", "Formspree endpoint"),
    ("solar-bloom", "solar-bloom theme override"),
    ("arctic-frost", "arctic-frost theme override"),
    ("sudo-light", "sudo-light theme override"),
]

print("\n── Verification ──")
all_ok = True
for term, label in checks:
    found = term in written
    status = "✓" if found else "✗"
    print(f"{status} {label}")
    if not found:
        all_ok = False

print("\n✓ All checks passed." if all_ok else "\n✗ Some checks failed — review the file.")
