#!/usr/bin/env python3
"""
1. Adds $ ask bordered pill button to the right end of Header.astro nav bar
2. Removes the FAB pill from ContactPrompt.astro
3. Updates ContactPrompt script to open on ask button click instead of FAB
"""

HEADER = "/home/isra/Developer/sudomakevibe/src/components/Header.astro"
PROMPT = "/home/isra/Developer/sudomakevibe/src/components/ContactPrompt.astro"

# ── 1. Header.astro — add ask button ─────────────────────────────────────────

with open(HEADER, "r") as f:
    header = f.read()

# Add the ask button after the closing </nav> tag
ASK_BUTTON = '''
    <button
      id="cp-ask-btn"
      class="ask-btn font-mono text-sm"
      aria-label="Ask a question"
      style="color: var(--accent); background: none; border: 1px solid rgba(61,138,181,0.5); border-radius: 20px; padding: 5px 14px; cursor: pointer; transition: border-color 0.15s, color 0.15s;"
    >$ ask</button>'''

if 'cp-ask-btn' not in header:
    header = header.replace(
        '    </nav>',
        '    </nav>' + ASK_BUTTON
    )
    print("✓ Added $ ask button to Header.astro")
else:
    print("! $ ask button already present in Header.astro — skipping")

# Add hover style for the ask button
ASK_STYLE = '''
  .ask-btn:hover {
    border-color: var(--accent) !important;
    color: var(--accent) !important;
  }'''

if '.ask-btn:hover' not in header:
    header = header.replace('</style>', ASK_STYLE + '\n</style>')
    print("✓ Added ask-btn hover style to Header.astro")
else:
    print("! ask-btn hover style already present — skipping")

with open(HEADER, "w") as f:
    f.write(header)

# ── 2. ContactPrompt.astro — remove FAB pill, update trigger ─────────────────

with open(PROMPT, "r") as f:
    prompt = f.read()

# Remove the FAB button HTML block
FAB_HTML = '''<!-- FAB pill — always visible -->
<button id="cp-fab" class="cp-fab" aria-label="Ask a question">
  <span class="cp-fab-dollar">$</span>
  <span class="cp-fab-label">ask</span>
</button>

<!-- Prompt widget — hidden until FAB clicked -->'''

PROMPT_COMMENT = '<!-- Prompt widget — opens when $ ask button in nav is clicked -->'

if 'cp-fab' in prompt:
    prompt = prompt.replace(FAB_HTML, PROMPT_COMMENT)
    print("✓ Removed FAB pill HTML from ContactPrompt.astro")
else:
    print("! FAB pill HTML not found — may already be removed")

# Remove FAB CSS block
FAB_CSS_START = '  .cp-fab {'
FAB_CSS_END = '  .cp-fab-label {'

if '.cp-fab {' in prompt:
    # Find and remove all FAB CSS rules
    lines = prompt.split('\n')
    new_lines = []
    skip = False
    skip_count = 0
    for line in lines:
        if '.cp-fab {' in line or '.cp-fab:hover {' in line or '.cp-fab-dollar {' in line or '.cp-fab-label {' in line:
            skip = True
            skip_count = 0
        if skip:
            skip_count += 1
            if line.strip() == '}' and skip_count > 1:
                skip = False
                continue
        else:
            new_lines.append(line)
    prompt = '\n'.join(new_lines)
    print("✓ Removed FAB CSS from ContactPrompt.astro")
else:
    print("! FAB CSS not found — may already be removed")

# Update script: replace fab reference with ask button reference
prompt = prompt.replace(
    'const fab = document.getElementById("cp-fab");',
    'const fab = document.getElementById("cp-ask-btn");'
)

prompt = prompt.replace(
    "const fab = document.getElementById('cp-fab');",
    "const fab = document.getElementById('cp-ask-btn');"
)

print("✓ Updated script to use cp-ask-btn as trigger")

with open(PROMPT, "w") as f:
    f.write(prompt)

# ── 3. Verification ───────────────────────────────────────────────────────────

print("\n── Verification ──")

with open(HEADER, "r") as f:
    h = f.read()

with open(PROMPT, "r") as f:
    p = f.read()

checks = [
    (h, 'cp-ask-btn', "Header has ask button id"),
    (h, 'ask-btn:hover', "Header has ask button hover style"),
    (p, 'cp-ask-btn', "ContactPrompt references ask button"),
    (p, 'cp-fab-label', False, "FAB label removed from ContactPrompt"),
    (p, 'cp-fab {', False, "FAB CSS removed from ContactPrompt"),
]

all_ok = True
for check in checks:
    if len(check) == 3:
        content, term, label = check
        should_exist = True
    else:
        content, term, label, _ = check
        should_exist = False

    found = term in content
    ok = found == should_exist
    status = "✓" if ok else "✗"
    state = "present" if found else "absent"
    print(f"{status} {label} ({state})")
    if not ok:
        all_ok = False

print("\n✓ All checks passed." if all_ok else "\n✗ Some checks failed — review manually.")
