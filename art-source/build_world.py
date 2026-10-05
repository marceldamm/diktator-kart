"""Neutral 'Stadion der Eitelkeit' world, placed along the shared circuit centreline.
Run: blender --background --python art-source/build_world.py
Reads art-source/track-layout.json (node art-source/export_track.mjs). Writes stadium-world.blend/.glb.
Original geometry only; fictional civic architecture without historical insignia.
Blender X/Y equal game x/z. Local track frames: +Y along the driving direction, +X to the driver's right.
"""
import os, sys, json, math, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *
import mesh_tools as mt
mt.BUILD_WORLD = True
random.seed(1936)

T = json.load(open(os.path.join(ROOT, 'art-source', 'track-layout.json'), encoding='utf8'))
F = T.get('scale', 1)                      # whole-map scale; progress constants below are base values
S, L, W, START = T['samples'], T['length'], T['halfWidth'], T['start']
LM = T['landmarks']
PROM = W + 1.45 + LM['promenade']          # outer edge of the promenade strip

def tp(s, lane=0.0):
    s %= L
    n = len(S); i = int(s / L * n) % n
    while S[i][3] > s and i > 0: i -= 1
    while i + 1 < n and S[i + 1][3] <= s: i += 1
    a, b = S[i], S[(i + 1) % n]
    span = (b[3] if i + 1 < n else L) - a[3]
    f = (s - a[3]) / span if span > 0 else 0
    dh = math.atan2(math.sin(b[2] - a[2]), math.cos(b[2] - a[2]))
    h = a[2] + dh * f
    x, y = a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f
    return x + math.cos(h) * lane, y - math.sin(h) * lane, h

ALLEY = T.get('shortcut', {}).get('points', [])

def clearance(x, y):
    # Distance to the circuit centreline; the backyard alley counts as circuit with its own (narrower) corridor.
    d = min(math.hypot(p[0] - x, p[1] - y) for p in S)
    if ALLEY: d = min(d, min(math.hypot(p[0] - x, p[1] - y) for p in ALLEY) + (W - T['shortcut']['halfWidth']))
    return d

def frame(s, lane, turn=0.0, name='frame'):
    x, y, h = tp(s, lane)
    e = empty(name, (x, y, 0)); e.rotation_euler[2] = -h + turn
    return e

def frame_at(x, y, rot, name='frame'):
    e = empty(name, (x, y, 0)); e.rotation_euler[2] = rot
    return e

def bake(e):
    """Moves children of a placement frame into world space and removes the frame."""
    bpy.context.view_layer.update()
    for o in [c for c in bpy.data.objects if c.parent == e]:
        mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
        if o.type == 'MESH':
            o.data.transform(o.matrix_basis); o.matrix_basis.identity()
    bpy.data.objects.remove(e)

def text(name, body, pos, size, m, rotation=(math.pi / 2, 0, 0), parent=None):
    c = bpy.data.curves.new(name, 'FONT'); c.body = body; c.align_x = 'CENTER'; c.size = size; c.extrude = .02
    o = bpy.data.objects.new(name, c); bpy.context.collection.objects.link(o)
    o.location = pos; o.rotation_euler = rotation; o.data.materials.append(m)
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.convert(target='MESH'); o.parent = parent
    return o

stone = mat('Warm limestone', (.56, .48, .36), 0, .8)
pale = mat('Carved ivory stone', (.78, .69, .52), 0, .72)
darkstone = mat('Sandstone shadow', (.33, .29, .23), 0, .87)
copper = mat('Oxidised copper roof', (.07, .27, .24), .62, .48)
window = mat('Recessed blue glass', (.045, .105, .13), .35, .25)
burgundy = mat('Theatre burgundy cloth', (.36, .03, .04), 0, .9)
leaf = mat('Cypress foliage', (.06, .16, .065), 0, .92)
trunk = mat('Bark', (.13, .07, .035), 0, .96)
brick = mat('Terracotta render', (.42, .2, .11), 0, .88)
ochre = mat('Ochre render limestone', (.62, .45, .24), 0, .85)
shutter_green = mat('Weathered blue-green timber shutters', (.16, .25, .22), 0, .9)
shutter_red = mat('Weathered burgundy timber shutters', (.32, .10, .09), 0, .9)
shop_enamel_green = mat('Shop sign deep green enamel', (.025, .13, .12), .2, .3)
shop_enamel_red = mat('Shop sign oxblood enamel', (.25, .035, .04), .16, .34)
shop_enamel_cream = mat('Shop sign warm ivory enamel', (.72, .57, .34), .12, .42)
wood = mat('Oiled stadium wood', (.17, .11, .055), 0, .76)
canvas = mat('Striped canopy cloth', (.025, .16, .17), 0, .91)
water = mat('Fountain basin water', (.06, .23, .25), .2, .12)
bronze = mat('Patinated bronze', (.2, .17, .1), .9, .42)
suits = [mat('Spectator burgundy', (.3, .03, .045), 0, .85), mat('Spectator olive', (.16, .19, .1), 0, .92),
         mat('Spectator navy', (.04, .085, .15), 0, .85), coat]
