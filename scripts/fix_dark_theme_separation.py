#!/usr/bin/env python3
"""
Adds per-theme background overrides to ContactPrompt.astro.
Dark themes get a lighter background for visual separation.
Light themes already work fine with var(--bg-card).
"""

path = '/home/isra/Developer/sudomakevibe/src/components/ContactPrompt.astro'

with open(path, 'r') as f:
    content = f.read()

# The overrides go right after the closing brace of .contact-prompt
OVERRIDES = """
  /* Dark themes — lighter background for visual separation */
  :global([data-theme="sudo-dark"]) :global(.contact-prompt) {
    background-color: #1e3a52;
    border-color: rgba(61,138,181,0.7);
  }

  :global([data-theme="arctic-frost"]) :global(.contact-prompt) {
    background-color: #546070;
    border-color: rgba(106,174,224,0.7);
  }
"""

TARGET = '  @keyframes cp-slide-in {'

if ':global([data-theme="sudo-dark"])' not in content:
    content = content.replace(TARGET, OVERRIDES + '  ' + TARGET.lstrip())
    with open(path, 'w') as f:
        f.write(content)
    print('✓ Dark theme overrides added')
else:
    print('! Overrides already present — skipping')

# Verify
with open(path, 'r') as f:
    written = f.read()

checks = [
    ('sudo-dark', 'sudo-dark override'),
    ('arctic-frost', 'arctic-frost override'),
    ('#1e3a52', 'sudo-dark lighter background'),
    ('#546070', 'arctic-frost lighter background'),
    ('var(--bg-card)', 'Base still uses bg-card'),
]

print('\n── Verification ──')
all_ok = True
for term, label in checks:
    found = term in written
    status = '✓' if found else '✗'
    print(f'{status} {label}')
    if not found:
        all_ok = False

print('\n✓ All checks passed.' if all_ok else '\n✗ Some checks failed.')
