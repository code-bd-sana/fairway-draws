import sys
from PIL import Image
from collections import Counter
import colorsys

img = Image.open('/Users/syedrakibhasan/Projects/charity-draws/charity-draws/frontend/public/final_logo.jpg')
img = img.convert('RGB')
img.thumbnail((200, 200))

pixels = list(img.getdata())

# Filter out white-ish and black-ish pixels to find the actual theme color
filtered_pixels = []
for r, g, b in pixels:
    h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
    # Ignore low saturation (greys/whites/blacks) and extreme brightness/darkness
    if s > 0.15 and 0.1 < v < 0.95:
        filtered_pixels.append((r, g, b))

if not filtered_pixels:
    print("No colored pixels found, might be a black and white logo!")
else:
    c = Counter(filtered_pixels)
    most_common = c.most_common(10)
    
    print("Most common ACCENT RGB colors:")
    for color, count in most_common:
        hex_color = '#%02x%02x%02x' % color
        print(f"{hex_color} - RGB: {color} - Count: {count}")
