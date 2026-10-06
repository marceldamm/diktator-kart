"""Modular city kit for the redesigned 'Stadion der Eitelkeit' world (Redesign 06.10.2026).

Run: blender --background --python art-source/build_city_kit.py
Writes art-source/city-kit.blend and .tools/raw-models/city-kit.glb; then
`node art-source/optimize_assets.mjs city-kit` produces public/assets/models/city-kit.glb.

Every module is original procedural geometry. Each module root `kit-<name>` holds one mesh per shared
material (`kit-<name>|<material>`), so the runtime (src/city-world.ts) can place hundreds of copies as
thin instances with few draw calls. Local frame: X along the street, -Y faces the street (front
facade at y=0, building body toward +Y), Z up, origin at front-centre on the ground.

Art system (docs/25-redesign-art-system.md): warm sandstone/limestone and tinted lime plaster, slate
and copper-patina roofs, dark-green ironwork, brass/gold accents, oxblood/cream cloth. Vertex colours
carry tonal variation, rain grime at the base and painted stripes (awnings, kerbs, checker), while
runtime tiling textures add stone/plaster/cloth/leaf grain. No historical insignia or regime symbols.
"""
import bpy, bmesh, math, os, random
from mathutils import Matrix, Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
random.seed(1928)

# --- Shared materials ----------------------------------------------------------------------------
MATS = {}
def mat(name, rgb, metal=0.0, rough=0.7, emit=None):
    m = bpy.data.materials.new('Kit ' + name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*[c ** 2.2 for c in rgb], 1)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = (*[c ** 2.2 for c in emit], 1)
        b.inputs['Emission Strength'].default_value = 3.0
    MATS[name] = m
    return name

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

PLASTER = mat('plaster', hexrgb('#f2ebdc'), 0, .86)        # tinted per instance at runtime
STONE = mat('stone sandstone', hexrgb('#d8c6a4'), 0, .82)
LIME = mat('stone limestone', hexrgb('#e9e1cf'), 0, .78)
DARK = mat('stone rustica', hexrgb('#b7a382'), 0, .9)
SLATE = mat('roof slate', hexrgb('#4b525b'), 0, .62)
COPPER = mat('roof copper patina', hexrgb('#6fa898'), .25, .5)
ZINC = mat('metal zinc', hexrgb('#8d949a'), .7, .45)
GLASS = mat('window glass', hexrgb('#22313b'), .3, .12)
FRAME = mat('painted joinery', hexrgb('#efe7d6'), 0, .5)
IRON = mat('iron green', hexrgb('#27382f'), .55, .45)
GOLD = mat('gilded brass', hexrgb('#d4a64e'), .95, .28)
CLOTH = mat('cloth', hexrgb('#ffffff'), 0, .85)            # stripes and colours via vertex colour
BANNER = mat('banner cloth', hexrgb('#ffffff'), 0, .8)     # runtime emblem texture, UV fit
WOOD = mat('wood', hexrgb('#7a5235'), 0, .7)
LEAF = mat('foliage', hexrgb('#71904a'), 0, .9)
BARK = mat('bark', hexrgb('#5a4637'), 0, .95)
LAMP = mat('lamp glass', hexrgb('#ffe2a6'), 0, .3, emit=hexrgb('#ffcf7a'))
WATER = mat('fountain water', hexrgb('#7fa9b0'), .1, .08)
CROWD = mat('crowd', hexrgb('#ffffff'), 0, .8)            # spectators coloured by vertex colour
SKIN = mat('crowd skin', hexrgb('#d6a588'), 0, .7)

OXBLOOD, CREAM, BOTTLE, NAVY = hexrgb('#8a1f2a'), hexrgb('#efe2c4'), hexrgb('#2e5a45'), hexrgb('#283a5a')

