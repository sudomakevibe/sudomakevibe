#!/usr/bin/env python3
"""
Removes hide-after-submission behavior from ContactPrompt.astro.
The $ ask button stays visible always after a successful form submission.
Only the prompt closes and shows the success message.
"""

path = '/home/isra/Developer/sudomakevibe/src/components/ContactPrompt.astro'

with open(path, 'r') as f:
    content = f.read()

# Remove the sessionStorage check that hides the button on page load
old_session_check = '''  if (sessionStorage.getItem(STORAGE_KEY)) { if (askBtn) askBtn.style.display = "none"; }'''
new_session_check = '''  // No hide-after-submission — button stays visible always'''

# Remove the hide line from submitSuccess
old_submit_success = '''  function submitSuccess() {
    if (form) (form as HTMLElement).style.display = "none";
    if (successMsg) successMsg.style.display = "block";
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => { closePrompt(); if (askBtn) askBtn.style.display = "none"; }, 3000);
  }'''

new_submit_success = '''  function submitSuccess() {
    if (form) (form as HTMLElement).style.display = "none";
    if (successMsg) successMsg.style.display = "block";
    setTimeout(() => { closePrompt(); }, 3000);
  }'''

changes = 0

if old_session_check in content:
    content = content.replace(old_session_check, new_session_check)
    print('✓ Removed sessionStorage hide-on-load check')
    changes += 1
else:
    print('! sessionStorage check not found — checking for alternate form')
    # Try alternate spacing
    for line in content.split('\n'):
        if 'sessionStorage.getItem' in line and 'askBtn' in line:
            print(f'  Found: {line.strip()}')

if old_submit_success in content:
    content = content.replace(old_submit_success, new_submit_success)
    print('✓ Removed askBtn hide from submitSuccess')
    changes += 1
else:
    print('! submitSuccess hide not found — checking for it')
    for i, line in enumerate(content.split('\n')):
        if 'askBtn' in line and 'display' in line:
            print(f'  line {i+1}: {line.strip()}')

if changes > 0:
    with open(path, 'w') as f:
        f.write(content)
    print(f'\n✓ File updated — {changes} change(s) applied')
else:
    print('\n✗ No changes applied — review the file manually')

# Verify no askBtn hide references remain
with open(path, 'r') as f:
    written = f.read()

remaining = [l.strip() for l in written.split('\n') if 'askBtn' in l and 'display' in l]
if remaining:
    print('\n✗ Hide references still present:')
    for line in remaining:
        print(f'  {line}')
else:
    print('✓ No askBtn hide references remain')
