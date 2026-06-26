#!/usr/bin/env python3
"""
Move ContactPrompt from index.astro to BaseLayout.astro.
- Adds import to BaseLayout.astro after the Footer import
- Adds <ContactPrompt /> before </body> in BaseLayout.astro
- Removes import from index.astro
- Removes <ContactPrompt /> from index.astro
"""

import re

BASE_LAYOUT = "/home/isra/Developer/sudomakevibe/src/layouts/BaseLayout.astro"
INDEX_ASTRO = "/home/isra/Developer/sudomakevibe/src/pages/index.astro"
IMPORT_LINE = 'import ContactPrompt from "../components/ContactPrompt.astro";\n'
COMPONENT_LINE = '  <ContactPrompt />\n'

# ── BaseLayout.astro ──────────────────────────────────────────────────────────

with open(BASE_LAYOUT, "r") as f:
    content = f.read()

# 1. Add import after Footer import (only if not already present)
if 'ContactPrompt' not in content:
    content = content.replace(
        'import Footer from "../components/Footer.astro";\n',
        'import Footer from "../components/Footer.astro";\n' + IMPORT_LINE,
    )
    print("✓ Added ContactPrompt import to BaseLayout.astro")
else:
    print("! ContactPrompt import already present in BaseLayout.astro — skipping")

# 2. Add <ContactPrompt /> before </body> (only if not already present)
if '<ContactPrompt />' not in content:
    content = content.replace(
        '  </body>',
        COMPONENT_LINE + '  </body>',
    )
    print("✓ Added <ContactPrompt /> before </body> in BaseLayout.astro")
else:
    print("! <ContactPrompt /> already present in BaseLayout.astro — skipping")

with open(BASE_LAYOUT, "w") as f:
    f.write(content)

# ── index.astro ───────────────────────────────────────────────────────────────

with open(INDEX_ASTRO, "r") as f:
    lines = f.readlines()

original_count = len(lines)

# 3. Remove import line
lines = [l for l in lines if 'import ContactPrompt' not in l]

# 4. Remove component line
lines = [l for l in lines if '<ContactPrompt />' not in l]

removed = original_count - len(lines)

with open(INDEX_ASTRO, "w") as f:
    f.writelines(lines)

print(f"✓ Removed {removed} ContactPrompt line(s) from index.astro")

# ── Verification ──────────────────────────────────────────────────────────────

print("\n── Verification ──")

with open(BASE_LAYOUT, "r") as f:
    bl = f.read()

with open(INDEX_ASTRO, "r") as f:
    idx = f.read()

bl_count = bl.count('ContactPrompt')
idx_count = idx.count('ContactPrompt')

print(f"BaseLayout.astro — ContactPrompt references: {bl_count} (expected 2)")
print(f"index.astro      — ContactPrompt references: {idx_count} (expected 0)")

if bl_count == 2 and idx_count == 0:
    print("\n✓ All changes applied correctly.")
else:
    print("\n✗ Something looks off — check the files manually.")
