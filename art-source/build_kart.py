"""Hero kart and neutral caricature driver for the 'Stadion der Eitelkeit' slice (quality level 2).
Run: blender --background --python art-source/build_kart.py   -> art-source/hero-kart.blend, public/assets/models/hero-kart.glb
Original geometry. Fictional characters only: no historical person, face or insignia is modelled.
Blender: X right, Y forward, Z up. Runtime contract (src/slice-scene.ts):
  wheelPivot-0..3 / wheelSpin-0..3 (FL, FR, RL, RR), steeringWheel, driverPose, headPose, scarfFlap (cape),
  kart accessories variant-radio|spare|luggage|fin|parade, character parts cast-<name>.
  Recoloured materials: 'Petrol enamel' (paint), 'Uniform racing suit', 'Cape cloth', 'Hat cloth'.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mesh_tools import *

def tube(name, points, r, m, parent=None):
    """Game-resolution swept tube (fewer segments than the shared helper)."""
    curve = bpy.data.curves.new(name, 'CURVE'); curve.dimensions = '3D'
    curve.bevel_depth = r; curve.bevel_resolution = 1; curve.resolution_u = 4
    sp = curve.splines.new('BEZIER'); sp.bezier_points.add(len(points) - 1)
    for bp, co in zip(sp.bezier_points, points): bp.co = co; bp.handle_left_type = 'AUTO'; bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(name, curve); bpy.context.collection.objects.link(o)
    o.data.materials.append(m); o.parent = parent
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.convert(target='MESH'); o.select_set(False); return o

def ellipsoid(name, pos, size, m, parent=None, segments=14):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=max(5, segments // 2), location=pos)
    o = bpy.context.object; o.scale = size
    for p in o.data.polygons: p.use_smooth = True
    o.name = name; o.data.materials.append(m); o.parent = parent; return o

def smooth(o, levels=0):
    for p in o.data.polygons: p.use_smooth = True
    if levels:
        m = o.modifiers.new('Subdivision', 'SUBSURF'); m.levels = levels; m.render_levels = levels
    return o

def ring(w, hh, zc, y, n=20, e=2.6, x0=0.0):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n; c, s = math.cos(a), math.sin(a)
        pts.append((x0 + w * math.copysign(abs(c) ** (2 / e), c), y, zc + hh * math.copysign(abs(s) ** (2 / e), s)))
    return pts

def loft(name, rings, m, parent=None, levels=1, caps=True):
    n = len(rings[0]); vs = [p for r in rings for p in r]; fs = []
    for j in range(len(rings) - 1):
        for i in range(n): fs.append((j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i))
    if caps: fs.extend([tuple(reversed(range(n))), tuple((len(rings) - 1) * n + i for i in range(n))])
    return smooth(mesh(name, vs, fs, m, parent), levels)

def lathe(name, profile, m, parent=None, n=28, levels=0):
    """Revolves (radius, x) profile points around the local X axis (wheel axle)."""
    vs = []; fs = []; k = len(profile)
    for i in range(n):
        a = 2 * math.pi * i / n
        for r, x in profile: vs.append((x, r * math.sin(a), r * math.cos(a)))
    for i in range(n):
        for j in range(k - 1):
            a, b = i * k + j, ((i + 1) % n) * k + j
            fs.append((a, b, b + 1, a + 1))
    return smooth(mesh(name, vs, fs, m, parent), levels)

def rod(name, a, b, r, m, parent=None):
    curve = bpy.data.curves.new(name, 'CURVE'); curve.dimensions = '3D'
    curve.bevel_depth = r; curve.bevel_resolution = 0; curve.resolution_u = 1
    sp = curve.splines.new('POLY'); sp.points.add(1)
    sp.points[0].co = (*a, 1); sp.points[1].co = (*b, 1)
    o = bpy.data.objects.new(name, curve); bpy.context.collection.objects.link(o)
    o.data.materials.append(m); o.parent = parent
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.convert(target='MESH'); o.select_set(False); return o

def apply_all():
    import bmesh
    for o in list(bpy.context.scene.objects):
        if o.type != 'MESH': continue
        # Generated lofts and lathes have arbitrary winding; make every shell face outward.
        bm = bmesh.new(); bm.from_mesh(o.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(o.data); bm.free()
        if not o.modifiers: continue
        bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
        for m in list(o.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)

def helix(name, base, radius, height, turns, wire, m, parent=None):
    pts = [(base[0] + radius * math.cos(t * 2 * math.pi), base[1] + radius * math.sin(t * 2 * math.pi), base[2] + height * t / turns)
           for t in [i / 8 for i in range(int(turns * 8) + 1)]]
    curve = bpy.data.curves.new(name, 'CURVE'); curve.dimensions = '3D'
    curve.bevel_depth = wire; curve.bevel_resolution = 0; curve.resolution_u = 1
    sp = curve.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for pt, co in zip(sp.points, pts): pt.co = (*co, 1)
    o = bpy.data.objects.new(name, curve); bpy.context.collection.objects.link(o)
    o.data.materials.append(m); o.parent = parent
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.convert(target='MESH'); o.select_set(False); return o

paint = teal                                     # 'Petrol enamel', recoloured per kart at runtime
trim = gold
ivory = cream
leather = black
uniform = mat('Uniform racing suit', (.8, .77, .68), 0, .78)
cape_cloth = mat('Cape cloth', (.5, .04, .06), 0, .72)
hat_cloth = mat('Hat cloth', (.12, .14, .16), 0, .7)
fur = mat('Fur trim', (.42, .36, .3), 0, .98)
white_glove = mat('White glove', (.86, .84, .78), 0, .6)
eye_white = mat('Eye white', (.92, .9, .86), 0, .35)
lips = mat('Lip rouge', (.55, .08, .1), 0, .45)
lens = mat('Sunglass lens', (.02, .025, .03), .6, .08)
medal_red = mat('Medal ribbon', (.6, .05, .08), 0, .6)
iris = mat('Eye iris', (.12, .22, .3), .1, .3)

kart = empty('hero-kart')

# --- Chassis -------------------------------------------------------------------------------------
tub = [(-1.3, .46, .17, .5), (-1.12, .55, .25, .56), (-.75, .6, .3, .6), (-.35, .6, .29, .57), (.05, .56, .26, .54),
       (.45, .5, .23, .51), (.85, .42, .2, .48), (1.18, .32, .15, .44), (1.4, .2, .09, .41)]
loft('Sculpted enamel body', [ring(w, hh, zc, y) for y, w, hh, zc in tub], paint, kart, 1)
box('Floor pan', (0, -.05, .26), (1.25, 2.75, .1), leather, .05, kart)
for sd in [-1, 1]:
    pods = [(-.55, .1, .1, .36), (-.42, .17, .16, .42), (0, .19, .17, .43), (.4, .17, .15, .42), (.55, .08, .08, .38)]
    loft('Side pod', [[(p[0] + sd * .66, p[1], p[2]) for p in ring(w, hh, zc, y, 16, 2.8)] for y, w, hh, zc in pods], paint, kart, 1)
    tube('Side pod brass trim', [(sd * .86, -.42, .5), (sd * .87, 0, .52), (sd * .85, .42, .49)], .022, trim, kart)
    for y in [-.25, -.08, .09, .26]: box('Side cooling vent', (sd * .855, y, .42), (.03, .09, .13), leather, .012, kart)
    box('Ivory pod inset', (sd * .84, 0, .36), (.04, .62, .08), ivory, .02, kart)
    # Fenders arch over the fat tyres.
    for (wy, wr, width, a0, a1) in [(.8, .36, .38, -.15, 2.2), (-.74, .43, .48, .55, 3.25)]:
        rings_ = []
        for k in range(11):
            a = a0 + (a1 - a0) * k / 10; r = wr + .1
            cy, cz = wy + r * math.cos(a), wr + r * math.sin(a)
            rings_.append([(sd * (.9 + px * width / 2), cy + math.cos(a) * pz, cz + math.sin(a) * pz) for px, pz in [(-1, 0), (1, 0), (1, .045), (-1, .045)]])
        loft('Wheel fender', rings_, paint, kart, 0)
        tube('Fender brass edge', [(sd * (.9 + width / 2 + .005), wy + (wr + .15) * math.cos(a0 + (a1 - a0) * k / 8), wr + (wr + .15) * math.sin(a0 + (a1 - a0) * k / 8)) for k in range(9)], .018, trim, kart)
    cyl('Headlamp cup', (sd * .42, 1.12, .66), .12, .16, trim, kart, 'Y')
    ellipsoid('Headlamp glass', (sd * .42, 1.205, .66), (.1, .03, .1), glow, kart)
    ellipsoid('Rear stop light', (sd * .3, -1.46, .55), (.065, .03, .065), red, kart)
    tube('Exhaust pipe', [(sd * .38, -1.0, .52), (sd * .48, -1.3, .54), (sd * .52, -1.58, .6)], .07, chrome, kart)
    cyl('Exhaust black mouth', (sd * .52, -1.6, .6), .055, .02, leather, kart, 'Y')
    tube('Front suspension arm', [(sd * .2, .78, .38), (sd * .55, .8, .36), (sd * .78, .8, .38)], .03, chrome, kart)
    helix('Suspension coil', (sd * .52, .72, .34), .055, .28, 6, .012, chrome, kart)
    cyl('Shock absorber', (sd * .52, .72, .48), .025, .34, trim, kart)
    tube('Rear axle strut', [(sd * .3, -.74, .4), (sd * .78, -.74, .4)], .04, chrome, kart)
    helix('Rear suspension coil', (sd * .45, -.92, .36), .06, .3, 6, .013, chrome, kart)
# Front wing and bumper carry the emblem forward, like a parade float.
box('Front wing', (0, 1.5, .3), (1.7, .34, .07), paint, .03, kart)
for sd in [-1, 1]:
    box('Wing end plate', (sd * .86, 1.48, .37), (.05, .42, .22), trim, .02, kart)
    tube('Bumper brass', [(sd * .82, 1.64, .3), (sd * .4, 1.7, .31), (0, 1.71, .31)], .028, trim, kart)
box('Wing ivory stripe', (0, 1.5, .34), (1.5, .3, .01), ivory, .005, kart)
for x in [-.12, -.06, 0, .06, .12]: tube('Front grille rib', [(x, 1.38, .36), (x, 1.36, .45), (x, 1.3, .52)], .011, trim, kart)
# Nose emblem: fictional laurel, crown and paragraph sign in polished brass.
cx, cy, cz = 0, 1.0, .84
torus('Nose emblem laurel ring', (cx, cy, cz), .2, .03, trim, kart, 'Y')
for k in range(14):
    a = math.pi * (.15 + .7 * k / 13)
    for sd in [-1, 1]:
        ellipsoid('Emblem laurel leaf', (cx + sd * .23 * math.cos(a), cy + .02, cz + .23 * math.sin(a) - .05), (.035, .015, .06), trim, kart, 6)
text_curve = bpy.data.curves.new('Emblem paragraph', 'FONT'); text_curve.body = '§'; text_curve.align_x = 'CENTER'; text_curve.size = .3; text_curve.extrude = .03; text_curve.resolution_u = 3
emb = bpy.data.objects.new('Emblem paragraph', text_curve); bpy.context.collection.objects.link(emb)
emb.location = (cx, cy + .02, cz - .1); emb.rotation_euler = (math.pi / 2, 0, math.pi); emb.data.materials.append(trim); emb.parent = kart
bpy.ops.object.select_all(action='DESELECT'); emb.select_set(True); bpy.context.view_layer.objects.active = emb; bpy.ops.object.convert(target='MESH')
for k, x in enumerate([-.12, 0, .12]): ellipsoid('Emblem crown point', (x, cy + .02, cz + .27 + (.05 if k == 1 else 0)), (.035, .03, .05), trim, kart, 8)
box('Emblem crown band', (0, cy + .02, cz + .23), (.3, .04, .06), trim, .01, kart)
# Rear: lacquered cowl with the brass emblem facing the chase camera, exposed twin engine below.
cowl = [(-1.0, .44, .2, .74), (-1.18, .42, .2, .72), (-1.34, .36, .17, .68), (-1.44, .26, .12, .64)]
loft('Rear cowl', [ring(w, hh, zc, y, 18, 2.4) for y, w, hh, zc in cowl], paint, kart, 1)
torus('Rear emblem laurel ring', (0, -1.47, .68), .13, .022, trim, kart, 'Y')
for k in range(10):
    a = math.pi * (.18 + .64 * k / 9)
    for sd in [-1, 1]: ellipsoid('Rear laurel leaf', (sd * .155 * math.cos(a), -1.475, .68 + .155 * math.sin(a) - .04), (.026, .012, .045), trim, kart, 6)
rear_text = bpy.data.curves.new('Rear paragraph', 'FONT'); rear_text.body = '§'; rear_text.align_x = 'CENTER'; rear_text.size = .2; rear_text.extrude = .02; rear_text.resolution_u = 3
rp = bpy.data.objects.new('Rear paragraph', rear_text); bpy.context.collection.objects.link(rp)
rp.location = (0, -1.49, .615); rp.rotation_euler = (math.pi / 2, 0, 0); rp.data.materials.append(trim); rp.parent = kart
bpy.ops.object.select_all(action='DESELECT'); rp.select_set(True); bpy.context.view_layer.objects.active = rp; bpy.ops.object.convert(target='MESH')
tube('Cowl brass seam', [(-.42, -1.02, .82), (0, -1.0, .95), (.42, -1.02, .82)], .016, trim, kart)
for sd in [-1, 1]:
    cyl('Engine cylinder', (sd * .2, -1.05, .5), .1, .26, chrome, kart, 'X')
    for j in range(4): cyl('Engine cooling fin', (sd * (.1 + j * .065), -1.05, .5), .13, .018, chrome, kart, 'X')
    cyl('Tail lamp bezel', (sd * .3, -1.43, .55), .075, .05, chrome, kart, 'Y')
cyl('Brass air intake', (0, -.98, .46), .07, .2, trim, kart, 'Y', r2=.11)
tube('Rear bumper', [(-.7, -1.5, .34), (-.4, -1.58, .32), (.4, -1.58, .32), (.7, -1.5, .34)], .04, chrome, kart)
box('Number plate', (0, -1.45, .42), (.36, .03, .16), ivory, .01, kart)
# Seat and dashboard.
box('Seat cushion', (0, -.55, .78), (.6, .62, .14), leather, .06, kart)
seat_rings = []
for k in range(5):
    seat_rings.append([(p[0] * (1 - k * .05), -.88 + p[2], .8 + k * .1) for p in ring(.36, .07, 0, 0, 16)])
loft('Seat back shell', seat_rings, leather, kart, 1)
for x in [-.18, 0, .18]: tube('Seat stitching', [(x, -.97, .86), (x, -.97, 1.0), (x, -.96, 1.16)], .008, trim, kart)
box('Dashboard', (0, .38, 1.0), (.74, .16, .2), paint, .05, kart)
for x, r in [(-.2, .06), (0, .085), (.2, .06)]:
    cyl('Gauge brass bezel', (x, .29, 1.05), r, .025, trim, kart, 'Y')
    cyl('Gauge face', (x, .275, 1.05), r * .85, .008, ivory, kart, 'Y')
    tube('Gauge needle', [(x, .264, 1.05), (x + .02, .264, 1.05 + r * .65)], .004, leather, kart)

# --- Wheels: fat balloon tyres, brass dish rims, chrome caps ------------------------------------
for i, (x, y, r) in enumerate([(-.86, .8, .36), (.86, .8, .36), (-.92, -.74, .43), (.92, -.74, .43)]):
    zoff = r - .34   # rear tyres are taller: their axle sits higher than the shared pivot height
    pivot = empty('wheelPivot-' + str(i), (x, y, .34), kart)
    spin = empty('wheelSpin-' + str(i), (0, 0, zoff), pivot)
    w = .34 if i < 2 else .44
    prof = [(r * .55, -w / 2), (r * .86, -w / 2 - .01), (r * .97, -w * .42), (r, -w * .25), (r, w * .25), (r * .97, w * .42), (r * .86, w / 2 + .01), (r * .55, w / 2)]
    lathe('Tire ' + str(i), prof, rubber, spin, 32)
    for k in range(20):
        a = k * math.pi / 10
        for sd in [-1, 1]:
            tread = box('Tire tread', (sd * w * .2, (r + .008) * math.sin(a), (r + .008) * math.cos(a)), (w * .34, .05, .02), rubber, 0, spin)
            tread.rotation_euler[0] = -a + sd * .25
    for sd in [-1, 1]:
        rim = lathe('Alloy rim', [(r * .58, sd * w * .44), (r * .5, sd * w * .5), (r * .2, sd * w * .42), (r * .12, sd * w * .52)], trim, spin, 24)
        cyl('Axle cap', (sd * w * .53, 0, 0), r * .13, .05, chrome, spin, 'X')
        for k in range(8):
            a = k * math.pi / 4
            rod('Alloy spoke', (sd * w * .47, r * .14 * math.sin(a), r * .14 * math.cos(a)), (sd * w * .45, r * .52 * math.sin(a + .25), r * .52 * math.cos(a + .25)), .016, trim, spin)

# --- Steering ------------------------------------------------------------------------------------
steering = empty('steeringWheel', (0, .2, 1.2), kart)
steering.rotation_euler[0] = math.radians(-22)
torus('Steering leather rim', (0, 0, 0), .21, .028, leather, steering, 'Y')
for a in [0, 2.1, 4.2]: tube('Steering spoke', [(0, 0, 0), (.19 * math.sin(a), 0, .19 * math.cos(a))], .016, trim, steering)
cyl('Steering boss', (0, -.01, 0), .06, .04, trim, steering, 'Y')
cyl('Steering column', (0, .14, -.12), .025, .3, chrome, steering, 'Y')

# --- Driver: big-headed neutral caricature in parade uniform --------------------------------------
driver = empty('driverPose', (0, 0, 0), kart)
torso_rings = []
for w, d, z in [(.3, .22, .86), (.36, .26, 1.0), (.4, .28, 1.18), (.44, .27, 1.38), (.38, .24, 1.5), (.16, .14, 1.58)]:
    torso_rings.append([(w * math.cos(2 * math.pi * k / 18), -.45 + d * math.sin(2 * math.pi * k / 18), z) for k in range(18)])
loft('Uniform torso', torso_rings, uniform, driver, 1)
box('Uniform belt', (0, -.24, 1.0), (.56, .08, .1), leather, .02, driver)
box('Belt buckle', (0, -.19, 1.0), (.1, .03, .09), trim, .01, driver)
tube('Parade sash', [(-.34, -.3, 1.44), (-.1, -.21, 1.25), (.18, -.22, 1.06), (.36, -.32, .95)], .05, cape_cloth, driver)
ellipsoid('Uniform belly', (0, -.3, 1.08), (.36, .26, .27), uniform, driver, 18)
for z in [1.04, 1.16, 1.28, 1.4]:
    for x in [-.1, .1]: ellipsoid('Uniform button', (x, -.07 - abs(1.08 - z) * .25, z), (.025, .015, .025), trim, driver, 8)
for row in range(3):
    for col in range(3):
        box('Medal ribbon bar', (.13 + col * .065, -.18, 1.42 - row * .045), (.06, .02, .04), [medal_red, trim, uniform][(row + col) % 3], .004, driver)
for k, x in enumerate([.14, .21, .28]):
    tube('Medal hanger', [(x, -.18, 1.29), (x, -.175, 1.22)], .012, medal_red, driver)
    cyl('Hanging medal', (x, -.17, 1.19), .032, .012, trim, driver, 'Y', verts=12)
tube('Aiguillette cord', [(-.38, -.35, 1.5), (-.3, -.2, 1.36), (-.16, -.16, 1.3), (-.1, -.17, 1.4)], .014, trim, driver)
tube('Aiguillette loop', [(-.38, -.36, 1.48), (-.32, -.24, 1.28), (-.2, -.19, 1.24), (-.1, -.17, 1.38)], .012, trim, driver)
for k, (x, z) in enumerate([(.16, 1.32), (.24, 1.3), (.2, 1.22)]):
    box('Medal ribbon', (x, -.19, z + .05), (.06, .02, .07), medal_red, .005, driver)
    cyl('Medal disc', (x, -.185, z - .02), .035, .012, trim, driver, 'Y')
for sd in [-1, 1]:
    # Epaulettes with fringe: the strongest silhouette cue from the chase camera.
    ellipsoid('Shoulder pad', (sd * .42, -.45, 1.5), (.17, .2, .1), uniform, driver, 16)
    box('Epaulette board', (sd * .44, -.45, 1.58), (.3, .34, .07), trim, .035, driver)
    for k in range(9):
        cyl('Epaulette fringe', (sd * (.6 + .012 * (k % 2)), -.61 + k * .04, 1.5), .016, .17, trim, driver, verts=6)
    # Each arm hangs from its own shoulder pivot so it can follow the wheel and celebrate.
    arm = empty('armPose-' + ('L' if sd < 0 else 'R'), (sd * .42, -.45, 1.44), driver)
    tube('Uniform arm', [(0, 0, -.02), (sd * .04, .33, -.26), (-sd * .22, .6, -.24)], .1, uniform, arm)
    tube('Gold cuff', [(-sd * .16, .53, -.24), (-sd * .2, .57, -.24)], .105, trim, arm)
    ellipsoid('Glove', (-sd * .23, .64, -.23), (.09, .1, .08), white_glove, arm)
    # Full seated legs: thigh up to a raised knee, shin down into the nose, boots on the pedals.
    tube('Uniform thigh', [(sd * .17, -.38, .9), (sd * .19, -.05, .98), (sd * .21, .2, 1.06)], .115, uniform, driver)
    ellipsoid('Uniform knee', (sd * .21, .22, 1.06), (.12, .12, .12), uniform, driver)
    tube('Uniform shin', [(sd * .21, .24, 1.04), (sd * .2, .45, .82), (sd * .19, .62, .6)], .09, uniform, driver)
    ellipsoid('Riding boot', (sd * .19, .7, .55), (.085, .16, .1), leather, driver)
    tube('Trouser stripe', [(sd * (.17 + .11), -.36, .92), (sd * (.19 + .11), -.05, 1.0), (sd * (.21 + .1), .2, 1.08), (sd * (.2 + .08), .45, .84)], .014, trim, driver)
# Cape: animated flap at the shoulders (runtime node name 'scarfFlap').
cape = empty('scarfFlap', (0, -.66, 1.56), driver)
cvs = []; cfs = []
for j in range(6):
    t = j / 5
    for k in range(7):
        u = k / 6 - .5
        cvs.append((u * (.86 + t * .45), -t * .42 - .06 - abs(u) * .08 + math.sin(u * 6 + t * 3) * .03, -t * .62 + math.cos(u * 3) * .05))
for j in range(5):
    for k in range(6): cfs.append((j * 7 + k, j * 7 + k + 1, (j + 1) * 7 + k + 1, (j + 1) * 7 + k))
cape_mesh = smooth(mesh('Flowing cape', cvs, cfs, cape_cloth, cape), 1)
sol = cape_mesh.modifiers.new('Cloth thickness', 'SOLIDIFY'); sol.thickness = .02
box('Cape gold clasp', (0, .02, .02), (.5, .05, .06), trim, .02, cape)

# Head: subdivided caricature with jowls, big nose and brow.
head = empty('headPose', (0, -.42, 1.86), driver)
hv = []; hf = []
rows = [(-.22, .1, .1, 0), (-.18, .2, .19, .02), (-.08, .27, .26, .05), (.04, .29, .27, .03), (.16, .28, .26, 0), (.27, .24, .23, 0), (.34, .15, .15, 0), (.375, .03, .03, 0)]
N = 20
for z, rx, ry, jut in rows:
    for k in range(N):
        a = 2 * math.pi * k / N
        front = max(0, math.sin(a))                         # +Y is the face
        jowl = .05 * front ** 2 if z < 0 else 0
        hv.append(((rx + jowl * .6) * math.cos(a), (ry + jowl) * math.sin(a) + jut * front, z))
for j in range(len(rows) - 1):
    for k in range(N): hf.append((j * N + k, j * N + (k + 1) % N, (j + 1) * N + (k + 1) % N, (j + 1) * N + k))
hf.append(tuple(reversed(range(N)))); hf.append(tuple((len(rows) - 1) * N + k for k in range(N)))
smooth(mesh('Driver caricature head', hv, hf, skin, head), 2)
ellipsoid('Neck', (0, -.02, -.22), (.12, .12, .14), skin, head)
ellipsoid('Nose', (0, .31, .05), (.08, .1, .085), skin, head)
ellipsoid('Nose tip', (0, .37, .02), (.055, .05, .05), skin, head)
for sd in [-1, 1]:
    ellipsoid('Ear', (sd * .29, 0, .06), (.04, .08, .1), skin, head)
    ellipsoid('Cheek', (sd * .14, .22, -.02), (.09, .07, .07), skin, head)
    ellipsoid('Eye white', (sd * .1, .245, .14), (.065, .03, .05), eye_white, head)
    ellipsoid('Eye iris', (sd * .1, .268, .132), (.032, .012, .034), iris, head, 10)
    ellipsoid('Eye pupil', (sd * .1, .276, .132), (.016, .008, .018), leather, head, 8)
    lid = ellipsoid('Heavy eyelid', (sd * .1, .25, .165), (.072, .036, .03), skin, head)
    tube('Bushy brow', [(sd * .05, .26, .2), (sd * .11, .265, .225), (sd * .17, .24, .2)], .022, hair, head)
tube('Smirk', [(-.09, .27, -.075), (0, .288, -.1), (.1, .272, -.06)], .013, lips, head)
ellipsoid('Smug teeth', (.02, .282, -.088), (.06, .012, .016), eye_white, head, 10)
box('Uniform collar', (0, -.03, -.2), (.34, .3, .1), uniform, .04, head)
for sd in [-1, 1]: box('Collar oak tab', (sd * .1, .13, -.19), (.07, .02, .06), trim, .006, head)
ellipsoid('Double chin', (0, .18, -.17), (.15, .1, .07), skin, head)
tube('Collar gold trim', [(-.17, .12, -.15), (0, .16, -.15), (.17, .12, -.15)], .014, trim, head)
for sd in [-1, 1]: ellipsoid('Short hair side', (sd * .26, -.03, .14), (.06, .16, .12), hair, head)
ellipsoid('Hair back', (0, -.1, .12), (.285, .2, .2), hair, head)
ellipsoid('Hair nape', (0, -.2, -.04), (.2, .1, .1), hair, head)

def cast(name):
    return empty('cast-' + name, (0, 0, 0), head)

c = cast('peaked')                               # military peaked cap, laurel badge
cyl('Cap crown', (0, .0, .42), .29, .24, hat_cloth, c, r2=.38, verts=28)
ellipsoid('Cap crown top', (0, .03, .54), (.38, .4, .05), hat_cloth, c, 20)
cyl('Cap band', (0, -.02, .31), .29, .07, leather, c, verts=28)
ellipsoid('Cap visor', (0, .22, .3), (.25, .14, .025), leather, c)
tube('Cap gold cord', [(-.27, .19, .33), (0, .27, .34), (.27, .19, .33)], .014, trim, c)
torus('Cap badge laurel', (0, .3, .44), .075, .014, trim, c, 'Y')
ellipsoid('Cap badge', (0, .31, .45), (.05, .014, .055), trim, c, 10)
c = cast('naval')                                # white naval cap with gold leaves
cyl('Naval cap crown', (0, -.02, .4), .32, .14, ivory, c, r2=.37, verts=28)
cyl('Naval cap band', (0, -.02, .32), .29, .08, leather, c, verts=28)
ellipsoid('Naval cap visor', (0, .23, .31), (.24, .14, .025), leather, c)
for k in range(6): ellipsoid('Visor gold leaf', (-.15 + k * .06, .3, .325), (.025, .012, .012), trim, c, 6)
ellipsoid('Naval badge', (0, .3, .4), (.05, .015, .05), trim, c, 10)
c = cast('fur')                                  # tall fur hat
smooth(cyl('Fur hat', (0, -.02, .43), .33, .3, fur, c, verts=24), 1)
ellipsoid('Fur hat badge', (0, .3, .42), (.05, .02, .055), trim, c, 10)
c = cast('crown')                                # laurel crown on curly hair
ellipsoid('Curly hair top', (0, -.04, .3), (.27, .25, .12), hair, c)
for k in range(22):
    a = 2 * math.pi * k / 22
    if math.sin(a) > .92: continue                # open above the brow
    leaf = ellipsoid('Laurel leaf', (.28 * math.cos(a), -.02 + .27 * math.sin(a), .3), (.035, .075, .022), trim, c, 6)
    leaf.rotation_euler = (.5, 0, a)
torus('Laurel band', (0, -.02, .28), .27, .02, trim, c)
c = cast('beret')                                # slanted beret
b = ellipsoid('Beret', (.04, -.02, .35), (.31, .3, .09), hat_cloth, c); b.rotation_euler[1] = .18
ellipsoid('Beret badge', (-.18, .2, .36), (.04, .015, .045), trim, c, 8)
c = cast('diva')                                 # voluminous hair, sunglasses, red lips
ellipsoid('Diva hair volume', (0, -.08, .22), (.36, .33, .26), hair, c)
for sd in [-1, 1]:
    ellipsoid('Diva hair curl', (sd * .3, -.02, -.05), (.11, .14, .2), hair, c)
    ellipsoid('Sunglass lens', (sd * .1, .27, .14), (.08, .02, .06), lens, c)
    ellipsoid('Gold earring', (sd * .3, .02, -.08), (.03, .03, .05), trim, c, 8)
box('Sunglass bridge', (0, .275, .15), (.06, .02, .02), trim, .005, c)
tube('Red lips', [(-.06, .275, -.085), (0, .285, -.09), (.06, .275, -.085)], .016, lips, c)
c = cast('moustache')                            # grand moustache
for sd in [-1, 1]: tube('Grand moustache', [(0, .31, -.02), (sd * .09, .3, -.04), (sd * .17, .27, -.01)], .03, hair, c)
c = cast('beard')                                # full dark beard
smooth(ellipsoid('Full beard', (0, .16, -.13), (.24, .16, .16), hair, c), 0)
for sd in [-1, 1]: tube('Beard moustache', [(0, .31, -.03), (sd * .1, .3, -.05)], .03, hair, c)
c = cast('glasses')                              # aviator sunglasses for the chase-view silhouette
for sd in [-1, 1]: ellipsoid('Aviator lens', (sd * .1, .275, .14), (.085, .02, .065), lens, c)
box('Aviator bridge', (0, .28, .16), (.07, .02, .015), trim, .005, c)
c = empty('cast-furcollar', (0, 0, 0), driver)
torus('Fur collar', (0, -.42, 1.56), .3, .1, fur, c)

# --- Optional neutral kart accessories (one per participant) --------------------------------------
radio = empty('variant-radio', parent=kart)
box('Receiver casing', (0, -1.3, .9), (.56, .28, .26), leather, .045, radio)
for sd in [-1, 1]:
    cyl('Brass broadcast horn', (sd * .55, -1.18, .98), .17, .36, trim, radio, 'Y', r2=.06)
tube('Receiver aerial', [(.2, -1.36, .98), (.2, -1.36, 1.6), (.3, -1.36, 1.72)], .009, chrome, radio)
spare = empty('variant-spare', parent=kart)
torus('Spare tire', (0, -1.62, .78), .25, .1, rubber, spare, 'Y')
cyl('Spare wheel hub', (0, -1.66, .78), .16, .12, trim, spare, 'Y')
luggage = empty('variant-luggage', parent=kart)
for i in range(3):
    box('Leather luggage', (0, -1.32, .84 + i * .17), (.7 - i * .08, .34, .15), leather if i % 2 else ivory, .035, luggage)
    for x in [-.22, .22]: box('Luggage brass straps', (x, -1.32, .85 + i * .17), (.026, .36, .155), trim, .006, luggage)
fin = empty('variant-fin', parent=kart)
for sd in [-1, 1]:
    tube('Tall racing exhaust', [(sd * .4, -1.1, .62), (sd * .5, -1.32, .9), (sd * .52, -1.34, 1.62)], .085, chrome, fin)
    cyl('Exhaust mouth', (sd * .52, -1.34, 1.62), .075, .06, leather, fin)
parade = empty('variant-parade', parent=kart)
for sd in [-1, 1]:
    tube('Race pennant pole', [(sd * .72, -1.0, .62), (sd * .72, -1.0, 2.05)], .018, trim, parade)
    vs = [(sd * .72 + i * .09 * -sd, -1.0 + math.sin(i) * .03, 1.75 + j * .28) for j in [0, 1] for i in range(5)]
    mesh('Neutral burgundy pennant', vs, [(i, i + 1, i + 6, i + 5) for i in range(4)], red, parade)

apply_all()
save('hero-kart')
print('KART_COMPLETE')