flower = mat('Park burgundy flowers', (.42, .04, .07), 0, .85)
hedge = mat('Park hedge foliage', (.045, .14, .05), 0, .96)


def tube_lo(name, points, r, m, parent=None):
    """Low-resolution swept tube for distant ornament."""
    curve = bpy.data.curves.new(name, 'CURVE'); curve.dimensions = '3D'
    curve.bevel_depth = r; curve.bevel_resolution = 0; curve.resolution_u = 2
    sp = curve.splines.new('POLY'); sp.points.add(len(points) - 1)
    for pt, co in zip(sp.points, points): pt.co = (*co, 1)
    o = bpy.data.objects.new(name, curve); bpy.context.collection.objects.link(o)
    o.data.materials.append(m); o.parent = parent
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.convert(target='MESH'); o.select_set(False); return o

def blob(name, pos, size, m, parent=None, seg=8, rings=6):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=rings, location=pos)
    o = bpy.context.object; o.scale = size
    for pg in o.data.polygons: pg.use_smooth = True
    o.name = name; o.data.materials.append(m); o.parent = parent; return o

# --- Reusable civic pieces ------------------------------------------------------------
def column(x, y, z, h, r=.48, parent=None):
    cyl('Fluted column', (x, y, z + h / 2), r, h, pale, parent, r2=r * .88, verts=16)
    for j in range(8):
        a = j * math.pi / 4
        cyl('Column flute', (x + r * .94 * math.sin(a), y + r * .94 * math.cos(a), z + h / 2), r * .09, h * .92, darkstone, parent, verts=5)
    for dz, rr in [(0, r * 1.22), (.2, r * 1.12), (h - .2, r * 1.12), (h, r * 1.32)]:
        cyl('Column moulding', (x, y, z + dz), rr, .2, pale, parent)

def arch(x, y, z, width, height, depth, m, parent=None):
    r = width / 2; vs = []; fs = []
    for j in range(17):
        a = j * math.pi / 16
        for yy, rr in [(y - depth / 2, r), (y - depth / 2, r + .55), (y + depth / 2, r), (y + depth / 2, r + .55)]:
            vs.append((x + rr * math.cos(a), yy, z + height - r + rr * math.sin(a)))
    for j in range(16):
        k = j * 4
        fs.extend([(k, k + 4, k + 5, k + 1), (k + 2, k + 3, k + 7, k + 6), (k, k + 2, k + 6, k + 4), (k + 1, k + 5, k + 7, k + 3)])
    mesh('Masonry arch', vs, fs, m, parent)
    for side in [-1, 1]: box('Arch pier', (x + side * (r + .27), y, z + (height - r) / 2), (.55, depth, height - r), m, .02, parent)

def dome(x, y, z, r, h, parent=None):
    cyl('Dome drum', (x, y, z + 1.4), r * .82, 2.8, pale, parent, verts=40)
    vs = []; fs = []; Sg = 40; R = 12
    for i in range(R + 1):
        a = i * math.pi / 2 / R
        for j in range(Sg):
            b = j * 2 * math.pi / Sg; vs.append((x + r * math.cos(a) * math.cos(b), y + r * math.cos(a) * math.sin(b), z + 2.8 + h * math.sin(a)))
    for i in range(R):
        for j in range(Sg): fs.append((i * Sg + j, i * Sg + (j + 1) % Sg, (i + 1) * Sg + (j + 1) % Sg, (i + 1) * Sg + j))
    d = mesh('Ribbed copper dome', vs, fs, copper, parent)
    for p in d.data.polygons: p.use_smooth = True
    for j in range(16):
        b = j * math.pi / 8
        tube_lo('Dome brass rib', [(x + r * 1.01 * math.cos(i * math.pi / 14) * math.cos(b), y + r * 1.01 * math.cos(i * math.pi / 14) * math.sin(b), z + 2.8 + h * 1.01 * math.sin(i * math.pi / 14)) for i in range(8)], .08, gold, parent)
    cyl('Dome lantern', (x, y, z + 2.8 + h + 1.1), .9, 2.2, pale, parent, verts=12)
    cyl('Lantern roof', (x, y, z + 2.8 + h + 2.5), 1.2, .8, copper, parent, r2=.05)
    cyl('Finial', (x, y, z + 2.8 + h + 3.4), .1, 1.6, gold, parent)

def trophy(x, y, z, scale=1.0, parent=None):
    cyl('Trophy plinth', (x, y, z + .45 * scale), 1.0 * scale, .9 * scale, darkstone, parent)
    cyl('Trophy stem', (x, y, z + 1.4 * scale), .18 * scale, 1.0 * scale, gold, parent)
    cyl('Trophy cup', (x, y, z + 2.4 * scale), .5 * scale, 1.0 * scale, gold, parent, r2=.95 * scale)
    for sd in [-1, 1]: torus('Trophy handle', (x + sd * .9 * scale, y, z + 2.4 * scale), .42 * scale, .08 * scale, gold, parent, 'Y')