# --- Geometry accumulator -------------------------------------------------------------------------
class Module:
    def __init__(self, name, grime=True):
        self.name, self.grime = name, grime
        self.parts = {}
        self.stack = [Matrix.Identity(4)]
    def part(self, m):
        return self.parts.setdefault(m, {'v': [], 'f': [], 'c': [], 'smooth': [], 'uv': []})
    def push(self, mx): self.stack.append(self.stack[-1] @ mx)
    def pop(self): self.stack.pop()
    def add(self, m, verts, faces, col=1.0, smooth=False, uvfit=False):
        p = self.part(m); base = len(p['v']); M = self.stack[-1]
        if not isinstance(col, tuple): col = (col, col, col)
        world = [M @ Vector(v) for v in verts]
        p['v'] += [tuple(w) for w in world]
        p['c'] += [col] * len(verts)
        p['f'] += [tuple(base + i for i in f) for f in faces]
        p['smooth'] += [smooth] * len(faces)
        if uvfit:  # project this element's front onto 0..1 (banners, clock faces)
            xs = [v[0] for v in verts]; zs = [v[2] for v in verts]
            x0, x1, z0, z1 = min(xs), max(xs), min(zs), max(zs)
            p['uv'] += [((v[0] - x0) / (x1 - x0 or 1), (v[2] - z0) / (z1 - z0 or 1)) for v in verts]
        else:
            p['uv'] += [None] * len(verts)

    # primitives -----------------------------------------------------------------------------------
    def box(self, m, x0, x1, y0, y1, z0, z1, col=1.0):
        v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
        f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        self.add(m, v, f, col)
    def boxc(self, m, cx, cy, cz, sx, sy, sz, col=1.0):
        self.box(m, cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2, cz, cz + sz, col)
    def lathe(self, m, cx, cy, prof, seg=16, col=1.0, z0=0.0, smooth=True, sx=1.0, sy=1.0):
        """prof: [(r, z)] bottom→top; closed with caps where r>0."""
        v, f = [], []
        for (r, z) in prof:
            for k in range(seg):
                a = 2 * math.pi * k / seg
                v.append((cx + r * math.cos(a) * sx, cy + r * math.sin(a) * sy, z0 + z))
        n = len(prof)
        for i in range(n - 1):
            for k in range(seg):
                a, b = i * seg + k, i * seg + (k + 1) % seg
                f.append((a, b, b + seg, a + seg))
        if prof[0][0] > 0: f.append(tuple(reversed(range(seg))))
        if prof[-1][0] > 0: f.append(tuple((n - 1) * seg + k for k in range(seg)))
        self.add(m, v, f, col, smooth)
    def cyl(self, m, cx, cy, z0, z1, r, r2=None, seg=12, col=1.0, smooth=True):
        self.lathe(m, cx, cy, [(r, 0), (r if r2 is None else r2, z1 - z0)], seg, col, z0, smooth)
    def sphere(self, m, cx, cy, cz, rx, ry, rz, seg=12, rings=8, col=1.0, jitter=0.0, smooth=True):
        v, f = [], []
        v.append((cx, cy, cz - rz))
        for i in range(1, rings):
            t = math.pi * i / rings
            for k in range(seg):
                a = 2 * math.pi * k / seg; j = 1 + (random.uniform(-jitter, jitter) if jitter else 0)
                v.append((cx + rx * math.sin(t) * math.cos(a) * j, cy + ry * math.sin(t) * math.sin(a) * j, cz - rz * math.cos(t) * j))
        v.append((cx, cy, cz + rz)); top = len(v) - 1
        for k in range(seg): f.append((0, 1 + (k + 1) % seg, 1 + k))
        for i in range(rings - 2):
            for k in range(seg):
                a, b = 1 + i * seg + k, 1 + i * seg + (k + 1) % seg
                f.append((a, b, b + seg, a + seg))
        last = 1 + (rings - 2) * seg
        for k in range(seg): f.append((last + k, last + (k + 1) % seg, top))
        self.add(m, v, f, col, smooth)
    def prism_x(self, m, x0, x1, poly, col=1.0, smooth=False):
        """Extrude polygon [(y, z)] along X (cornices, roofs, steps)."""
        n = len(poly)
        v = [(x0, y, z) for y, z in poly] + [(x1, y, z) for y, z in poly]
        f = [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
        tris = earclip(poly)
        f += [tuple(reversed(t)) for t in tris] + [tuple(n + i for i in t) for t in tris]
        self.add(m, v, f, col, smooth)
    def prism_y(self, m, y0, y1, poly, col=1.0, uvfit=False):
        """Extrude polygon [(x, z)] along Y (gables, arches, pediments)."""
        n = len(poly)
        v = [(x, y0, z) for x, z in poly] + [(x, y1, z) for x, z in poly]
        f = [(i, n + i, n + (i + 1) % n, (i + 1) % n) for i in range(n)]
        tris = earclip(poly)
        f += [tuple(t) for t in tris] + [tuple(n + i for i in reversed(t)) for t in tris]
        self.add(m, v, f, col, uvfit=uvfit)

def earclip(poly):
    pts = list(range(len(poly)))
    area = sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly)))
    if area < 0: pts.reverse()
    out, guard = [], 0
    def inside(p, a, b, c):
        def s(p1, p2, p3): return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
        d1, d2, d3 = s(p, a, b), s(p, b, c), s(p, c, a)
        return not ((d1 < 0 or d2 < 0 or d3 < 0) and (d1 > 0 or d2 > 0 or d3 > 0))
    while len(pts) > 3 and guard < 5000:
        guard += 1
        for i in range(len(pts)):
            ia, ib, ic = pts[i - 1], pts[i], pts[(i + 1) % len(pts)]
            a, b, c = poly[ia], poly[ib], poly[ic]
            if (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 1e-9: continue
            if any(inside(poly[j], a, b, c) for j in pts if j not in (ia, ib, ic)): continue
            out.append((ia, ib, ic)); pts.pop(i); break
        else: break
    if len(pts) == 3: out.append(tuple(pts))
    if area < 0: out = [tuple(reversed(t)) for t in out]
    return out

def arch_poly(x0, x1, z0, spring, seg=10):
    """Rectangle with a semicircular head: (x, z) outline for prism_y."""
    r = (x1 - x0) / 2; cx = (x0 + x1) / 2
    return [(x0, z0), (x1, z0)] + [(cx + r * math.cos(math.pi * k / seg), spring + r * math.sin(math.pi * k / seg)) for k in range(seg + 1)]

ROT = lambda deg: Matrix.Rotation(math.radians(deg), 4, 'Z')
TR = lambda x, y, z=0: Matrix.Translation((x, y, z))

# --- Facade vocabulary ---------------------------------------------------------------------------
CORNICE = [(0, 0), (-.06, .04), (-.06, .14), (-.22, .26), (-.42, .4), (-.48, .46), (-.48, .56), (0, .56)]
BAND = [(0, 0), (-.1, .05), (-.12, .18), (0, .22)]
SILL = [(0, 0), (-.16, .02), (-.16, .11), (0, .13)]

def window(M, x, z, w, h, hood='flat', shutters=None, frame_col=1.0, surround=STONE, glass_col=None):
    """Recessed-reading window: projecting stone surround, dark glass with joinery cross, sill, hood."""
    t = .16
    M.box(GLASS, x - w / 2, x + w / 2, -.05, .02, z, z + h, glass_col or (.55, .6, .68))
    M.box(FRAME, x - .035, x + .035, -.09, -.04, z, z + h, frame_col)                     # mullion
    M.box(FRAME, x - w / 2, x + w / 2, -.09, -.04, z + h * .68, z + h * .68 + .06, frame_col)  # transom
    for side in (-1, 1):  # jambs
        M.box(surround, x + side * w / 2 - (t if side < 0 else 0), x + side * w / 2 + (t if side > 0 else 0), -.17, 0, z - .02, z + h + .02, .97)
    M.box(surround, x - w / 2 - t, x + w / 2 + t, -.17, 0, z + h, z + h + t, .97)
    M.prism_x(surround, x - w / 2 - .26, x + w / 2 + .26, [(y, zz + z - .13) for y, zz in SILL], .95)
    if hood == 'tri':
        M.prism_y(surround, -.24, 0, [(x - w / 2 - .34, z + h + t), (x + w / 2 + .34, z + h + t), (x, z + h + t + .62)], .98)
        M.box(surround, x - w / 2 - .36, x + w / 2 + .36, -.26, 0, z + h + t - .08, z + h + t + .02, .95)
    elif hood == 'seg':
        pts = [(x + (w / 2 + .32) * math.cos(math.pi * (1 - k / 8)), z + h + t + .38 * math.sin(math.pi * k / 8)) for k in range(9)]
        M.prism_y(surround, -.22, 0, pts, .98)
    elif hood == 'cornice':
        M.prism_x(surround, x - w / 2 - .3, x + w / 2 + .3, [(y * .7, zz * .55 + z + h + t) for y, zz in CORNICE], .97)
    elif hood == 'key':
        M.prism_y(surround, -.24, 0, [(x - .16, z + h), (x + .16, z + h), (x + .22, z + h + .34), (x - .22, z + h + .34)], .96)
    if shutters:
        for side in (-1, 1):
            sx = x + side * (w / 2 + t + w * .26)
            M.box(WOOD, sx - w * .25, sx + w * .25, -.12, -.02, z, z + h, shutters)

def balcony(M, x0, x1, z, depth=1.0):
    M.box(STONE, x0, x1, -depth, 0, z - .22, z, .95)
    M.prism_x(STONE, x0, x1, [(y - depth + .02, zz + z - .44) for y, zz in [(0, .22), (.0, .1), (.3, 0), (.3, .22)]], .9)
    for k in range(int((x1 - x0) / .9) + 1):  # console brackets
        cx = x0 + .2 + k * (x1 - x0 - .4) / max(1, int((x1 - x0) / .9))
        M.prism_x(STONE, cx - .1, cx + .1, [(-depth + .15, z - .22), (0, z - .22), (0, z - .95)], .9)
    M.box(IRON, x0, x1, -depth, -depth + .05, z + .95, z + 1.0)
    for side in (x0, x1): M.box(IRON, side - .02, side + .02, -depth, 0, z + .95, z + 1.0)
    n = int((x1 - x0) / .14)
    for k in range(n + 1):
        bx = x0 + k * (x1 - x0) / n
        M.box(IRON, bx - .012, bx + .012, -depth + .01, -depth + .035, z, z + .96)
    M.box(IRON, x0, x1, -depth, -depth + .04, z + .35, z + .4)

def shopfront(M, x0, x1, z0, h, awning=OXBLOOD, frame=BOTTLE):
    w = x1 - x0
    M.box(GLASS, x0 + .2, x1 - .2, -.08, .02, z0 + .55, z0 + h - .65, (.62, .66, .7))
    M.box(WOOD, x0, x1, -.2, 0, z0, z0 + .55, frame)                      # stall riser
    M.box(WOOD, x0, x1, -.22, 0, z0 + h - .65, z0 + h, frame)             # fascia
    M.box(GOLD, x0 + .1, x1 - .1, -.24, -.2, z0 + h - .2, z0 + h - .15)  # gilt line on fascia
    for k in range(4):
        mx = x0 + .2 + k * (w - .4) / 3
        M.box(WOOD, mx - .06, mx + .06, -.14, 0, z0 + .55, z0 + h - .65, frame)
    # striped awning, sloping out over the pavement (stripes are vertex colours on one cloth sheet)
    n = max(4, int(w / .45))
    for k in range(n):
        a, b = x0 + k * w / n, x0 + (k + 1) * w / n
        c = awning if k % 2 == 0 else CREAM
        M.add(CLOTH, [(a, 0, z0 + h + .1), (b, 0, z0 + h + .1), (b, -1.6, z0 + h - .55), (a, -1.6, z0 + h - .55),
                      (a, 0, z0 + h + .14), (b, 0, z0 + h + .14), (b, -1.6, z0 + h - .51), (a, -1.6, z0 + h - .51)],
              [(0, 1, 2, 3), (7, 6, 5, 4), (3, 2, 6, 7), (0, 3, 7, 4), (1, 5, 6, 2)], c)
        M.add(CLOTH, [(a, -1.6, z0 + h - .55), (b, -1.6, z0 + h - .55), (b, -1.62, z0 + h - .85), (a, -1.62, z0 + h - .85),
                      (a, -1.63, z0 + h - .55), (b, -1.63, z0 + h - .55), (b, -1.65, z0 + h - .85), (a, -1.65, z0 + h - .85)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (3, 7, 6, 2), (0, 4, 7, 3), (1, 2, 6, 5)], c)

def mansard(M, x0, x1, z, depth, h1=3.0, h2=1.2, dormers=0, col=1.0, roof=SLATE):
    inset = 1.1
    M.prism_x(roof, x0, x1, [(0, z), (depth, z), (depth - inset * .5, z + h1), (depth * .55, z + h1 + h2), (inset * .45, z + h1 + h2), (inset, z + h1)], col)
    M.box(ZINC, x0, x1, inset - .05, inset + .06, z + h1 - .05, z + h1 + .08)
    for k in range(dormers):
        dx = x0 + (k + .5) * (x1 - x0) / dormers
        M.box(PLASTER, dx - .7, dx + .7, .25, 1.6, z + 1.0, z + 2.6)
        M.prism_y(roof, .1, 1.8, [(dx - .9, z + 2.55), (dx + .9, z + 2.55), (dx, z + 3.25)], col)
        M.box(GLASS, dx - .42, dx + .42, .18, .28, z + 1.3, z + 2.3, (.55, .6, .68))
        M.box(FRAME, dx - .5, dx + .5, .14, .26, z + 1.22, z + 1.3)

def chimney(M, x, y, z, h=2.2):
    M.box(DARK, x - .35, x + .35, y - .5, y + .5, z, z + h, .8)
    M.box(DARK, x - .45, x + .45, y - .6, y + .6, z + h, z + h + .18, .7)
    for k in (-.25, .25): M.cyl(ZINC, x, y + k, z + h + .18, z + h + .55, .09, seg=6)

def rustic_floor(M, x0, x1, h):
    rows = 6
    for r in range(rows):
        z0 = r * h / rows
        M.box(DARK, x0, x1, -.12 if r % 2 else -.1, 0, z0 + .03, z0 + h / rows - .03, .93 + .04 * (r % 2))
    M.box(DARK, x0, x1, -.06, 0, 0, h, .7)

# --- Townhouses ----------------------------------------------------------------------------------
def townhouse(name, width, axes, floors, roof='mansard', erker=False, giant=False, shutters=None, depth=13.0):
    M = Module(name)
    gf, fh = 4.6, 3.55
    top = gf + floors * fh
    M.box(PLASTER, -width / 2, width / 2, 0, depth, 0, top, 1.0)
    rustic_floor(M, -width / 2, width / 2, gf)
    step = width / axes
    xs = [-width / 2 + step * (k + .5) for k in range(axes)]
    # ground floor: central portal, shops left/right
    door = axes // 2
    for k, x in enumerate(xs):
        if k == door:
            M.prism_y(STONE, -.32, 0, arch_poly(x - 1.25, x + 1.25, 0, 2.7), .96)
            M.prism_y(WOOD, -.2, 0.01, arch_poly(x - .95, x + .95, 0, 2.7, 8), (.55, .36, .24))
            M.box(GOLD, x - .5, x + .5, -.24, -.2, 3.95, 4.05)
        else:
            shopfront(M, x - step / 2 + .25, x + step / 2 - .25, 0, gf - .5, awning=random.choice([OXBLOOD, BOTTLE, NAVY]), frame=random.choice([BOTTLE, (.32, .16, .14), (.16, .2, .26)]))
    M.prism_x(STONE, -width / 2, width / 2, [(y * 1.3, z * 1.2 + gf - .1) for y, z in BAND], .95)
    hoods = ['tri', 'cornice', 'key', 'key', 'key']
    for f in range(floors):
        z = gf + f * fh + .75
        h = 2.25 if f < 2 else 1.95
        for k, x in enumerate(xs):
            if erker and k in (axes // 2 - 1 + (axes % 2), axes // 2 + (axes % 2)) and f < floors - 1: continue
            hood = hoods[f] if f != 0 else ('tri' if k % 2 == 0 else 'seg')
            window(M, x, z, step * .42, h, hood, shutters)
        if f < floors - 1:
            M.prism_x(STONE, -width / 2, width / 2, [(y, z0 + gf + (f + 1) * fh - .12) for y, z0 in BAND], .94)
    if giant:  # giant pilasters through the upper floors
        for x in [-width / 2 + .3] + [(xs[k] + xs[k + 1]) / 2 for k in range(axes - 1)] + [width / 2 - .3]:
            M.box(LIME, x - .32, x + .32, -.2, 0, gf, top - .3, .98)
            M.box(LIME, x - .42, x + .42, -.28, 0, top - .7, top - .3, .96)
    if erker:  # projecting bay over two middle axes, copper cap
        cx = 0 if axes % 2 == 0 else xs[axes // 2]
        bw = step * 2 - .4
        zb, zt = gf + .3, gf + (floors - 1) * fh + .1
        M.box(PLASTER, cx - bw / 2, cx + bw / 2, -1.25, 0, zb, zt, .98)
        M.prism_x(STONE, cx - bw / 2 - .1, cx + bw / 2 + .1, [(-1.35, zb), (0, zb), (0, zb - 1.2)], .9)
        for f in range(floors - 1):
            z = gf + f * fh + .75
            M.push(TR(0, -1.25))
            for k in (-1, 1): window(M, cx + k * bw / 4, z, bw * .32, 2.1, 'key')
            M.pop()
        M.prism_x(COPPER, cx - bw / 2 - .1, cx + bw / 2 + .1, [(-1.4, zt), (0, zt), (0, zt + 1.8)], 1.0)
    # Firewall ends (Brandwaende): rusticated base, band and cornice returns plus weathered plaster patches.
    for sd in (-1, 1):
        x0, x1 = sorted((sd * width / 2, sd * (width / 2 + .08)))
        M.box(DARK, x0, x1, 0, depth, 0, gf, .82)
        for f in range(floors):
            zb = gf + (f + 1) * fh - .12
            M.box(STONE, x0, x1 + (.04 if sd > 0 else -.04) * 0, 0, depth, zb, zb + .2, .9)
        M.box(LIME, x0, x1, 0, depth, top - .2, top + .4, .93)
        for k in range(3):
            pz = gf + 1.5 + k * 3.4 + random.uniform(-.5, .5); py = random.uniform(1.5, depth - 4)
            M.box(PLASTER, x0 - (.01 if sd < 0 else -.01), x1 + (.01 if sd > 0 else -.01), py, py + random.uniform(2, 3.5), pz, pz + random.uniform(1.2, 2.4), (.88, .86, .82))
    # crown cornice with dentils
    M.prism_x(LIME, -width / 2 - .05, width / 2 + .05, [(y * 1.4, z * 1.3 + top - .2) for y, z in CORNICE], .97)
    for k in range(int(width / .45)):
        dx = -width / 2 + .2 + k * .45
        M.box(LIME, dx - .08, dx + .08, -.45, -.05, top - .2, top + .02, .93)
    if roof == 'mansard':
        mansard(M, -width / 2, width / 2, top, depth, dormers=axes - 1)
        chimney(M, -width / 2 + 2, depth * .6, top + 4.0); chimney(M, width / 2 - 2.5, depth * .55, top + 4.0)
    elif roof == 'gable':  # curved Dutch gable toward the street, pitched roof behind
        M.prism_y(PLASTER, -.05, .5, [(-width / 2 + 1, top), (width / 2 - 1, top), (width / 2 - 1.6, top + 2.6), (width / 4, top + 3.2),
                                       (width / 6, top + 4.9), (0, top + 5.6), (-width / 6, top + 4.9), (-width / 4, top + 3.2), (-width / 2 + 1.6, top + 2.6)], 1.0)
        M.prism_y(LIME, -.25, .5, [(-.9, top + 5.5), (.9, top + 5.5), (0, top + 6.3)], .97)
        window(M, 0, top + 1.0, 1.0, 1.9, 'key')
        M.prism_x(SLATE, -width / 2, width / 2, [(.5, top), (depth, top), (depth * .55, top + 5.4)], 1.0)
        chimney(M, width / 2 - 2, depth * .6, top + 3.6)
    elif roof == 'attic':  # balustrade with urns and copper mansard behind
        M.box(LIME, -width / 2, width / 2, -.1, .35, top + .4, top + .6, .96)
        M.box(LIME, -width / 2, width / 2, -.1, .35, top + 1.3, top + 1.5, .96)
        for k in range(int(width / .32)):
            bx = -width / 2 + .16 + k * .32
            M.lathe(LIME, bx, .12, [(.07, 0), (.11, .25), (.06, .5), (.09, .7), (.07, .9)], 6, .95, top + .4)
        for x in (-width / 2 + .3, -width / 6, width / 6, width / 2 - .3):
            M.lathe(LIME, x, .12, [(.25, 0), (.25, .2), (.35, .45), (.4, .8), (.22, 1.05), (.12, 1.25), (0, 1.35)], 10, .97, top + 1.5)
        mansard(M, -width / 2, width / 2, top, depth, h1=3.4, h2=1.0, dormers=axes // 2, roof=COPPER)
    return M

# --- Hero and civic modules ----------------------------------------------------------------------
def column_order(M, x, y, z, h, r=.55, mat_=LIME, fluted=True):
    M.boxc(mat_, x, y, z, r * 2.6, r * 2.6, .35, .95)
    M.lathe(mat_, x, y, [(r * 1.15, 0), (r * 1.05, .15), (r, .3), (r * .86, h - .9), (r * .95, h - .7), (r * 1.25, h - .45), (r * 1.25, h - .3)], 16 if fluted else 12, .98, z + .35)
    M.boxc(mat_, x, y, z + h - .3 + .35, r * 2.8, r * 2.8, .35, .96)

def statue(M, x, y, z, s=1.0, pose='raise', m=GOLD):
    """Abstract allegorical figure: draped body, head, raised arm with laurel. Original, no insignia."""
    M.lathe(m, x, y, [(.0, 0), (.42 * s, .02), (.38 * s, .7 * s), (.3 * s, 1.3 * s), (.34 * s, 1.55 * s), (.18 * s, 1.75 * s), (0, 1.78 * s)], 10, 1.0, z)
    M.sphere(m, x, y, z + 1.95 * s, .17 * s, .17 * s, .2 * s, 10, 6)
    if pose == 'raise':
        M.push(TR(x + .25 * s, y, z + 1.55 * s) @ Matrix.Rotation(math.radians(-25), 4, 'Y'))
        M.cyl(m, 0, 0, 0, .9 * s, .07 * s, .05 * s, 8)
        M.lathe(m, 0, 0, [(.2 * s, .9 * s), (.24 * s, .95 * s), (.2 * s, 1.0 * s)], 12, 1.0)
        M.pop()
    else:
        M.cyl(m, x + .3 * s, y - .1 * s, z + .9 * s, z + 1.5 * s, .06 * s, seg=8)

def palace():
    M = Module('kit-palace')
    W2, D, H = 48.0, 34.0, 19.0
    M.box(PLASTER, -W2, W2, 0, D, 0, H, (1.0, .98, .95))
    rustic_floor(M, -W2, W2, 5.2)
    for side in (-1, 1):  # side pavilions project forward
        x0, x1 = (W2 - 12, W2) if side > 0 else (-W2, -W2 + 12)
        M.box(LIME, x0, x1, -3, D, 0, H + 2.5, 1.0)
        M.push(TR(0, -3))
        for k in range(3):
            window(M, x0 + 2 + k * 4, 6.2, 1.5, 3.2, 'tri'); window(M, x0 + 2 + k * 4, 11.5, 1.4, 2.6, 'cornice')
        M.pop()
        M.prism_x(LIME, x0, x1, [(y * 1.6 - 3, z * 1.5 + H + 2.3) for y, z in CORNICE], .97)
        M.lathe(COPPER, (x0 + x1) / 2, D / 3, [(6.5, 0), (6.5, 1.2), (6.0, 3), (4.6, 5.2), (2.4, 6.8), (0, 7.4)], 20, 1.0, H + 3.2)
        statue(M, (x0 + x1) / 2, D / 3, H + 10.6, 1.6)
    xs = [x for x in [ -W2 + 14 + k * 3.3 for k in range(int((2 * W2 - 28) / 3.3) + 1)] if abs(x) > 11]
    for x in xs:
        window(M, x, 6.2, 1.4, 3.0, 'seg'); window(M, x, 11.4, 1.3, 2.6, 'tri'); window(M, x, 16.0, 1.1, 1.7, 'key')
    M.prism_x(LIME, -W2, W2, [(y * 1.6, z * 1.5 + H - .3) for y, z in CORNICE], .97)
    # roof balustrade with allegorical statues
    M.box(LIME, -W2, W2, 0, .5, H + .5, H + .7, .96); M.box(LIME, -W2, W2, 0, .5, H + 1.5, H + 1.7, .96)
    for k in range(int(2 * W2 / .6)):
        bx = -W2 + .3 + k * .6
        if abs(bx) < 11: continue
        M.lathe(LIME, bx, .25, [(.12, 0), (.18, .3), (.1, .6), (.15, .85), (.12, 1.0)], 6, .95, H + .5)
    for x in (-36, -24, 24, 36): M.boxc(LIME, x, .25, H + 1.7, 1.2, 1.2, .8); statue(M, x, .25, H + 2.5, 1.4, 'stand', LIME)
    # central portico: 8 giant columns, pediment, relief band
    M.box(LIME, -11.5, 11.5, -9, 0, 0, 1.6, .95)
    for k in range(6):  # steps
        M.box(LIME, -12 - k * .6, 12 + k * .6, -9 - k * .5 - .5, -9 - k * .5, 0, 1.6 - (k + 1) * .26, .93)
    for k in range(8): column_order(M, -9.8 + k * 2.8, -7.6, 1.6, 15.2, .62)
    M.box(LIME, -11.2, 11.2, -8.6, 0, 17.1, 18.9, .97)
    M.box(GOLD, -9, 9, -8.7, -8.55, 17.6, 18.3)
    M.prism_y(LIME, -8.9, 0, [(-12, 18.9), (12, 18.9), (0, 24.4)], .98)
    M.prism_y(LIME, -9.4, -8.6, [(-12.6, 18.7), (12.6, 18.7), (12.6, 19.1), (0, 24.9), (-12.6, 19.1)], .94)
    M.lathe(GOLD, 0, -8.95, [(1.4, 0), (1.4, .1)], 20, 1.0, 20.2)
    statue(M, 0, -8.5, 24.6, 2.0)
    # grand dome on a drum
    M.lathe(LIME, 0, D / 2, [(14, 0), (14, 6.5), (13.4, 7.2), (13.4, 8.0)], 28, .97, H + .5)
    for k in range(16):  # drum columns
        a = 2 * math.pi * k / 16
        M.cyl(LIME, 14.2 * math.cos(a), D / 2 + 14.2 * math.sin(a), H + .5, H + 6.5, .45, seg=8)
    M.lathe(COPPER, 0, D / 2, [(13.2, 0), (13.0, 2.5), (12.2, 5.5), (10.4, 8.8), (7.6, 11.6), (4.0, 13.6), (1.6, 14.3), (0, 14.4)], 28, 1.0, H + 8.0)
    for k in range(12):  # gilt ribs
        a = 2 * math.pi * k / 12
        pts = [(13.25, 0), (13.05, 2.5), (12.25, 5.5), (10.45, 8.8), (7.65, 11.6), (4.05, 13.6)]
        for i in range(len(pts) - 1):
            (r0, z0), (r1, z1) = pts[i], pts[i + 1]
            ax, ay = math.cos(a), math.sin(a)
            M.add(GOLD, [(r0 * ax - .12 * ay, D / 2 + r0 * ay + .12 * ax, H + 8 + z0), (r0 * ax + .12 * ay, D / 2 + r0 * ay - .12 * ax, H + 8 + z0),
                         (r1 * ax + .12 * ay, D / 2 + r1 * ay - .12 * ax, H + 8 + z1), (r1 * ax - .12 * ay, D / 2 + r1 * ay + .12 * ax, H + 8 + z1)],
                  [(0, 1, 2, 3), (3, 2, 1, 0)])
    M.lathe(LIME, 0, D / 2, [(2.2, 0), (2.2, 3.2), (2.6, 3.5), (1.2, 4.6), (0, 5.2)], 12, .97, H + 22.2)
    statue(M, 0, D / 2, H + 27.2, 2.2)
    return M

def cathedral():
    M = Module('kit-cathedral')
    M.box(LIME, -32, 32, 0, 50, 0, 28, .97)
    for x in [-26 + k * 6.5 for k in range(9)]:
        if abs(x) < 6: continue
        M.prism_y(GLASS, -.1, .05, arch_poly(x - 1.5, x + 1.5, 9, 16, 8), (.5, .55, .6))
        M.prism_y(LIME, -.6, 0, [(x - 2.2, 8), (x + 2.2, 8), (x + 2.2, 8.5), (x - 2.2, 8.5)], .95)
    M.prism_y(LIME, -2.5, 0, arch_poly(-6, 6, 0, 14, 12), .9)
    M.prism_y(WOOD, -2.6, -2.4, arch_poly(-3, 3, 0, 9, 10), (.4, .28, .2))
    M.prism_x(LIME, -32, 32, [(y * 2, z * 2 + 27.5) for y, z in CORNICE], .96)
    M.prism_y(LIME, -3, 0, [(-9, 28.5), (9, 28.5), (0, 35)], .97)
    for x, y in ((-28, 4), (28, 4), (-28, 46), (28, 46)):
        M.box(LIME, x - 5, x + 5, y - 5, y + 5, 0, 40, .96)
        M.lathe(LIME, x, y, [(4.4, 0), (4.4, 4)], 12, .96, 40)
        M.lathe(COPPER, x, y, [(4.6, 0), (4.2, 2), (2.6, 4.5), (.8, 6.2), (0, 6.6)], 16, 1.0, 44)
        M.lathe(GOLD, x, y, [(.3, 0), (.5, .6), (0, 1.6)], 8, 1.0, 50.6)
    M.lathe(LIME, 0, 25, [(17, 0), (17, 10), (16, 11)], 32, .97, 28)
    for k in range(20):
        a = 2 * math.pi * k / 20
        M.cyl(LIME, 17.3 * math.cos(a), 25 + 17.3 * math.sin(a), 28, 37.5, .6, seg=8)
    M.lathe(COPPER, 0, 25, [(16, 0), (15.7, 4), (14.3, 9), (11.4, 14), (7.2, 18), (3.2, 20.4), (0, 21)], 32, 1.0, 39)
    M.lathe(LIME, 0, 25, [(2.6, 0), (2.6, 4.4), (1.2, 6), (0, 7)], 12, .96, 59.5)
    M.lathe(GOLD, 0, 25, [(.6, 0), (.9, 1), (0, 3.2)], 10, 1.0, 66)
    return M

def victory_column():
    M = Module('kit-column')
    for k, (r, h) in enumerate([(9, .5), (8, .5), (7, .5)]):
        M.cyl(LIME, 0, 0, k * .5, k * .5 + .5, r, seg=32, smooth=False)
    M.boxc(DARK, 0, 0, 1.5, 9, 9, 6.5, .95)
    M.boxc(LIME, 0, 0, 7.9, 10, 10, .7, .97)
    for side in range(4):  # gilded relief panels on the pedestal
        M.push(ROT(side * 90))
        M.box(GOLD, -3.2, 3.2, -4.62, -4.48, 2.6, 6.6)
        M.box(DARK, -2.8, 2.8, -4.66, -4.6, 3.0, 6.2, .5)
        for k in range(5): M.lathe(GOLD, -2.2 + k * 1.1, -4.66, [(.18, 0), (.32, .9), (.12, 1.5), (0, 1.75)], 8, 1.0, 3.6)
        M.pop()
    M.cyl(LIME, 0, 0, 8.6, 10.2, 3.6, 3.2, seg=24)
    for k in range(12):  # colonnade around the drum base
        a = 2 * math.pi * k / 12
        M.cyl(LIME, 4.4 * math.cos(a), 4.4 * math.sin(a), 8.6, 13.4, .32, seg=8)
    M.lathe(LIME, 0, 0, [(5, 0), (5, .6)], 24, .96, 13.4)
    M.lathe(LIME, 0, 0, [(2.0, 0), (1.95, 8), (1.85, 16), (1.72, 24), (1.65, 28)], 16, .98, 14.0)
    for z in (19, 26, 33):  # three gilt rings
        M.lathe(GOLD, 0, 0, [(1.95, 0), (2.25, .4), (2.25, 1.4), (1.95, 1.8)], 20, 1.0, z)
    M.lathe(LIME, 0, 0, [(2.0, 0), (2.8, .8), (2.8, 1.3)], 16, .97, 42)
    M.lathe(IRON, 0, 0, [(2.9, 0), (2.9, .9)], 16, 1.0, 43.3)
    # 'Eitelkeit': gilded allegory admiring itself in a hand mirror, laurel raised.
    M.lathe(GOLD, 0, 0, [(.0, 0), (1.3, .05), (1.1, 2.3), (.85, 4.0), (1.0, 4.6), (.5, 5.2), (0, 5.3)], 14, 1.0, 43.3)
    M.sphere(GOLD, 0, 0, 49.2, .5, .5, .6, 12, 8)
    M.push(TR(.8, 0, 47.8) @ Matrix.Rotation(math.radians(-30), 4, 'Y'))
    M.cyl(GOLD, 0, 0, 0, 2.6, .2, .15, 8)
    M.lathe(GOLD, 0, 0, [(.6, 2.6), (.75, 2.75), (.6, 2.9)], 14, 1.0)
    M.pop()
    M.push(TR(-.7, -.4, 47.0) @ Matrix.Rotation(math.radians(40), 4, 'Y'))
    M.cyl(GOLD, 0, 0, 0, 1.5, .18, .14, 8)
    M.lathe(GOLD, 0, 0, [(0, 1.5), (.45, 1.55), (.5, 1.75), (.45, 1.95), (0, 2.0)], 12, 1.0)
    M.pop()
    for side in (-1, 1):  # gilded wings
        M.prism_x(GOLD, side * .2, side * .35, [(.2, 46.5), (1.4, 47.2), (2.6, 49.6), (1.8, 50.3), (.6, 48.6)])
    return M

def grandstand():
    M = Module('kit-grandstand')
    L, rows = 24.0, 10
    M.box(DARK, -L / 2, L / 2, 0, .5, 0, 1.3, .9)
    M.box(LIME, -L / 2, L / 2, -.06, .56, 1.3, 1.45, .95)
    rnd = random.Random(7)
    clothes = [hexrgb(h) for h in ('#2c2f36', '#4a3b30', '#6b5a43', '#293349', '#7a2a2c', '#c9bfa8', '#3d4a3a', '#59606a', '#8a7a5a', '#1f2124')]
    for r in range(rows):
        y0, z0 = .5 + r * .9, 1.2 + r * .55
        M.box(STONE, -L / 2, L / 2, y0, y0 + .9, 0, z0, .9 - r * .01)
        M.box(WOOD, -L / 2, L / 2, y0 + .45, y0 + .8, z0, z0 + .42, (.62, .45, .32))
        for k in range(int(L / .62)):
            if rnd.random() < .12: continue
            x = -L / 2 + .31 + k * .62 + rnd.uniform(-.06, .06)
            c = rnd.choice(clothes); y = y0 + .55
            M.boxc(CROWD, x, y, z0 + .42, .44, .34, .62, c)
            M.boxc(CROWD, x, y - .3, z0 + .25, .38, .4, .22, tuple(v * .8 for v in c))
            M.sphere(SKIN, x, y + .02, z0 + 1.2, .13, .14, .16, 6, 4)
            if rnd.random() < .35: M.cyl(CROWD, x, y + .02, z0 + 1.27, z0 + 1.42, .17, .13, 7, rnd.choice(clothes))
            if rnd.random() < .18: M.boxc(CROWD, x + .2, y - .05, z0 + 1.0, .1, .1, .7, c)  # waving arm
    zb = 1.2 + rows * .55
    yb = .5 + rows * .9
    M.box(PLASTER, -L / 2, L / 2, yb, yb + .8, 0, zb + 4.8, (.96, .92, .86))
    for k in range(4):
        x = -L / 2 + 3 + k * 6
        M.prism_y(DARK, yb - .05, yb + .01, arch_poly(x - 1.6, x + 1.6, zb + .3, zb + 2.4, 8), .6)
    for x in (-L / 2 + .3, -L / 6, L / 6, L / 2 - .3):
        M.cyl(IRON, x, 1.0, 1.45, zb + 4.3, .16, .13, 8)
        M.add(IRON, [(x - .08, 1.0, zb + 3.6), (x + .08, 1.0, zb + 3.6), (x + .08, yb, zb + 4.3), (x - .08, yb, zb + 4.3),
                     (x - .08, 1.0, zb + 3.8), (x + .08, 1.0, zb + 3.8), (x + .08, yb, zb + 4.5), (x - .08, yb, zb + 4.5)],
              [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
    M.prism_x(COPPER, -L / 2 - .2, L / 2 + .2, [(-1.4, zb + 4.1), (yb + .9, zb + 4.8), (yb + .9, zb + 5.0), (-1.4, zb + 4.32)], 1.0)
    M.box(GOLD, -L / 2 - .2, L / 2 + .2, -1.48, -1.38, zb + 3.95, zb + 4.35)
    for x in (-L / 2 + 6, L / 2 - 6):  # hanging banners on the canopy edge
        M.add(BANNER, [(x - .9, -1.2, zb + 4.0), (x + .9, -1.2, zb + 4.0), (x + .9, -1.2, zb + .9), (x - .9, -1.2, zb + .9),
                       (x - .9, -1.16, zb + 4.0), (x + .9, -1.16, zb + 4.0), (x + .9, -1.16, zb + .9), (x - .9, -1.16, zb + .9)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], uvfit=True)
    return M

def gate():
    M = Module('kit-gate', grime=True)
    for side in (-1, 1):
        x0, x1 = sorted((side * 9.6, side * 17.5))
        M.box(LIME, x0, x1, -4, 4, 0, 15.5, .97)
        M.push(TR((x0 + x1) / 2, -4))
        M.box(DARK, -3.95, 3.95, -.12, 0, 0, 2.2, .85)
        for k in (-1, 1): column_order(M, k * 2.6, -.6, 0, 13.2, .5)
        M.prism_y(LIME, -.25, 0, arch_poly(-1.1, 1.1, 2.4, 6.4, 8), .8)
        M.box(GOLD, -1.2, 1.2, -.3, -.2, 8.4, 11.2)
        M.pop()
    arc = [(9.6 * math.cos(math.pi * k / 16), 6.2 + 5.4 * math.sin(math.pi * k / 16)) for k in range(17)]
    M.prism_y(LIME, -4, 4, [(9.7, 6.2), (9.7, 15.5), (-9.7, 15.5), (-9.7, 6.2)] + list(reversed(arc))[1:-1], .96)
    M.prism_y(GOLD, -4.12, -3.98, [(-1.1, 11.0), (1.1, 11.0), (1.4, 12.6), (-1.4, 12.6)])  # gilt keystone
    M.box(LIME, -17.8, 17.8, -4.4, 4.4, 15.5, 16.4, .95)
    M.box(LIME, -15, 15, -3.6, 3.6, 16.4, 20.2, .97)
    M.box(GOLD, -11, 11, -3.7, -3.6, 17.2, 19.4)
    M.box(DARK, -10.6, 10.6, -3.75, -3.68, 17.5, 19.1, .55)
    M.box(LIME, -15.3, 15.3, -3.9, 3.9, 20.2, 20.8, .95)
    # gilded group on the attic: chariot and four abstract horses led by the allegory
    M.boxc(GOLD, 0, 0, 20.8, 4, 2.4, 1.4)
    for k, dx in enumerate((-2.7, -.9, .9, 2.7)):
        M.sphere(GOLD, dx, -2.2, 23.0, .45, 1.3, .6, 10, 6)
        M.push(TR(dx, -3.3, 23.3) @ Matrix.Rotation(math.radians(35), 4, 'X'))
        M.sphere(GOLD, 0, 0, .6, .25, .3, .75, 8, 5)
        M.pop()
        for lx in (-.22, .22):
            for ly in (-3.0, -1.4):
                M.cyl(GOLD, dx + lx, ly, 20.8, 22.7, .1, .07, 6)
    statue(M, 0, .3, 22.2, 2.3)
    return M

def finish_gantry():
    M = Module('kit-finish')
    for side in (-1, 1):
        x = side * 9.8
        M.box(DARK, x - 1.3, x + 1.3, -1.3, 1.3, 0, 1.4, .85)
        M.box(LIME, x - 1.1, x + 1.1, -1.1, 1.1, 1.4, 10.6, .97)
        M.box(LIME, x - 1.4, x + 1.4, -1.4, 1.4, 10.6, 11.1, .95)
        M.lathe(COPPER, x, 0, [(1.3, 0), (1.1, 1.0), (.4, 2.4), (0, 2.8)], 4, 1.0, 11.1, smooth=False)
        M.lathe(GOLD, x, 0, [(.25, 0), (.35, .5), (0, 1.1)], 8, 1.0, 13.9)
        for k in range(3): M.box(GOLD, x - .8, x + .8, -1.15, -1.1, 3 + k * 2.4, 3.15 + k * 2.4)
    # checkered span beam (vertex-colour checks)
    n, w = 32, 18.0 / 32
    for i in range(n):
        for j in range(3):
            c = (.08, .09, .1) if (i + j) % 2 else (.95, .93, .88)
            M.box(FRAME, -9 + i * w, -9 + (i + 1) * w, -.45, .45, 8.0 + j * .45, 8.45 + j * .45, c)
    M.box(LIME, -9, 9, -.6, .6, 9.35, 9.8, .96)
    M.push(TR(0, -.62, 11.3) @ Matrix.Rotation(math.radians(90), 4, 'X'))
    M.lathe(GOLD, 0, 0, [(1.0, 0), (1.55, .05), (1.55, .3), (1.0, .35)], 28, 1.0)
    M.lathe(FRAME, 0, 0, [(0, .04), (1.05, .05), (1.05, .25), (0, .26)], 28, (.97, .95, .9))
    M.pop()
    M.box(IRON, -.04, .04, -.92, -.88, 11.3, 12.15)
    M.box(IRON, -.03, .55, -.92, -.88, 11.27, 11.33)
    M.box(LIME, -1.8, 1.8, -.6, .6, 9.8, 12.9, .96)
    for x in (-5.5, 5.5):
        M.add(BANNER, [(x - 1.1, -.6, 7.9), (x + 1.1, -.6, 7.9), (x + 1.1, -.6, 4.6), (x - 1.1, -.6, 4.6),
                       (x - 1.1, -.55, 7.9), (x + 1.1, -.55, 7.9), (x + 1.1, -.55, 4.6), (x - 1.1, -.55, 4.6)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], uvfit=True)
    return M

def bridge():
    M = Module('kit-bridge')
    L = 64
    M.box(LIME, -L / 2, L / 2, -5, 5, 6.2, 7.0, .95)
    for k in range(4):
        x = -L / 2 + k * L / 3
        M.box(DARK, x - 2.4, x + 2.4, -5.6, 5.6, -2, 6.2, .85)
        M.lathe(DARK, x, -5.8, [(2.0, 0), (1.4, 1.2), (0, 2.6)], 4, .85, 0, smooth=False)
        M.lathe(DARK, x, 5.8, [(2.0, 0), (1.4, 1.2), (0, 2.6)], 4, .85, 0, smooth=False)
    for k in range(3):
        cx = -L / 2 + (k + .5) * L / 3
        span = L / 3 - 4.8
        arc = [(cx + span / 2 * math.cos(math.pi * i / 14), 1.0 + 3.6 * math.sin(math.pi * i / 14)) for i in range(15)]
        M.prism_y(LIME, -5, 5, [(cx + span / 2, 1.0), (cx + span / 2, 6.2), (cx - span / 2, 6.2), (cx - span / 2, 1.0)] + list(reversed(arc))[1:-1], .93)
    for side in (-1, 1):
        y = side * 4.7
        M.box(LIME, -L / 2, L / 2, y - .3, y + .3, 7.0, 7.25, .95)
        M.box(LIME, -L / 2, L / 2, y - .32, y + .32, 8.05, 8.3, .95)
        for k in range(int(L / .5)):
            M.lathe(LIME, -L / 2 + .25 + k * .5, y, [(.1, 0), (.15, .25), (.08, .5), (.12, .7), (.1, .8)], 6, .94, 7.25)
        for k in range(4):
            x = -L / 2 + k * L / 3
            lamp_post(M, x, y, 8.3, .8)
    return M

def quay():
    M = Module('kit-quay')
    M.box(DARK, -5, 5, 0, 1.2, -2.6, .55, .82)
    for k in range(7): M.box(DARK, -5, 5, -.04, 0, -2.6 + k * .45, -2.6 + k * .45 + .4, .78 + .05 * (k % 2))
    M.box(LIME, -5.05, 5.05, -.18, 1.0, .55, .78, .95)
    for x in (-4.85, 0, 4.85): M.box(LIME, x - .25, x + .25, .05, .55, .78, 1.6, .95)
    for k in range(18):
        M.lathe(LIME, -4.5 + k * .53, .3, [(.08, 0), (.12, .2), (.07, .42), (.1, .62), (.08, .78)], 6, .93, .78)
    M.box(LIME, -5.05, 5.05, .02, .58, 1.56, 1.72, .95)
    M.lathe(IRON, 2.5, -.12, [(.12, 0), (.18, .1), (.16, .35), (.22, .42), (0, .5)], 8, 1.0, .78)
    return M

def lamp_post(M, x, y, z=0.0, s=1.0):
    M.lathe(IRON, x, y, [(.28 * s, 0), (.26 * s, .3 * s), (.14 * s, .6 * s), (.1 * s, 1.0 * s), (.08 * s, 3.6 * s), (.06 * s, 4.5 * s)], 10, 1.0, z)
    for side in (-1, 1):
        M.add(IRON, [(x, y - .03, z + 4.1 * s), (x + side * .9 * s, y - .03, z + 4.45 * s), (x + side * .9 * s, y + .03, z + 4.45 * s), (x, y + .03, z + 4.1 * s),
                     (x, y - .03, z + 4.18 * s), (x + side * .9 * s, y - .03, z + 4.53 * s), (x + side * .9 * s, y + .03, z + 4.53 * s), (x, y + .03, z + 4.18 * s)],
              [(0, 1, 2, 3), (7, 6, 5, 4), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])
        lx = x + side * .9 * s
        M.lathe(IRON, lx, y, [(.05 * s, 0), (.2 * s, .08 * s), (.2 * s, .12 * s)], 8, 1.0, z + 4.18 * s)
        M.lathe(LAMP, lx, y, [(.16 * s, 0), (.22 * s, .45 * s), (.0, .5 * s)], 8, 1.0, z + 4.3 * s)
        M.lathe(IRON, lx, y, [(.26 * s, 0), (.12 * s, .2 * s), (0, .38 * s)], 8, 1.0, z + 4.75 * s)
    M.lathe(GOLD, x, y, [(.07 * s, 0), (.11 * s, .1 * s), (0, .35 * s)], 8, 1.0, z + 4.5 * s)

def props():
    mods = []
    M = Module('kit-lamp', grime=False); lamp_post(M, 0, 0); mods.append(M)
    M = Module('kit-bench', grime=False)
    for x in (-.85, .85):
        M.add(IRON, [(x - .03, -.25, 0), (x + .03, -.25, 0), (x + .03, .25, 0), (x - .03, .25, 0), (x - .03, -.2, .45), (x + .03, -.2, .45), (x + .03, .3, .9), (x - .03, .3, .9)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)])
    for k in range(4): M.box(WOOD, -1.0, 1.0, -.25 + k * .12, -.16 + k * .12, .43, .47, (.75, .55, .38))
    for k in range(3): M.box(WOOD, -1.0, 1.0, .2 + k * .03, .24 + k * .03, .55 + k * .12, .64 + k * .12, (.75, .55, .38))
    mods.append(M)
    M = Module('kit-litfass', grime=False)
    M.cyl(IRON, 0, 0, 0, .35, .78, seg=16)
    posters = [OXBLOOD, CREAM, (.85, .7, .35), NAVY, BOTTLE, CREAM, (.7, .35, .25), (.9, .85, .7)]
    for k in range(8):
        a0, a1 = 2 * math.pi * k / 8, 2 * math.pi * (k + 1) / 8
        for band in range(2):
            z0, z1 = .4 + band * 1.25, 1.6 + band * 1.25
            c = posters[(k + band * 3) % 8]
            pts = [(math.cos(a0 + (a1 - a0) * t / 3) * .67, math.sin(a0 + (a1 - a0) * t / 3) * .67) for t in range(4)]
            v = [(px, py, z0) for px, py in pts] + [(px, py, z1) for px, py in pts]
            M.add(CLOTH, v, [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6)], c)
    M.cyl(FRAME, 0, 0, .35, 3.1, .65, seg=16, col=(.9, .88, .82))
    M.lathe(IRON, 0, 0, [(.82, 0), (.8, .12), (.6, .35), (.3, .62), (0, .8)], 16, 1.0, 3.1)
    M.lathe(GOLD, 0, 0, [(.05, 0), (.12, .15), (0, .4)], 8, 1.0, 3.88)
    mods.append(M)
    M = Module('kit-flag', grime=False)
    M.cyl(LIME, 0, 0, 0, .6, .45, .38, 10)
    M.cyl(IRON, 0, 0, .6, 10.5, .09, .06, 8)
    M.sphere(GOLD, 0, 0, 10.65, .17, .17, .17, 8, 6)
    M.box(IRON, -.03, 1.6, -.03, .03, 10.15, 10.22)
    M.add(BANNER, [(.15, -.03, 10.1), (1.55, -.03, 10.1), (1.55, -.03, 5.4), (.15, -.03, 5.4), (.15, .03, 10.1), (1.55, .03, 10.1), (1.55, .03, 5.4), (.15, .03, 5.4)],
          [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6), (0, 4, 7, 3), (1, 2, 6, 5)], uvfit=True)
    mods.append(M)
    M = Module('kit-kiosk')
    M.lathe(WOOD, 0, 0, [(1.55, 0), (1.55, 2.6)], 8, BOTTLE, 0, smooth=False)
    M.lathe(GLASS, 0, 0, [(1.58, 0), (1.58, 1.0)], 8, (.6, .64, .7), 1.25, smooth=False)
    M.lathe(GOLD, 0, 0, [(1.62, 0), (1.62, .12)], 8, 1.0, 2.6, smooth=False)
    M.lathe(COPPER, 0, 0, [(2.0, 0), (1.9, .25), (1.0, 1.1), (.3, 1.7), (0, 1.9)], 8, 1.0, 2.72, smooth=False)
    M.lathe(GOLD, 0, 0, [(.1, 0), (.18, .2), (0, .6)], 8, 1.0, 4.6)
    mods.append(M)
    M = Module('kit-urn')
    M.boxc(LIME, 0, 0, 0, 1.1, 1.1, .9, .95)
    M.lathe(LIME, 0, 0, [(.3, 0), (.25, .2), (.6, .5), (.7, .8), (.62, 1.0)], 12, .97, .9)
    M.sphere(LEAF, 0, 0, 2.1, .75, .75, .7, 10, 7, (.8, .95, .7), jitter=.12)
    mods.append(M)
    M = Module('kit-hedge', grime=False)
    for k in range(5): M.sphere(LEAF, -1.6 + k * .8, 0, .65, .6, .55, .7, 8, 6, (.75, .9, .65), jitter=.1)
    M.box(LEAF, -2, 2, -.45, .45, 0, 1.15, (.7, .85, .6))
    mods.append(M)
    M = Module('kit-linden', grime=False)
    M.lathe(BARK, 0, 0, [(.34, 0), (.26, .5), (.21, 2.4), (.17, 3.9)], 8, 1.0)
    for a_ in (0, 2.1, 4.2):
        M.push(TR(0, 0, 3.3) @ ROT(math.degrees(a_)) @ Matrix.Rotation(math.radians(38), 4, 'X'))
        M.cyl(BARK, 0, 0, 0, 1.6, .12, .07, 6)
        M.pop()
    rnd = random.Random(11)
    for k in range(16):
        t = k / 16 * math.pi * 2; rr = rnd.uniform(.4, 2.3); zz = rnd.uniform(4.4, 7.6)
        r = rnd.uniform(1.0, 1.7) * (1.15 - (zz - 4.4) / 9)
        shade = .62 + .38 * (zz - 4.4) / 3.2 + .08 * rr / 2.3   # inner/lower clusters darker, sunlit crown lighter
        M.sphere(LEAF, math.cos(t * 2.3) * rr, math.sin(t * 2.3) * rr, zz, r, r, r * .85, 9, 6, (shade * (.86 + rnd.uniform(-.08, .08)), shade, shade * (.7 + rnd.uniform(-.06, .06))), jitter=.22)
    mods.append(M)
    M = Module('kit-cypress', grime=False)
    M.cyl(BARK, 0, 0, 0, .8, .18, .14, 6)
    M.lathe(LEAF, 0, 0, [(.0, .4), (.9, 1.2), (1.15, 3), (1.05, 5), (.7, 7.2), (.25, 8.6), (0, 9.0)], 10, (.62, .8, .58))
    mods.append(M)
    M = Module('kit-fountain')
    M.lathe(LIME, 0, 0, [(6.5, 0), (6.5, .7), (6.1, .75), (6.1, .3), (0, .3)], 32, .95)
    M.lathe(WATER, 0, 0, [(0, 0), (6.08, 0), (6.08, .02), (0, .02)], 32, 1.0, .55)
    M.lathe(LIME, 0, 0, [(1.2, 0), (.8, .8), (.6, 2.2), (2.6, 2.6), (2.7, 2.9), (.5, 3.0), (.4, 4.2), (1.2, 4.5), (1.25, 4.7), (.3, 4.8), (0, 5.4)], 20, .97, .3)
    M.lathe(WATER, 0, 0, [(0, 0), (2.5, 0), (2.5, .02), (0, .02)], 20, 1.0, 3.1)
    for k in range(4):
        a = math.pi / 2 * k + math.pi / 4
        M.sphere(GOLD, 4.2 * math.cos(a), 4.2 * math.sin(a), 1.4, .45, .45, .6, 8, 6)
    mods.append(M)
    M = Module('kit-statue')
    M.boxc(DARK, 0, 0, 0, 4.2, 2.4, 3.4, .9)
    M.boxc(LIME, 0, 0, 3.4, 4.6, 2.8, .4, .95)
    # equestrian allegory: abstract horse and rider in gilded bronze
    M.sphere(GOLD, 0, 0, 5.6, 1.5, .55, .62, 12, 8)
    M.push(TR(1.45, 0, 6.0) @ Matrix.Rotation(math.radians(-40), 4, 'Y'))
    M.sphere(GOLD, 0, 0, .7, .32, .3, .85, 8, 6); M.sphere(GOLD, .1, 0, 1.55, .25, .22, .5, 8, 6)
    M.pop()
    for lx in (-1.0, 1.0):
        for ly in (-.3, .3):
            M.cyl(GOLD, lx + (.25 if lx > 0 and ly > 0 else 0), ly, 3.8, 5.3, .13, .09, 6)
    M.cyl(GOLD, -1.6, 0, 5.2, 5.9, .1, .04, 6)
    statue(M, -.1, 0, 5.8, 1.1)
    mods.append(M)
    M = Module('kit-bollard', grime=False)
    M.lathe(IRON, 0, 0, [(.14, 0), (.12, .7), (.15, .75), (.1, .85), (0, .9)], 10, 1.0)
    mods.append(M)
    return mods

def skyline(name, w, d, h, style):
    """Second-line Gruenderzeit block: punched windows on all four sides, rusticated base, roof variant."""
    M = Module(name)
    M.box(PLASTER, -w / 2, w / 2, 0, d, 0, h, (.96, .93, .88))
    M.box(DARK, -w / 2 - .06, w / 2 + .06, -.08, d + .08, 0, 4, .85)
    floors = int((h - 4) / 3.4)
    for side in range(4):  # front, right, back, left
        length = w if side % 2 == 0 else d
        M.push({0: TR(0, 0), 1: TR(w / 2, d / 2) @ ROT(90), 2: TR(0, d) @ ROT(180), 3: TR(-w / 2, d / 2) @ ROT(-90)}[side])
        n = max(2, int(length / 3.2))
        for f in range(floors):
            z = 4 + f * 3.4 + .8
            for k in range(n):
                x = -length / 2 + (k + .5) * length / n
                M.box(GLASS, x - .55, x + .55, -.05, .02, z, z + 1.75, (.5, .55, .62))
                M.box(STONE, x - .7, x + .7, -.14, 0, z - .16, z - .04, .9)
                M.box(STONE, x - .68, x + .68, -.1, 0, z + 1.75, z + 1.9, .92)
        M.pop()
    M.prism_x(LIME, -w / 2, w / 2, [(y, z + h - .3) for y, z in CORNICE], .95)
    if style == 'mansard': mansard(M, -w / 2, w / 2, h, d, h1=3.2, h2=1, dormers=int(w / 4))
    elif style == 'dome':
        mansard(M, -w / 2, w / 2, h, d, h1=2.6, h2=.8, dormers=0, roof=COPPER)
        M.lathe(LIME, 0, d / 2, [(3.4, 0), (3.4, 3)], 12, .96, h + 3)
        M.lathe(COPPER, 0, d / 2, [(3.6, 0), (3.2, 2), (1.6, 4), (0, 4.8)], 12, 1.0, h + 6)
    else:
        M.prism_x(SLATE, -w / 2, w / 2, [(0, h), (d, h), (d / 2, h + 4.5)], 1.0)
        chimney(M, -w / 4, d / 2, h + 2.5); chimney(M, w / 4, d / 2, h + 2.5)
    return M

def corner_tower():
    M = townhouse('kit-corner', 16, 5, 4, roof='mansard')
    # round corner tower at the left front edge with copper onion dome and lantern
    cx, cy, top = -8, 0, 4.6 + 4 * 3.55
    M.lathe(PLASTER, cx, cy, [(3.0, 0), (3.0, top + 4)], 20, (1, .97, .92), smooth=True)
    M.lathe(DARK, cx, cy, [(3.12, 0), (3.12, 4.6)], 20, .85)
    for f in range(5):
        for k in range(3):
            a = math.radians(200 + k * 55)
            M.push(TR(cx + 3.05 * math.cos(a), cy + 3.05 * math.sin(a), 0) @ ROT(math.degrees(a) + 90))
            window(M, 0, 5.4 + f * 3.55, 1.0, 2.0, 'key')
            M.pop()
    M.lathe(LIME, cx, cy, [(3.4, 0), (3.5, .5), (3.2, .8)], 20, .96, top + 4)
    M.lathe(COPPER, cx, cy, [(3.2, 0), (3.5, 1.4), (3.0, 3.2), (1.4, 5.0), (.5, 5.8), (.35, 6.6)], 20, 1.0, top + 4.8)
    M.lathe(COPPER, cx, cy, [(.9, 0), (.9, 1.6), (.2, 2.4)], 8, 1.0, top + 11.4)
    M.lathe(GOLD, cx, cy, [(.15, 0), (.3, .4), (0, 1.0)], 8, 1.0, top + 13.8)
    return M

# --- Build ---------------------------------------------------------------------------------------
def to_blender(M, offset):
    root = bpy.data.objects.new(M.name, None); bpy.context.collection.objects.link(root)
    root.location = (offset, 0, 0)  # spread in the .blend for editing; runtime uses local geometry
    for mname, p in M.parts.items():
        if not p['f']: continue
        me = bpy.data.meshes.new(f'{M.name}|{mname}')
        nv = len(p['v']); keep = [i for i, f in enumerate(p['f']) if len(f) >= 3 and len(set(f)) == len(f) and max(f) < nv]
        if len(keep) != len(p['f']): print('  dropped faces', M.name, mname, len(p['f']) - len(keep), flush=True)
        faces = [p['f'][i] for i in keep]; smooth = [p['smooth'][i] for i in keep]
        me.from_pydata(p['v'], [], faces)
        bm = bmesh.new(); bm.from_mesh(me)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.to_mesh(me); bm.free()
        for poly, sm in zip(me.polygons, smooth): poly.use_smooth = sm
        me.uv_layers.new(name='UVMap'); me.color_attributes.new('Col', 'BYTE_COLOR', 'CORNER')
        uvs, cols = [], []
        for poly in me.polygons:
            n = poly.normal; ax = max(range(3), key=lambda i: abs(n[i]))
            for li in poly.loop_indices:
                vi = me.loops[li].vertex_index; v = p['v'][vi]
                fit = p['uv'][vi]
                if fit is not None: uvs += fit
                elif ax == 2: uvs += (v[0] * .5, v[1] * .5)
                elif ax == 0: uvs += (v[1] * .5, v[2] * .5)
                else: uvs += (v[0] * .5, v[2] * .5)
                c = p['c'][vi]; g = 1.0
                if M.grime and mname not in (GLASS, LAMP, GOLD, BANNER, CROWD, SKIN): g = .74 + .26 * min(1, max(0, v[2] / 2.6)) ** .7
                cols += (c[0] * g, c[1] * g, c[2] * g, 1)
        # Re-fetch layers after both exist: adding an attribute invalidates earlier layer references.
        me.uv_layers['UVMap'].data.foreach_set('uv', uvs)
        me.color_attributes['Col'].data.foreach_set('color', cols)
        me.color_attributes.active_color = me.color_attributes['Col']
        me.materials.append(MATS[mname])
        ob = bpy.data.objects.new(f'{M.name}|{mname}', me); bpy.context.collection.objects.link(ob); ob.parent = root
    return root

for ob in list(bpy.data.objects): bpy.data.objects.remove(ob)
modules = [
    townhouse('kit-house-a', 15, 5, 3, 'mansard'),
    townhouse('kit-house-b', 14, 4, 3, 'gable', erker=True),
    townhouse('kit-house-c', 11, 3, 3, 'gable', shutters=(.3, .42, .34)),
    townhouse('kit-house-d', 19, 6, 4, 'attic', giant=True, depth=15),
    corner_tower(), palace(), cathedral(), victory_column(), grandstand(), gate(), finish_gantry(), bridge(), quay(),
    skyline('kit-sky-a', 22, 14, 20, 'mansard'), skyline('kit-sky-b', 30, 16, 26, 'dome'), skyline('kit-sky-c', 18, 12, 16, 'gable'),
] + props()
x = 0
for M in modules:
    to_blender(M, x); x += 120
stats = {M.name: sum(len(p['f']) for p in M.parts.values()) for M in modules}
print('KIT FACES', stats, 'TOTAL', sum(stats.values()))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art-source', 'city-kit.blend'))
for ob in bpy.data.objects:
    if ob.parent is None: ob.location = (0, 0, 0)
out = os.path.join(ROOT, '.tools', 'raw-models', 'city-kit.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
kw = dict(filepath=out, export_format='GLB', export_apply=True, export_yup=True)
try: bpy.ops.export_scene.gltf(**kw, export_vertex_color='ACTIVE')
except TypeError: bpy.ops.export_scene.gltf(**kw, export_colors=True)
print('KIT EXPORTED', out)
