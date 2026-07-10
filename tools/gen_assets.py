"""
Procedural placeholder asset generator for Style Hub.
Generates dark, gold-accented placeholder JPG/PNG images so the site
has zero external image dependencies. Replace these with real photos later.
"""
import os, random, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE = os.path.dirname(os.path.abspath(__file__))
IMG_DIR = os.path.join(BASE, "assets", "images")
ICON_DIR = os.path.join(BASE, "assets", "icons")
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(ICON_DIR, exist_ok=True)

BLACK = (10, 10, 10)
DARK = (24, 24, 24)
GOLD = (245, 179, 1)
DARK_ORANGE = (217, 119, 6)
WHITE = (245, 245, 245)

def font(size, bold=True):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def diag_stripes(draw, w, h, color, alpha=28, gap=46, width=14):
    overlay = Image.new("RGBA", (w, h), (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    for x in range(-h, w + h, gap):
        od.line([(x, 0), (x + h, h)], fill=color + (alpha,), width=width)
    return overlay

def vignette(w, h, strength=170):
    v = Image.new("L", (w, h), 0)
    dv = ImageDraw.Draw(v)
    dv.ellipse([-w*0.3, -h*0.3, w*1.3, h*1.3], fill=255)
    v = v.filter(ImageFilter.GaussianBlur(w//6))
    dark = Image.new("RGBA", (w, h), (0,0,0,strength))
    dark.putalpha(Image.eval(v, lambda p: 255 - p))
    return dark

def base_canvas(w, h, seed=0):
    random.seed(seed)
    img = Image.new("RGB", (w, h), BLACK)
    # radial-ish gradient using two ellipses
    top = tuple(min(255, c + random.randint(6,18)) for c in DARK)
    grad = Image.new("RGB", (w, h), BLACK)
    for y in range(h):
        t = y / h
        r = int(BLACK[0] + (top[0]-BLACK[0]) * (1-t))
        g = int(BLACK[1] + (top[1]-BLACK[1]) * (1-t))
        b = int(BLACK[2] + (top[2]-BLACK[2]) * (1-t))
        ImageDraw.Draw(grad).line([(0,y),(w,y)], fill=(r,g,b))
    img = grad
    stripes = diag_stripes(ImageDraw.Draw(Image.new("RGBA",(w,h))), w, h, GOLD, alpha=14, gap=64, width=10)
    img = Image.alpha_composite(img.convert("RGBA"), stripes)
    img = Image.alpha_composite(img, vignette(w, h, strength=150))
    return img.convert("RGB")

def add_center_mark(img, label, sub=None, accent=GOLD):
    w, h = img.size
    d = ImageDraw.Draw(img, "RGBA")
    # gold ring / lens motif
    r = int(min(w, h) * 0.16)
    cx, cy = w//2, h//2 - int(h*0.03)
    d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=accent + (200,), width=4)
    d.ellipse([cx-6, cy-6, cx+6, cy+6], fill=accent + (255,))
    f1 = font(int(h*0.045))
    tw = d.textlength(label, font=f1)
    d.text((cx - tw/2, cy + r + int(h*0.03)), label, font=f1, fill=WHITE + (235,))
    if sub:
        f2 = font(int(h*0.024), bold=False)
        tw2 = d.textlength(sub, font=f2)
        d.text((cx - tw2/2, cy + r + int(h*0.03) + int(h*0.055)), sub, font=f2, fill=(230,230,230,160))
    return img

def add_watermark(img):
    w, h = img.size
    d = ImageDraw.Draw(img, "RGBA")
    f = font(int(h*0.022))
    txt = "STYLE HUB — PLACEHOLDER"
    tw = d.textlength(txt, font=f)
    d.text((w - tw - 18, h - int(h*0.05)), txt, font=f, fill=(255,255,255,90))
    return img

def save(img, path, quality=82):
    img.convert("RGB").save(path, quality=quality)
    print("wrote", path)

# ---------------------------------------------------------------- HERO
hero = base_canvas(1600, 900, seed=1)
hero = add_center_mark(hero, "STYLE HUB", "Premium Grooming, Redefined", accent=GOLD)
hero = add_watermark(hero)
save(hero, os.path.join(IMG_DIR, "hero-banner.jpg"), 85)

# ---------------------------------------------------------------- ABOUT
about = base_canvas(1200, 900, seed=2)
about = add_center_mark(about, "OUR STORY", "Since day one, craft first", accent=DARK_ORANGE)
about = add_watermark(about)
save(about, os.path.join(IMG_DIR, "about-story.jpg"))

about2 = base_canvas(1200, 900, seed=22)
about2 = add_center_mark(about2, "THE CRAFT", "Precision in every cut", accent=GOLD)
about2 = add_watermark(about2)
save(about2, os.path.join(IMG_DIR, "about-craft.jpg"))

# ---------------------------------------------------------------- BARBERS
barber1 = base_canvas(700, 860, seed=3)
barber1 = add_center_mark(barber1, "BARBER ONE", "Master Barber", accent=GOLD)
barber1 = add_watermark(barber1)
save(barber1, os.path.join(IMG_DIR, "barber-1.jpg"))

barber2 = base_canvas(700, 860, seed=4)
barber2 = add_center_mark(barber2, "BARBER TWO", "Style Specialist", accent=DARK_ORANGE)
barber2 = add_watermark(barber2)
save(barber2, os.path.join(IMG_DIR, "barber-2.jpg"))

# ---------------------------------------------------------------- HAIRCUT GALLERY
styles = [
    ("Low Fade", "low-fade"), ("Mid Fade", "mid-fade"), ("High Fade", "high-fade"),
    ("Skin Fade", "skin-fade"), ("Taper Fade", "taper-fade"), ("Crew Cut", "crew-cut"),
    ("Buzz Cut", "buzz-cut"), ("French Crop", "french-crop"), ("Pompadour", "pompadour"),
    ("Quiff", "quiff"), ("Undercut", "undercut"), ("Side Part", "side-part"),
    ("Textured Crop", "textured-crop"), ("Curly Hair", "curly-hair"),
    ("Beard Styles", "beard-styles"), ("Classic Fade", "classic-fade"),
]
for i, (label, slug) in enumerate(styles):
    img = base_canvas(800, 1000, seed=10 + i)
    accent = GOLD if i % 2 == 0 else DARK_ORANGE
    img = add_center_mark(img, label.upper(), "Style Reference", accent=accent)
    img = add_watermark(img)
    save(img, os.path.join(IMG_DIR, f"haircut-{slug}.jpg"))

# ---------------------------------------------------------------- ICONS / FAVICON / MANIFEST
def make_mark(size):
    img = Image.new("RGB", (size, size), BLACK)
    d = ImageDraw.Draw(img)
    pad = size * 0.08
    d.rounded_rectangle([pad, pad, size-pad, size-pad], radius=size*0.18, outline=GOLD, width=max(2,int(size*0.045)))
    f = font(int(size*0.42))
    txt = "SH"
    tw = d.textlength(txt, font=f)
    d.text(((size-tw)/2, size*0.24), txt, font=f, fill=GOLD)
    return img

for size in [16, 32, 180, 192, 512]:
    m = make_mark(size)
    m.save(os.path.join(ICON_DIR, f"icon-{size}.png"))
    print("wrote icon", size)

# apple touch + favicon aliases
make_mark(180).save(os.path.join(ICON_DIR, "apple-touch-icon.png"))
make_mark(32).save(os.path.join(BASE, "favicon.png"))

print("DONE")