def statue(x, y, z, scale=1.0, parent=None, rot=0.0):
    """Gilded 'unknown clerk' raising a giant rubber stamp: original satirical monument figure."""
    e = empty('statue', (x, y, z), parent); e.rotation_euler[2] = rot; e.scale = (scale, scale, scale)
    blob('Statue gilded coat', (0, 0, 1.25), (.42, .34, .75), gold, e, 12, 8)
    blob('Statue gilded head', (0, .02, 2.25), (.26, .26, .3), gold, e, 12, 8)
    cyl('Statue gilded cap', (0, .02, 2.55), .27, .16, gold, e, verts=14)
    blob('Statue cap visor', (0, .22, 2.48), (.2, .12, .03), gold, e, 10, 4)
    tube_lo('Statue raised arm', [(.3, 0, 1.75), (.48, .05, 2.3), (.5, .05, 2.95)], .1, gold, e)
    cyl('Statue stamp handle', (.5, .05, 3.15), .07, .4, gold, e, verts=10)
    cyl('Statue stamp block', (.5, .05, 3.42), .26, .22, gold, e, verts=14)
    tube_lo('Statue lowered arm', [(-.3, 0, 1.75), (-.42, .1, 1.25), (-.38, .25, .95)], .1, gold, e)
    box('Statue file folder', (-.36, .3, .95), (.08, .34, .44), gold, .01, e)
    vs = [(-.45, -.3, 1.95), (.45, -.3, 1.95), (-.62, -.62, .1), (.62, -.62, .1)]
    mesh('Statue gilded cape', vs, [(0, 1, 3, 2)], gold, e)
    box('Statue base', (0, 0, .15), (1.1, 1.1, .3), darkstone, .02, e)
    bake(e)

def facade_banner(x, y, z, height, parent=None, facing=-1):
    """Long burgundy banner with a gold laurel-and-paragraph emblem (fictional)."""
    box('Facade banner', (x, y, z), (2.2, .1, height), burgundy, .01, parent)
    for dx in [-.92, .92]: box('Banner gold edge', (x + dx, y + facing * .06, z), (.1, .04, height), gold, .005, parent)
    cyl('Banner laurel', (x, y + facing * .08, z + height * .18), .55, .05, gold, parent, 'Y', verts=20)
    text('Banner paragraph', '§', (x, y + facing * .1, z + height * .18 - .42), 1.0, gold, (math.pi / 2, 0, 0 if facing < 0 else math.pi), parent)

def spectator(px, py, pz, suit, away, parent=None, wave=False):
    """Seated neutral adult spectator; 'away' is the local +X direction of the stand (backrest)."""
    blob('Spectator coat', (px, py, pz + .56), (.26, .28, .42), suit, parent)
    blob('Spectator head', (px - away * .03, py, pz + 1.13), (.17, .17, .22), skin, parent)
    cyl('Spectator hat', (px, py, pz + 1.32), .2, .1, [hair, black, burgundy][int(abs(py * 7)) % 3], parent, verts=8)
    box('Seated legs', (px - away * .3, py, pz + .22), (.5, .42, .2), suit, 0, parent)
    if wave:
        tube_lo('Raised waving arm', [(px, py + .25, pz + .74), (px - away * .2, py + .3, pz + 1.05), (px - away * .25, py + .32, pz + 1.42)], .075, suit, parent)
        blob('Spectator glove', (px - away * .25, py + .32, pz + 1.46), (.09, .1, .1), cream, parent, 6, 4)

def grandstand(s0, s1, side):
    """Three-tier covered stand behind the promenade; local +X points away from the road."""
    mid = (s0 + s1) / 2; length = s1 - s0
    e = frame(mid, side * (PROM + 3.2), 0 if side > 0 else math.pi, 'stand')
    for row in range(3):
        x = row * 1.15; height = .6 + row * .62
        box('Tribune limestone tier', (x, 0, height / 2), (1.2, length, height), stone, .025, e)
        box('Bench seat', (x, 0, height + .09), (.7, length - .4, .17), wood, .025, e)
        for j in range(int(length / 1.15)):
            py = -length / 2 + .8 + j * 1.15 + random.uniform(-.2, .2)
            if random.random() < .12: continue
            spectator(x + random.uniform(-.08, .08), py, height, suits[(j + row) % 4], 1, e, wave=(j + row) % 4 == 0)
    box('Stand back wall', (3.6, 0, 2.6), (.4, length + .6, 5.2), pale, .03, e)
    for py in [-length / 2, length / 2]:
        box('Stand side wall', (1.6, py, 1.6), (4.2, .35, 3.2), pale, .03, e)
        for x in [-.6, 3.3]: cyl('Canopy iron post', (x, py, 2.5), .08, 5, chrome, e, verts=10)
    n = int(length / 2)
    for j in range(n):
        box('Striped awning', (1.4, -length / 2 + 1 + j * 2, 5.05), (4.8, 1.98, .14), canvas if j % 2 else cream, .01, e)
    box('Canopy valance', (-.95, 0, 4.78), (.1, length, .55), canvas, .01, e)
    text('Stand slogan', 'APPLAUS AB REIHE DREI', (-1.02, 0, 4.72), .42, cream, (math.pi / 2, 0, -math.pi / 2), e)
    bake(e)

