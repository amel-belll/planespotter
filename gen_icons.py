#!/usr/bin/env python3
"""Generate PWA icons (192x192 and 512x512) for PlaneRadar"""

import subprocess, sys

# Install Pillow if needed
subprocess.run([sys.executable, '-m', 'pip', 'install', 'Pillow', '--break-system-packages', '-q'], check=True)

from PIL import Image, ImageDraw, ImageFont
import math

def draw_icon(size):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background circle
    margin = size * 0.05
    draw.ellipse([margin, margin, size-margin, size-margin], fill=(10, 14, 26, 255))

    # Amber ring
    ring_w = max(2, size // 60)
    draw.ellipse([margin, margin, size-margin, size-margin],
                 outline=(245, 166, 35, 200), width=ring_w)

    # Inner grid lines (radar)
    cx, cy = size//2, size//2
    r = int(size * 0.42)
    grid_color = (245, 166, 35, 40)
    for i in range(1, 3):
        rr = r * i // 3
        draw.ellipse([cx-rr, cy-rr, cx+rr, cy+rr], outline=grid_color, width=1)
    draw.line([cx-r, cy, cx+r, cy], fill=grid_color, width=1)
    draw.line([cx, cy-r, cx, cy+r], fill=grid_color, width=1)

    # Radar sweep (amber glow arc)
    sweep_w = max(1, size // 40)
    for i in range(20):
        alpha = int(180 * (1 - i/20))
        color = (245, 166, 35, alpha)
        angle_start = -60 - i*2
        angle_end   = -60
        draw.arc([cx-r, cy-r, cx+r, cy+r], start=angle_start, end=angle_end,
                 fill=color, width=sweep_w)

    # Plane symbol (✈ simplified)
    plane_size = size * 0.28
    px, py = cx, cy
    body_len = plane_size * 0.6
    wing_w   = plane_size * 0.5
    wing_h   = plane_size * 0.14
    tail_w   = plane_size * 0.22
    tail_h   = plane_size * 0.1

    amber = (245, 166, 35, 255)

    # Body
    draw.ellipse([px - body_len*0.15, py - body_len*0.5,
                  px + body_len*0.15, py + body_len*0.5], fill=amber)
    # Wings
    draw.ellipse([px - wing_w*0.5, py - wing_h*0.5,
                  px + wing_w*0.5, py + wing_h*0.5], fill=amber)
    # Tail
    draw.ellipse([px - tail_w*0.5, py + body_len*0.25,
                  px + tail_w*0.5, py + body_len*0.25 + tail_h*2], fill=amber)

    return img

for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png')]:
    img = draw_icon(size)
    img.save(f'/home/claude/planespotter/{name}')
    print(f'✓ Created {name}')

print('Icons generated!')
