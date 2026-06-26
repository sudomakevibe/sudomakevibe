#!/usr/bin/env python3
path = '/home/isra/Developer/sudomakevibe/src/components/ContactPrompt.astro'

with open(path, 'r') as f:
    content = f.read()

old = 'box-shadow: 0 8px 32px rgba(0,0,0,0.5);'
new = 'box-shadow: 0 0 0 1px rgba(61,138,181,0.3), 0 8px 32px rgba(0,0,0,0.6);'

if old in content:
    content = content.replace(old, new)
    with open(path, 'w') as f:
        f.write(content)
    print('✓ box-shadow updated')
else:
    print('✗ old value not found — check the file manually')
    print('Current box-shadow lines:')
    for i, line in enumerate(content.split('\n')):
        if 'box-shadow' in line:
            print(f'  line {i+1}: {line.strip()}')