def townhouse(s, side, depth=13.0, width=15.0, idx=0):
    x, y, h = tp(s, side * (PROM + 1.5 + depth / 2))
    if clearance(x, y) < PROM + depth / 2 + .5: return False
    e = frame(s, side * (PROM + 1.5 + depth / 2), 0 if side > 0 else math.pi, 'house')
    floors = 3 + idx % 3; hgt = floors * 3.4 + 1.2
    body = [stone, ochre, pale, brick][idx % 4]
    box('Boulevard house', (0, 0, hgt / 2), (depth, width, hgt), body, .08, e)
    for z in [1.1, 4.2, hgt - .6]: box('Facade belt', (-depth / 2 - .08, 0, z), (.3, width + .3, .26), darkstone if body is not darkstone else pale, .03, e)
    vs = [(-depth / 2 - .5, -width / 2 - .4, hgt), (-depth / 2 - .5, width / 2 + .4, hgt), (depth / 2 + .5, -width / 2 - .4, hgt), (depth / 2 + .5, width / 2 + .4, hgt), (0, -width / 2 - .4, hgt + 3.2), (0, width / 2 + .4, hgt + 3.2)]
    mesh('Pitched copper roof', vs, [(0, 1, 5, 4), (2, 4, 5, 3), (0, 4, 2), (1, 3, 5)], copper, e)
    box('House chimney', (2, 3, hgt + 2.4), (1.1, 1.1, 2.6), darkstone, .03, e)
    face = -depth / 2
    trim_stone = pale if body is not pale else stone
    cols = [-width / 2 + 2.2 + k * 3.6 for k in range(int((width - 2.6) / 3.6) + 1)]
    for f in range(1, floors):
        z = 4.2 + (f - 1) * 3.4 + 1.6
        for column_index, dy in enumerate(cols):
            box('Window recess', (face + .04, dy, z), (.14, 1.5, 2.0), window, .02, e)
            box('Window moulding', (face - .1, dy, z + 1.12), (.24, 1.9, .16), pale, .02, e)
            box('Window sill', (face - .12, dy, z - 1.08), (.28, 1.8, .12), pale, .02, e)
            for jamb in [-.74, .74]: box('Window vertical casing', (face - .09, dy + jamb, z), (.22, .11, 1.98), trim_stone, .012, e)
            box('Window sash mullion', (face - .105, dy, z), (.23, .075, 1.86), darkstone, .008, e)
            box('Window cross rail', (face - .11, dy, z + .34), (.24, 1.38, .075), pale, .008, e)
            # Restrict the denser shutters to two upper windows on every fourth
            # building so the full city export stays light.
            if idx % 4 == 1 and f == 1 and column_index in (0, len(cols) - 1):
                shutter = shutter_red if (idx + f) % 3 == 0 else shutter_green
                for side in [-1, 1]:
                    shutter_y = dy + side * .99
                    box('Weathered timber window shutter', (face - .17, shutter_y, z), (.10, .27, 1.78), shutter, .018, e)
                    box('Timber shutter brace', (face - .23, shutter_y, z - .42), (.035, .31, .06), darkstone, .008, e)
            if (f + idx) % 2 == 0:
                box('Balcony slab', (face - .55, dy, z - 1.2), (1.0, 2.0, .14), pale, .03, e)
                tube_lo('Balcony rail', [(face - 1.0, dy - .95, z - .7), (face - 1.0, dy + .95, z - .7)], .035, black, e)
    # Keep the heavy stone base as narrow horizontal courses. A solid plinth across
    # the whole street-facing wall hid every shop window and made the blocks read flat.
    box('Granite street plinth', (face - .1, 0, .22), (.24, width + .12, .38), darkstone, .025, e)
    box('Granite plinth cap', (face - .14, 0, .48), (.32, width + .2, .12), trim_stone, .018, e)
    edges = [-width / 2 + .3] + [(cols[k] + cols[k + 1]) / 2 for k in range(len(cols) - 1)] + [width / 2 - .3]
    for py in edges: box('Facade pilaster', (face - .16, py, 4.2 + (hgt - 4.8) / 2), (.22, .42, hgt - 4.8), trim_stone, .01, e)
    # Recessed double door between the shop windows, with a stone portal, inset
    # timber panels, brass pulls and two shallow threshold steps.
    door_y, door_w = 0, 1.55
    box('Shop entrance shadow', (face - .055, door_y, 1.75), (.13, door_w + .54, 2.95), darkstone, .025, e)
    for py in [-(door_w / 2 + .17), door_w / 2 + .17]:
        box('Shop entrance jamb', (face - .2, py, 1.72), (.3, .22, 3.05), trim_stone, .025, e)
        box('Door jamb inset', (face - .24, py, 1.74), (.06, .045, 2.55), darkstone, .008, e)
    box('Shop entrance lintel', (face - .2, door_y, 3.25), (.34, door_w + .56, .28), trim_stone, .025, e)
    box('Shop door pair', (face - .16, door_y, 1.62), (.11, door_w, 2.55), wood, .018, e)
    box('Door centre stile', (face - .23, door_y, 1.62), (.06, .055, 2.5), darkstone, .006, e)
    for py in [-.36, .36]:
        box('Door recessed panel', (face - .23, py, 1.67), (.055, .51, 1.75), body, .012, e)
        box('Door transom glass', (face - .225, py, 2.68), (.055, .51, .32), window, .008, e)
        cyl('Brass entrance pull', (face - .29, py - .075, 1.55), .035, .12, gold, e, axis='Y', verts=10)
    box('Door lower threshold', (face - .38, 0, .62), (.78, door_w + .54, .13), pale, .018, e)
    box('Door upper threshold', (face - .26, 0, .78), (.46, door_w + .2, .1), trim_stone, .018, e)
    for f in range(1, floors):
        z = 4.2 + (f - 1) * 3.4 + 1.6
        for dy in cols:
            vs = [(face - .26, dy - 1.05, z + 1.25), (face - .26, dy + 1.05, z + 1.25), (face - .26, dy, z + 1.7), (face - .02, dy - 1.05, z + 1.25), (face - .02, dy + 1.05, z + 1.25), (face - .02, dy, z + 1.7)]
            mesh('Window pediment', vs, [(0, 1, 2), (3, 5, 4), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)], trim_stone, e)
    box('Main cornice', (face - .45, 0, hgt - .15), (.9, width + .9, .32), trim_stone, .02, e)
    for k in range(int(width / .55)): box('Cornice dentil', (face - .82, -width / 2 + .3 + k * .55, hgt - .42), (.18, .22, .22), trim_stone, .005, e)
    for dy in [-width / 4, width / 4]:
        box('Roof dormer', (face + 1.6, dy, hgt + 1.1), (1.6, 1.6, 1.6), body, .02, e)
        box('Dormer window', (face + .79, dy, hgt + 1.0), (.06, .9, 1.0), window, .01, e)
        vs = [(face + .7, dy - .95, hgt + 1.9), (face + .7, dy + .95, hgt + 1.9), (face + 2.5, dy - .95, hgt + 1.9), (face + 2.5, dy + .95, hgt + 1.9), (face + .7, dy, hgt + 2.5), (face + 2.5, dy, hgt + 2.5)]
        mesh('Dormer roof', vs, [(0, 1, 4), (2, 5, 3), (0, 4, 5, 2), (1, 3, 5, 4)], copper, e)
    for dy in cols:
        box('Shop display window', (face + .02, dy, 1.9), (.1, 2.6, 2.4), window, .012, e)
        for j in range(5):
            aw = box('Shop striped awning', (face - .7, dy - 1.2 + j * .6, 3.35), (1.5, .59, .12), canvas if (j + idx) % 2 else cream, .01, e)
            aw.rotation_euler[1] = .2
        # Only every third block gets restrained shop-window planters, keeping
        # the street edge varied without turning every facade into the same prop set.
        if idx % 3 == 1 and dy == cols[len(cols) // 2]:
            box('Terracotta shop window planter', (face - .28, dy, .67), (.38, 2.2, .24), brick, .025, e)
            blob('Shop planter foliage left', (face - .32, dy - .43, .9), (.11, .2, .18), hedge, e, 6, 4)
            blob('Shop planter foliage right', (face - .32, dy + .36, .9), (.11, .2, .18), hedge, e, 6, 4)
            blob('Shop planter flower', (face - .37, dy - .04, 1.0), (.08, .1, .1), flower, e, 6, 4)
    # Occasional projecting blade signs add a readable street-level silhouette
    # and distinct shop identities without repeating a prop on every building.
    if idx % 7 == 2:
        sign_y = cols[0] + .1
        enamel = [shop_enamel_green, shop_enamel_red, shop_enamel_cream][idx % 3]
        sign_x = face - 1.0
        box('Shop blade sign enamel', (sign_x, sign_y, 3.18), (.09, .92, .76), enamel, .04, e)
        # Raised warm brass border and two short scroll brackets tie the sign to the stonework.
        for dz in [-.37, .37]: box('Shop blade sign brass border', (sign_x - .055, sign_y, 3.18 + dz), (.035, .98, .04), gold, .01, e)
        for dy_border in [-.47, .47]: box('Shop blade sign brass border', (sign_x - .055, sign_y + dy_border, 3.18), (.035, .04, .74), gold, .01, e)
        tube_lo('Shop sign wrought iron bracket', [(face - .16, sign_y, 3.62), (face - .48, sign_y, 3.62), (face - .83, sign_y, 3.55)], .035, black, e)
        tube_lo('Shop sign bracket curl', [(face - .25, sign_y, 3.63), (face - .35, sign_y + .14, 3.71), (face - .52, sign_y + .2, 3.63), (face - .6, sign_y + .18, 3.57)], .018, gold, e)
        word = ['KAFFEE', 'BROT', 'POST'][idx % 3]
        text('Shop blade sign lettering', word, (sign_x - .056, sign_y, 3.18), .16, pale, (math.pi / 2, 0, -math.pi / 2), e)
        # A simple, raised shop pictogram sits above the lettering: cup, loaf, or envelope.
        icon_z = 3.38
        if idx % 3 == 0:
            box('Cafe cup icon', (sign_x - .058, sign_y, icon_z), (.025, .2, .14), pale, .02, e)
            tube_lo('Cafe cup handle', [(sign_x - .075, sign_y + .1, icon_z + .04), (sign_x - .075, sign_y + .16, icon_z + .04), (sign_x - .075, sign_y + .16, icon_z - .03), (sign_x - .075, sign_y + .1, icon_z - .03)], .014, gold, e)
            tube_lo('Cafe steam', [(sign_x - .07, sign_y - .055, icon_z + .11), (sign_x - .07, sign_y - .08, icon_z + .15), (sign_x - .07, sign_y - .04, icon_z + .18)], .012, pale, e)
        elif idx % 3 == 1:
            blob('Bakery loaf icon', (sign_x - .06, sign_y, icon_z), (.025, .2, .075), pale, e, 12, 8)
            for slash in [-.055, 0, .055]: tube_lo('Bread scoring', [(sign_x - .087, sign_y + slash, icon_z - .02), (sign_x - .087, sign_y + slash + .03, icon_z + .035)], .008, gold, e)
        else:
            box('Post envelope icon', (sign_x - .058, sign_y, icon_z), (.025, .23, .14), pale, .009, e)
            tube_lo('Envelope fold', [(sign_x - .075, sign_y - .1, icon_z + .055), (sign_x - .075, sign_y, icon_z - .015), (sign_x - .075, sign_y + .1, icon_z + .055)], .009, gold, e)
    if idx % 2 == 0:
        facade_banner(face - .12, cols[len(cols) // 2] if len(cols) > 2 else 0, hgt * .55, hgt * .5, e, -1)
    bake(e)
    return True

def gate(s):
    e = frame(s, 0, 0, 'gate')
    span = 2 * (W + 1.45) + 1.6
    arch(0, 0, 0, span, 10.5, 2.6, pale, e)
    for sd in [-1, 1]:
        x = sd * (span / 2 + 2.6)
        box('Gate tower', (x, 0, 6.5), (4.4, 5.2, 13), stone, .08, e)
        box('Gate cornice', (x, 0, 13.1), (5.2, 6, .6), gold, .05, e)
        trophy(x, 0, 13.4, 1.0, e)
        for yy in [-2.65, 2.65]:
            facade_banner(x, yy + (-.08 if yy < 0 else .08), 7, 7.5, e, -1 if yy < 0 else 1)
    box('Gate attic', (0, 0, 11.9), (span + 1.6, 3, 2.2), stone, .05, e)
    statue(0, 0, 13.0, 1.6, e)
    for yy, rot in [(-1.53, 0), (1.53, math.pi)]:
        text('Gate sign', 'AMT FÜR ÜBERHOLGENEHMIGUNGEN', (0, yy, 11.55), .78, gold, (math.pi / 2, 0, rot), e)
    bake(e)

def finish_gantry():
    e = frame(START, 0, 0, 'finish')
    for x in [-(W + 2.4), W + 2.4]:
        cyl('Finish bridge column', (x, 0, 3.8), .4, 7.6, stone, e, verts=16)
        box('Finish bridge plinth', (x, 0, .3), (1.4, 1.4, .6), stone, .04, e)
        cyl('Finish bridge cap', (x, 0, 7.55), .58, .3, gold, e, verts=16)
        cyl('Flag mast', (x, 0, 9.4), .04, 3, gold, e, verts=10)
        vs = [(x + i * .5 * (-1 if x > 0 else 1), 0, 10.3 + j * .9 + math.sin(i * 1.5) * .12) for j in [0, 1] for i in range(5)]
        mesh('Waving neutral race pennant', vs, [(i, i + 1, i + 6, i + 5) for i in range(4)], burgundy, e)
    box('Race banner', (0, 0, 7.6), (2 * (W + 2.4), .5, 1.8), canvas, .025, e)
    for z in [6.68, 8.52]: box('Banner brass rail', (0, 0, z), (2 * (W + 2.4) + .2, .58, .09), gold, .01, e)
    for yy, rot in [(-.27, 0), (.27, math.pi)]:
        text('Finish sign', 'ZIEL NACH VORSCHRIFT', (0, yy, 7.3), .78, cream, (math.pi / 2, 0, rot), e)
    bake(e)

def fountain(x, y):
    cyl('Fountain basin', (x, y, .3), 5.6, .6, pale, verts=40)
    cyl('Fountain water', (x, y, .58), 5.15, .04, water, verts=40)
    torus('Fountain rim', (x, y, .62), 5.25, .26, pale)
    cyl('Fountain pedestal', (x, y, 1.3), .7, 1.4, pale)
    cyl('Fountain upper basin', (x, y, 2.1), 2.2, .35, pale, r2=2.5, verts=28)
    cyl('Fountain finial', (x, y, 2.8), .25, 1.2, gold, r2=.05)

def cypress(x, y, h=6.5):
    cyl('Tree trunk', (x, y, .8), .18, 1.6, trunk, verts=6)
    vs = []; fs = []; rings = 12; sides = 10
    for i in range(rings):
        z = 1.2 + i * h / rings; r = 1.0 * math.sin(math.pi * (i + .5) / rings) ** .7
        for j in range(sides):
            a = j * math.pi * 2 / sides; rr = r * (.85 + random.random() * .3)
            vs.append((x + rr * math.cos(a), y + rr * math.sin(a), z + (random.random() - .5) * .2))
    for i in range(rings - 1):
        for j in range(sides): fs.append((i * sides + j, i * sides + (j + 1) % sides, (i + 1) * sides + (j + 1) % sides, (i + 1) * sides + j))
    t = mesh('Sculpted cypress foliage', vs, fs, leaf)
    for p in t.data.polygons: p.use_smooth = True

# --- Palace beyond the palace sweeper ------------------------------------------------
PX, PY = LM['palace']
box('Palace podium', (PX, PY, 1), (66, 24, 2), darkstone, .12)
box('Palace forecourt', (PX, PY - 22, .08), (70, 22, .16), pale, .02)
box('Main hall', (PX, PY + 3, 9), (45, 16, 16), stone, .08)
for z in [2.1, 10.8, 17.2, 18]: box('Palace cornice', (PX, PY - 5, z), (53, 1.8, .5), pale, .05)
for x in range(-24, 25, 4):
    column(PX + x, PY - 7, 2.2, 8.4, .55)
    arch(PX + x, PY - 6.8, 2.2, 2.6, 7, .5, pale)
    box('Deep arcade', (PX + x, PY - 6.15, 5.4), (2.5, .1, 6.5), window, .02)
    box('Upper window', (PX + x, PY - 5.15, 14), (1.8, .12, 3.1), window, .04)
    arch(PX + x, PY - 5.3, 12.5, 1.8, 3.6, .35, pale)
    box('Balustrade', (PX + x, PY - 7, 11.6), (3.5, .6, .24), pale, .03)
for sd in [-1, 1]:
    x = PX + sd * 31
    box('Civic tower', (x, PY, 12), (10, 13, 24), stone, .1)
    for z in [2, 9, 19, 24]: box('Tower cornice', (x, PY, z), (11.3, 14.2, .5), pale, .05)
    for dx in [-2.8, 0, 2.8]:
        column(x + dx, PY - 6.8, 10, 8, .35)
        box('Tower window', (x + dx, PY - 6.59, 14), (1.3, .12, 5), window, .03)
    dome(x, PY, 24, 5.2, 4)
    facade_banner(x, PY - 6.62, 6.2, 7.5)
    for xx in [x - 9, x + 9]:
        cyl('Forecourt column', (xx, PY - 26, 4.5), .55, 9, pale, verts=16)
        trophy(xx, PY - 26, 9, .9)
for x in [-17, -9, 9, 17]: facade_banner(PX + x, PY - 7.25, 6.3, 5.6)
for x in [-14, 14]:
    box('Statue pedestal', (PX + x, PY - 30, 2.2), (2.4, 2.4, 4.4), pale, .05)
    statue(PX + x, PY - 30, 4.4, 1.7, None, math.pi)
dome(PX, PY + 3, 17.5, 10, 8)
text('Stadium sign', 'STADION DER EITELKEIT', (PX, PY - 7.98, 17.65), 1.1, gold)
text('Satirical subtitle', 'APPLAUS NUR MIT GENEHMIGUNG', (PX, PY - 7.98, 16.2), .48, pale)
for step in range(5): box('Palace stairs', (PX, PY - 12 + step * .7, .16 + step * .18), (49, 1.1, .32 + step * .36), pale, .03)

# --- Track-side architecture ---------------------------------------------------------
finish_gantry()
gate(LM['gateProgress'])
grandstand(4 * F, 44 * F, 1); grandstand(52 * F, 92 * F, 1); grandstand(24 * F, 70 * F, -1)
placed = 0
def reserved(s, side):
    if side > 0 and -2 * F <= s <= 96 * F: return True                  # stands
    if abs(((s - LM['gateProgress'] + L / 2) % L) - L / 2) < 13: return True
    x, y, _ = tp(s, side * (PROM + 8))
    if math.hypot(x - PX, y - PY) < 48: return True
    return any(math.hypot(x - fx, y - fy) < 16 for fx, fy in LM['fountains'])
for s in range(0, int(L), 17):
    for side in [1, -1]:
        if side < 0 and not (270 <= s <= 380): continue          # inner canyon only on the boulevard
        if reserved(s, side): continue
        if townhouse(s, side, idx=placed): placed += 1
print('townhouses', placed)

# --- Park, fountains and the monument to the unknown clerk ---------------------------
for fx, fy in LM['fountains']: fountain(fx, fy)
cx, cy = 14, 56
if clearance(cx, cy) > PROM + 4:
    box('Monument plinth', (cx, cy, 1.2), (3.2, 3.2, 2.4), pale, .05)
    box('Monument step', (cx, cy, .2), (4.6, 4.6, .4), darkstone, .03)
    cyl('Bronze stamp handle', (cx, cy, 4.6), .38, 1.6, bronze, verts=16)
    ellipsoid('Bronze stamp knob', (cx, cy, 5.6), (.62, .62, .5), bronze, segments=16)
    cyl('Bronze stamp body', (cx, cy, 3.3), 1.05, 1.1, bronze, verts=24)
    cyl('Bronze stamp pad', (cx, cy, 2.62), 1.25, .3, burgundy, verts=24)
    text('Monument plaque', 'DEM UNBEKANNTEN BEAMTEN', (cx, cy - 1.62, 1.35), .26, gold)
for s in range(int(130 * F), int(236 * F), 9):
    x, y, _ = tp(s, -(PROM + 2.2))
    if clearance(x, y) > PROM + 1.2: cypress(x, y, 6 + (s % 3))
for s in range(int(386 * F), int(470 * F), 10):
    x, y, _ = tp(s, -(PROM + 2.2))
    if clearance(x, y) > PROM + 1.2: cypress(x, y, 5.5)
for (x, y) in [(10 * F, 36 * F), (20 * F, 6 * F), (-10 * F, 6 * F), (2 * F, 64 * F), (28 * F, 54 * F)]:
    if clearance(x, y) < PROM + 4: continue
    box('Garden stone edging', (x, y, .18), (6.2, 3.2, .35), pale, .035)
    box('Garden hedge', (x, y, .46), (5.9, 2.9, .62), hedge, .2)
    for j in range(14):
        px = x + random.uniform(-2.6, 2.6); py = y + random.uniform(-1.1, 1.1)
        ellipsoid('Garden flower', (px, py, 1.0), (.14, .14, .09), flower, segments=8)
for (x, y, rot) in [(4, 30, 0), (16, 44, 1.2), (-8, 14, .4)]:
    if clearance(x, y) < PROM + 3: continue
    e = frame_at(x, y, rot, 'bench')
    box('Park bench seat', (0, 0, .58), (2.6, .65, .15), wood, .025, e)
    box('Park bench back', (0, .3, .93), (2.6, .12, .7), wood, .025, e)
    for px in [-.9, .9]: box('Bench iron foot', (px, 0, .29), (.1, .6, .58), chrome, .015, e)
    bake(e)

# --- Railway hall and distant city ring ----------------------------------------------
box('Station base', (0, -146, .32), (72, 25, .64), stone, .04)
box('Station hall walls', (0, -149, 5.2), (68, 18, 10.4), brick, .045)
for x in range(-30, 31, 5):
    box('Station facade pier', (x, -139.75, 5.2), (.9, .6, 10.4), stone, .02)
    box('Station tall glass', (x + 2.3, -139.63, 5.25), (3.6, .1, 7.4), window, .015)
box('Station stone cornice', (0, -139.5, 10.7), (71, 1.4, .65), stone, .04)
vs = []; fs = []
for j in range(17):
    a = j * math.pi / 16
    for y in [-160, -138]: vs.append((35 * math.cos(a), y, 10.9 + 11 * math.sin(a)))
for j in range(16): fs.append((j * 2, j * 2 + 1, j * 2 + 3, j * 2 + 2))
mesh('Arched station roof', vs, fs, copper)
text('Station sign', 'BAHNHOF EHRENSACHE', (0, -138.7, 11.25), .94, gold)
for k in range(44):
    a = k / 44 * math.pi * 2; rr = 150 + (k % 3) * 14
    x, y = math.cos(a) * rr * 1.0, math.sin(a) * rr * 1.12
    if clearance(x, y) < PROM + 30 or abs(x) < 40 and y < -125 or math.hypot(x - PX, y - PY) < 40: continue
    h = 12 + (k * 7) % 14; rot = a + math.pi / 2
    e = frame_at(x, y, rot, 'block')
    box('Distant city block', (0, 0, h / 2), (16, 11, h), [brick, stone, ochre][k % 3], .02, e)
    box('Distant city roof', (0, 0, h + .35), (16.5, 11.5, .7), copper, .01, e)
    for z in range(4, int(h) - 1, 3):
        for dx in [-5, -1.7, 1.7, 5]: box('Distant window', (dx, -5.56, z), (1.3, .08, 1.6), window, .005, e)
    bake(e)

merge_static('Architecture / ')
save('stadium-world')
print('WORLD_COMPLETE')
