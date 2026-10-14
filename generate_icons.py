import math
from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGBA', (size, size), (18, 6, 16, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer circular glow
    center = size / 2
    radius = size * 0.44
    
    # Radial dark burgundy gradient
    for r in range(int(radius), 0, -2):
        factor = r / radius
        red = int(168 * (1 - factor) + 36 * factor)
        green = int(25 * (1 - factor) + 14 * factor)
        blue = int(56 * (1 - factor) + 30 * factor)
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(red, green, blue, 255))
    
    # Gold border
    border_w = max(2, int(size * 0.025))
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], outline=(229, 185, 102, 255), width=border_w)
    
    # Inner golden 4-point star/gem
    star_radius = size * 0.22
    star_points = []
    for i in range(8):
        angle = i * math.pi / 4
        dist = star_radius if i % 2 == 0 else star_radius * 0.35
        x = center + dist * math.cos(angle)
        y = center + dist * math.sin(angle)
        star_points.append((x, y))
    
    draw.polygon(star_points, fill=(251, 227, 168, 255))
    
    # Small center gem
    c_r = size * 0.05
    draw.ellipse([center - c_r, center - c_r, center + c_r, center + c_r], fill=(230, 92, 138, 255))

    img.save(filename, 'PNG')
    print(f"Generated {filename}")

if __name__ == '__main__':
    create_icon(192, 'icon-192.png')
    create_icon(512, 'icon-512.png')
