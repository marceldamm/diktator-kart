"""Hero kart and neutral caricature driver for the 'Stadion der Eitelkeit' slice (quality level 2).
Run: blender --background --python art-source/build_kart.py   -> art-source/hero-kart.blend, public/assets/models/hero-kart.glb
Original geometry. Satirical caricature parts for the confirmed start roster (Hitler, Stalin, Mussolini, Mao,
Kim Jong-un, Castro): hair, moustaches, caps, pipe, cigar and regalia only; no insignia or regime symbol is modelled.
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
skin = mat('Mature skin', (.5, .35, .27), 0, .84)
cape_cloth = mat('Cape cloth', (.5, .04, .06), 0, .72)
hat_cloth = mat('Hat cloth', (.12, .14, .16), 0, .7)
fur = mat('Fur trim', (.42, .36, .3), 0, .98)
white_glove = mat('White glove', (.86, .84, .78), 0, .6)
eye_white = mat('Eye white', (.78, .74, .68), 0, .48)
mouth_inner = mat('Mouth interior', (.12, .03, .025), 0, .92)
lips = mat('Lip rouge', (.38, .13, .11), 0, .58)
lens = mat('Sunglass lens', (.02, .025, .03), .6, .08)
medal_red = mat('Medal ribbon', (.6, .05, .08), 0, .6)
iris = mat('Eye iris', (.22, .12, .055), 0, .42)

kart = empty('hero-kart')

# --- Chassis -------------------------------------------------------------------------------------
tub = [(-1.3, .46, .17, .5), (-1.12, .55, .25, .56), (-.75, .6, .3, .6), (-.35, .6, .29, .57), (.05, .56, .26, .54),
       (.45, .5, .23, .51), (.85, .42, .2, .48), (1.18, .32, .15, .44), (1.4, .2, .09, .41)]
# --- Individual body per roster member: runtime toggles 'body-<name>' (src/cast.ts 'body') -----------------
def body(name): return empty('body-' + name, (0, 0, 0), kart)
b = body('roadster')                              # Hitler: long parade roadster, tall chrome grille
loft('Sculpted enamel body', [ring(w, hh, zc, y) for y, w, hh, zc in tub], paint, b, 1)
box('Parade grille shell', (0, 1.3, .62), (.42, .1, .44), chrome, .05, b)
for x in [-.15, -.075, 0, .075, .15]: box('Parade grille bar', (x, 1.36, .62), (.022, .04, .38), trim, .006, b)
for sd in [-1, 1]: tube('Bonnet louvre line', [(sd * .3, .5, .82), (sd * .3, .9, .78), (sd * .28, 1.2, .72)], .012, trim, b)
b = body('limousine')                             # Stalin: rounded, road-going diplomatic saloon; shared kart wheelbase, not a tractor
limo = [(-1.48, .46, .19, .52), (-1.3, .53, .23, .55), (-1.05, .56, .24, .57), (-.78, .58, .23, .59), (-.48, .56, .2, .61), (-.12, .54, .18, .62), (.26, .52, .17, .62), (.62, .5, .16, .6), (.94, .46, .15, .57), (1.22, .4, .15, .54), (1.45, .28, .11, .5)]
loft('Limousine enamel body', [ring(w, hh, zc, y, 32, 2.8) for y, w, hh, zc in limo], paint, b, 2)
# Distinct long bonnet, soft fender shoulders, and a gently raised rear deck give the same kart chassis a saloon profile.
hood = [(.28, .47, .11, .72), (.56, .49, .13, .72), (.9, .45, .13, .69), (1.2, .38, .11, .63), (1.39, .26, .07, .56)]
loft('Limousine sculpted bonnet', [ring(w, hh, zc, y, 24, 2.5) for y, w, hh, zc in hood], paint, b, 2)
# A restrained, upright radiator face with rounded shell, horizontal steel vanes and two exposed lamps.
box('Limousine grille shell', (0, 1.45, .68), (.55, .07, .38), chrome, .08, b)
for z in [.53, .59, .65, .71, .77, .83]: tube('Limousine grille vane', [(-.205, 1.495, z), (0, 1.505, z), (.205, 1.495, z)], .009, trim, b)
for sd in [-1, 1]:
    cyl('Limousine headlamp housing', (sd * .43, 1.31, .82), .12, .09, chrome, b, 'Y', verts=24)
    ellipsoid('Limousine headlamp lens', (sd * .43, 1.365, .82), (.085, .025, .085), glow, b, 20)
    tube('Limousine bonnet spear', [(sd * .2, .38, .84), (sd * .34, .82, .82), (sd * .34, 1.19, .73)], .012, chrome, b)
    tube('Limousine running-board moulding', [(sd * .55, -.82, .46), (sd * .58, -.35, .47), (sd * .57, .08, .48)], .022, chrome, b)
    ellipsoid('Limousine rear lamp', (sd * .42, -1.42, .58), (.07, .05, .075), red, b, 16)
box('Limousine front bumper', (0, 1.48, .36), (1.22, .09, .075), chrome, .035, b)
box('Limousine rear bumper', (0, -1.48, .34), (1.18, .08, .07), chrome, .035, b)
box('Limousine trunk lid', (0, -1.17, .79), (.82, .36, .045), paint, .08, b)
# A distinct formal-car face: tall framed grille, hood center spine, and a stepped rear deck.
# All details follow the low road-car silhouette and leave the shared wheelbase untouched.
box('Limousine grille surround', (0, 1.505, .68), (.62, .045, .49), trim, .11, b)
box('Limousine inset grille', (0, 1.535, .68), (.49, .018, .37), black, .085, b)
for x in [-.16, -.08, 0, .08, .16]:
    tube('Limousine inset grille slat', [(x, 1.55, .51), (x, 1.555, .68), (x, 1.55, .85)], .009, chrome, b)
tube('Limousine hood centre spine', [(0, .38, .86), (0, .78, .84), (0, 1.16, .76), (0, 1.34, .68)], .018, chrome, b)
box('Limousine rear deck lip', (0, -1.43, .77), (.72, .075, .045), trim, .02, b)
b = body('racer')                                 # Mussolini: low, narrow racer with headrest fairing and tail fin
racer = [(-1.55, .12, .06, .52), (-1.3, .34, .16, .5), (-.9, .48, .22, .5), (-.4, .52, .23, .5), (.1, .5, .21, .48), (.6, .42, .18, .46), (1.05, .3, .14, .44), (1.45, .14, .08, .42)]
loft('Racer enamel body', [ring(w, hh, zc, y, 20, 2.2) for y, w, hh, zc in racer], paint, b, 1)
loft('Headrest fairing', [ring(w, hh, zc, y, 14, 2) for y, w, hh, zc in [(-1.35, .05, .05, .9), (-1.1, .14, .16, .88), (-.85, .16, .2, .86), (-.7, .1, .12, .82)]], paint, b, 1)
mesh('Tail fin', [(0, -1.45, .6), (0, -.85, .74), (0, -1.5, 1.25), (0, -1.6, 1.2)], [(0, 1, 2, 3)], paint, b)
box('Racing windscreen', (0, .32, 1.12), (.6, .03, .22), glass, .01, b)
b = body('rounded')                               # Mao: short, rounded state saloon with round lamps
rounded = [(-1.3, .5, .24, .56), (-1.0, .6, .34, .62), (-.5, .64, .38, .66), (0, .64, .36, .64), (.5, .6, .32, .6), (.95, .52, .27, .56), (1.3, .38, .18, .5)]
loft('Rounded enamel body', [ring(w, hh, zc, y, 22, 2.0) for y, w, hh, zc in rounded], paint, b, 2)
for z in [.48, .56, .64]: tube('Saloon grille bar', [(-.25, 1.4, z), (0, 1.43, z), (.25, 1.4, z)], .016, chrome, b)
b = body('rocket')                                # Kim Jong-un: propaganda rocket body with nose cone and fins
rocket = [(-1.6, .2, .2, .62), (-1.3, .42, .38, .62), (-.6, .5, .44, .64), (.2, .5, .44, .64), (.8, .44, .38, .62), (1.25, .3, .26, .6), (1.6, .08, .08, .58)]
loft('Rocket enamel body', [ring(w, hh, zc, y, 20, 2.0) for y, w, hh, zc in rocket], paint, b, 2)
for k, a in enumerate([0, 2.09, 4.19]):
    mesh('Rocket fin', [(0, -1.1, .62), (0, -1.65, .62), (.62 * math.sin(a), -1.75, .62 + .62 * math.cos(a)), (.42 * math.sin(a), -1.25, .62 + .42 * math.cos(a))], [(0, 1, 2, 3)], trim, b)
torus('Rocket nose band', (0, 1.25, .6), .3, .03, ivory, b, 'Y')
b = body('jeep')                                  # Castro: flat-sided field car with roll bar and spare wheel
box('Jeep tub', (0, -.2, .6), (1.15, 2.4, .5), paint, .06, b)
box('Jeep bonnet', (0, 1.0, .68), (1.05, .9, .1), paint, .03, b)
box('Jeep grille', (0, 1.46, .55), (.9, .06, .36), black, .02, b)
for x in [-.3, -.15, 0, .15, .3]: box('Jeep grille slot', (x, 1.5, .55), (.05, .03, .3), chrome, .005, b)
tube('Jeep roll bar', [(-.55, -.85, .82), (-.5, -.85, 1.55), (.5, -.85, 1.55), (.55, -.85, .82)], .035, chrome, b)
torus('Jeep spare wheel', (0, -1.48, .78), .26, .1, rubber, b, 'Y')
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
# Parade front (wing, brass bumper, laurel emblem) belongs to the roadster only; the other bodies show their own noses.
roadster_front = empty('roadster-front', (0, 0, 0), bpy.data.objects['body-roadster'])
# Front wing and bumper carry the emblem forward, like a parade float.
box('Front wing', (0, 1.5, .3), (1.7, .34, .07), paint, .03, roadster_front)
for sd in [-1, 1]:
    box('Wing end plate', (sd * .86, 1.48, .37), (.05, .42, .22), trim, .02, roadster_front)
    tube('Bumper brass', [(sd * .82, 1.64, .3), (sd * .4, 1.7, .31), (0, 1.71, .31)], .028, trim, roadster_front)
box('Wing ivory stripe', (0, 1.5, .34), (1.5, .3, .01), ivory, .005, roadster_front)
for x in [-.12, -.06, 0, .06, .12]: tube('Front grille rib', [(x, 1.38, .36), (x, 1.36, .45), (x, 1.3, .52)], .011, trim, roadster_front)
# Nose emblem: fictional laurel, crown and paragraph sign in polished brass.
cx, cy, cz = 0, 1.0, .84
torus('Nose emblem laurel ring', (cx, cy, cz), .2, .03, trim, roadster_front, 'Y')
for k in range(14):
    a = math.pi * (.15 + .7 * k / 13)
    for sd in [-1, 1]:
        ellipsoid('Emblem laurel leaf', (cx + sd * .23 * math.cos(a), cy + .02, cz + .23 * math.sin(a) - .05), (.035, .015, .06), trim, roadster_front, 6)
text_curve = bpy.data.curves.new('Emblem paragraph', 'FONT'); text_curve.body = '§'; text_curve.align_x = 'CENTER'; text_curve.size = .3; text_curve.extrude = .03; text_curve.resolution_u = 3
emb = bpy.data.objects.new('Emblem paragraph', text_curve); bpy.context.collection.objects.link(emb)
emb.location = (cx, cy + .02, cz - .1); emb.rotation_euler = (math.pi / 2, 0, math.pi); emb.data.materials.append(trim); emb.parent = roadster_front
bpy.ops.object.select_all(action='DESELECT'); emb.select_set(True); bpy.context.view_layer.objects.active = emb; bpy.ops.object.convert(target='MESH')
for k, x in enumerate([-.12, 0, .12]): ellipsoid('Emblem crown point', (x, cy + .02, cz + .27 + (.05 if k == 1 else 0)), (.035, .03, .05), trim, roadster_front, 8)
box('Emblem crown band', (0, cy + .02, cz + .23), (.3, .04, .06), trim, .01, roadster_front)
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
# Pedals under the boots: runtime nodes 'pedal-gas' (right) and 'pedal-brake' (left) tilt with throttle/brake.
for name, sd in [('pedal-gas', 1), ('pedal-brake', -1)]:
    p = empty(name, (sd * .19, .8, .38), kart)
    rod('Pedal arm', (0, 0, 0), (0, -.04, .2), .015, chrome, p)
    box('Pedal pad', (0, -.05, .2), (.11, .03, .14), leather, .01, p)
    box('Pedal grip plate', (0, -.067, .2), (.1, .008, .12), trim, .003, p)
# Rear-view mirrors on chrome stalks, glass facing backwards.
for sd in [-1, 1]:
    rod('Mirror stalk', (sd * .44, .52, .8), (sd * .5, .5, 1.06), .014, chrome, kart)
    cyl('Mirror housing', (sd * .51, .5, 1.1), .075, .04, chrome, kart, 'Y', verts=18)
    cyl('Mirror glass', (sd * .51, .478, 1.1), .064, .006, glass, kart, 'Y', verts=18)
# Seat and dashboard.
box('Seat cushion', (0, -.55, .78), (.6, .62, .14), leather, .06, kart)
seat_rings = []
for k in range(5):
    seat_rings.append([(p[0] * (1 - k * .05), -.88 + p[2], .8 + k * .1) for p in ring(.36, .07, 0, 0, 16)])
loft('Seat back shell', seat_rings, leather, kart, 1)
for x in [-.18, 0, .18]: tube('Seat stitching', [(x, -.97, .86), (x, -.97, 1.0), (x, -.96, 1.16)], .008, trim, kart)
box('Dashboard', (0, .5, 1.06), (.74, .14, .18), paint, .05, kart)
for x, r in [(-.2, .06), (0, .085), (.2, .06)]:
    cyl('Gauge brass bezel', (x, .42, 1.1), r, .025, trim, kart, 'Y')
    cyl('Gauge face', (x, .405, 1.1), r * .85, .008, ivory, kart, 'Y')
    tube('Gauge needle', [(x, .394, 1.1), (x + .02, .394, 1.1 + r * .65)], .004, leather, kart)

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
sash = empty('cast-sash', (0, 0, 0), driver)
tube('Parade sash', [(-.34, -.3, 1.44), (-.1, -.21, 1.25), (.18, -.22, 1.06), (.36, -.32, .95)], .05, cape_cloth, sash)
loft('Uniform waist', [ring(w, h, z, y, 18, 2.2) for y, w, h, z in [(-.5, .3, .16, 1.0), (-.36, .34, .18, 1.06), (-.24, .3, .16, 1.1)]], uniform, driver, 1)
uniform_buttons = empty('cast-uniformbuttons', (0, 0, 0), driver)
for z in [1.04, 1.16, 1.28, 1.4]:
    for x in [-.1, .1]: ellipsoid('Uniform button', (x, -.07 - abs(1.08 - z) * .25, z), (.025, .015, .025), trim, uniform_buttons, 8)
medals = empty('cast-medals', (0, 0, 0), driver)        # ribbon bar, hanging medals and aiguillette
for row in range(3):
    for col in range(3):
        box('Medal ribbon bar', (.13 + col * .065, -.18, 1.42 - row * .045), (.06, .02, .04), [medal_red, trim, uniform][(row + col) % 3], .004, medals)
for k, x in enumerate([.14, .21, .28]):
    tube('Medal hanger', [(x, -.18, 1.29), (x, -.175, 1.22)], .012, medal_red, medals)
    cyl('Hanging medal', (x, -.17, 1.19), .032, .012, trim, driver, 'Y', verts=12)
tube('Aiguillette cord', [(-.38, -.35, 1.5), (-.3, -.2, 1.36), (-.16, -.16, 1.3), (-.1, -.17, 1.4)], .014, trim, medals)
tube('Aiguillette loop', [(-.38, -.36, 1.48), (-.32, -.24, 1.28), (-.2, -.19, 1.24), (-.1, -.17, 1.38)], .012, trim, medals)
for k, (x, z) in enumerate([(.16, 1.32), (.24, 1.3), (.2, 1.22)]):
    box('Medal ribbon', (x, -.19, z + .05), (.06, .02, .07), medal_red, .005, medals)
    cyl('Medal disc', (x, -.185, z - .02), .035, .012, trim, medals, 'Y')
epaulettes = empty('cast-epaulettes', (0, 0, 0), driver)
for sd in [-1, 1]:
    # Epaulettes with fringe: the strongest silhouette cue from the chase camera (marshal-style roles only).
    loft('Shoulder', [[(sd * (.3 + .13 * t), -.45 + p[1], p[2]) for p in ring(.1 + .03 * (1 - t), .085 - .02 * t, 1.5 - .05 * t, 0, 14, 2.4)] for t in [0, .5, 1]], uniform, driver, 1)
    # Soft, fitted shoulder tabs replace the oversized gold blocks/fringe. Keep the
    # decorative edge close to the cloth so it reads as tailoring, not armour.
    ellipsoid('Padded cloth epaulette', (sd * .44, -.45, 1.575), (.115, .19, .035), uniform, epaulettes, 16)
    tube('Epaulette piping', [(sd * .35, -.59, 1.58), (sd * .44, -.62, 1.58), (sd * .53, -.59, 1.58)], .006, trim, epaulettes)
    ellipsoid('Epaulette button', (sd * .44, -.60, 1.59), (.018, .018, .012), trim, epaulettes, 10)
    # Each arm hangs from its own shoulder pivot so it can follow the wheel and celebrate.
    arm = empty('armPose-' + ('L' if sd < 0 else 'R'), (sd * .42, -.45, 1.44), driver)
    # Both forearms angle inward from the shoulder to the near-left / near-right
    # sides of the wheel. The old outward-facing endpoint placed the gloves ~0.45 m
    # beyond the rim; runtime parenting then faithfully preserved that floating pose.
    tube('Uniform arm', [(0, 0, -.02), (-sd * .05, .3, -.16), (-sd * .22, .62, -.22)], .1, uniform, arm)
    tube('Gold cuff', [(-sd * .16, .53, -.22), (-sd * .2, .58, -.23)], .085, trim, arm)
    # Gloved hand grips the rim from its outside edge. Keep the back of the palm visible
    # and separate the four tapered fingers along the wheel's tangent (Z) axis.
    # The inward-facing thumb crosses toward the hub; it must not stick up like a fifth finger.
    palm_c = (-sd * .18, .63, -.24)
    rim_c = (-sd * .2, .65, -.24)
    box('Glove palm', palm_c, (.075, .1, .12), white_glove, .03, arm)
    finger_rows = [(-.046, .039, .013), (-.016, .047, .014), (.015, .045, .014), (.043, .036, .012)]
    finger_angles = [-1.9, -1.15, -.35, .45, 1.25, 2.05]
    for dz, reach, radius in finger_rows:
        # Each digit curves around the leather cross-section, from the palm's inner/back
        # edge over the rim to the front. Different lengths keep the glove from reading
        # as four identical stacked rings.
        pts = [(rim_c[0] + reach * math.cos(a) * sd, rim_c[1] + reach * math.sin(a), rim_c[2] + dz)
               for a in finger_angles]
        tube('Glove finger', pts, radius, white_glove, arm)
    # The thumb starts at the palm's inner side, hooks across the rim toward the hub,
    # and stays close to palm height instead of protruding above the hand.
    tube('Glove thumb', [
        (rim_c[0] + sd * .024, rim_c[1] - .035, rim_c[2] + .018),
        (rim_c[0] - sd * .006, rim_c[1] - .006, rim_c[2] + .025),
        (rim_c[0] - sd * .038, rim_c[1] + .025, rim_c[2] + .005),
    ], .019, white_glove, arm)
    # Full seated legs: thigh up to a raised knee, shin down into the nose, boots on the pedals.
    # Seated legs: thigh along the cushion, knee under the dashboard, shin down to the pedal, boot sole on the pad.
    tube('Uniform thigh', [(sd * .16, -.42, .9), (sd * .18, -.1, .93), (sd * .19, .22, .98)], .11, uniform, driver)
    tube('Uniform shin', [(sd * .19, .2, .99), (sd * .19, .42, .82), (sd * .19, .62, .66)], .085, uniform, driver)
    loft('Riding boot', [[(p[0] + sd * .19, p[1], p[2]) for p in ring(w, h, zc, y, 12, 2.6)] for y, w, h, zc in
         [(.6, .055, .07, .68), (.66, .06, .06, .64), (.74, .055, .045, .62), (.82, .045, .035, .62), (.86, .03, .025, .62)]], leather, driver, 1)
    tube('Trouser stripe', [(sd * (.16 + .105), -.4, .92), (sd * (.18 + .105), -.1, .95), (sd * (.19 + .1), .2, 1.0), (sd * (.19 + .08), .42, .84)], .014, trim, driver)
# Cape: animated cloth flap at the shoulders (runtime node name 'scarfFlap').
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

# Head: subdivided caricature with jowls, big nose and brow.
# Adult caricature proportions: the jaw overlaps the neck and torso collar instead of perching above them.
head = empty('headPose', (0, -.42, 1.75), driver); head.scale = (.74, .72, .7)
hv = []; hf = []
rows = [(-.23, .065, .075, 0), (-.2, .15, .15, .01), (-.16, .21, .2, .025), (-.1, .245, .245, .045), (-.04, .27, .26, .06), (.035, .285, .27, .065), (.105, .285, .27, .055), (.17, .28, .26, .04), (.23, .26, .245, .02), (.29, .225, .215, 0), (.35, .16, .16, 0), (.385, .025, .03, 0)]
N = 32
for z, rx, ry, jut in rows:
    for k in range(N):
        a = 2 * math.pi * k / N
        front = max(0, math.sin(a))                         # +Y is the face
        jowl = .05 * front ** 2 if z < 0 else 0
        hv.append(((rx + jowl * .6) * math.cos(a), (ry + jowl) * math.sin(a) + jut * front, z))
for j in range(len(rows) - 1):
    for k in range(N): hf.append((j * N + k, j * N + (k + 1) % N, (j + 1) * N + (k + 1) % N, (j + 1) * N + k))
hf.append(tuple(reversed(range(N)))); hf.append(tuple((len(rows) - 1) * N + k for k in range(N)))
head_mesh = smooth(mesh('Driver head', hv, hf, skin, head), 2)
bpy.ops.object.select_all(action='DESELECT'); head_mesh.select_set(True); bpy.context.view_layer.objects.active = head_mesh
for m in list(head_mesh.modifiers): bpy.ops.object.modifier_apply(modifier=m.name)
def bump(x, z, cx, cz, rx, rz): return math.exp(-((x - cx) / rx) ** 2 - ((z - cz) / rz) ** 2)
for v in head_mesh.data.vertices:
    x, y, z = v.co
    if y <= 0: continue
    f = min(1, y / .2)                                                    # sculpt only the face side
    dy = (.018 * bump(x, z, 0, .19, .14, .03)                              # brow ridge
          - .03 * (bump(x, z, .095, .14, .045, .035) + bump(x, z, -.095, .14, .045, .035))  # eye sockets
          + .016 * (bump(x, z, .14, .05, .05, .05) + bump(x, z, -.14, .05, .05, .05))       # cheekbones
          - .012 * (bump(x, z, .12, -.05, .05, .05) + bump(x, z, -.12, -.05, .05, .05))     # cheek hollows
          + .022 * bump(x, z, 0, -.16, .07, .04)                          # chin
          - .008 * bump(x, z, 0, -.09, .07, .02))                         # mouth line
    dx = .01 * math.copysign(bump(abs(x), z, .2, -.1, .05, .06), x)      # jaw corners
    v.co = (x + dx * f, y + dy * f, z)

# Six separate skull/jaw sculpts share the same rig and facial feature anchors; they are not colour-swapped clones.
# Their subtle but broad volume changes make identity legible beneath each character's own hairstyle and hat.
face_variants = {}
for identity in ['hitler', 'stalin', 'mussolini', 'mao', 'kim', 'castro']:
    group = empty('cast-face-' + identity, (0, 0, 0), head)
    skull = head_mesh if identity == 'hitler' else head_mesh.copy()
    if identity != 'hitler':
        skull.data = head_mesh.data.copy(); bpy.context.collection.objects.link(skull)
    skull.name = 'Driver skull - ' + identity.title(); skull.parent = group
    face_variants[identity] = group
    for vertex in skull.data.vertices:
        x, y, z = vertex.co
        if y <= 0: continue
        lower = max(0, min(1, (-z + .12) / .3))
        cheeks = bump(abs(x), z, .17, .015, .1, .14)
        if identity == 'hitler':
            x *= 1 - .1 * lower; y += .012 * bump(x, z, 0, -.13, .08, .08)
        elif identity == 'stalin':
            # Broad temples and a heavier, squarer lower face; keep the jaw transition continuous.
            x *= 1 + .24 * lower + .055 * bump(x, z, .2, .13, .12, .12)
            y += .05 * bump(x, z, 0, -.14, .19, .105) + .018 * bump(x, z, .2, .08, .08, .09)
            z -= .025 * lower
        elif identity == 'mussolini':
            x *= 1 + .06 * lower; y += .045 * bump(x, z, 0, -.19, .095, .055); z -= .02 * bump(x, z, 0, -.18, .13, .07)
        elif identity == 'mao':
            x += math.copysign(.03 * cheeks, x); y += .035 * cheeks
        elif identity == 'kim':
            x *= 1 + .12 * lower; y += .04 * cheeks + .018 * bump(x, z, 0, -.15, .18, .09)
        elif identity == 'castro':
            x *= 1 - .035 * lower; y += .04 * bump(x, z, 0, -.19, .1, .055); z -= .035 * lower
        vertex.co = (x, y, z)

def hair_shell(name, parent, keep, thickness=.022, lift=0.0):
    # Copy of the sculpted head surface, trimmed to a hairline and pushed outward: hair hugs the skull (no helmet balls).
    import bmesh
    o = head_mesh.copy(); o.data = head_mesh.data.copy(); o.name = name; bpy.context.collection.objects.link(o); o.parent = parent
    o.data.materials.clear(); o.data.materials.append(hair)
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not keep(v.co.x, v.co.y, v.co.z)], context='VERTS')
    for v in bm.verts:
        n = v.co.copy(); n.z -= .08; n.normalize(); v.co += n * (thickness + lift * max(0, v.co.z - .2))
    bm.to_mesh(o.data); bm.free()
    sol = o.modifiers.new('Hair thickness', 'SOLIDIFY'); sol.thickness = .018; sol.offset = -1
    for p in o.data.polygons: p.use_smooth = True
    return o

def nose(name, length, width, depth, parent, droop=0):
    # Wedge-shaped nose with a narrow bridge and rounded tip (lofted, not a ball).
    rings_ = []
    for k, t in enumerate([0, .3, .6, .85, 1]):
        w = width * (.45 + .55 * t ** 1.5); d = depth * (.35 + .65 * t); zc = .14 - length * t - droop * t * t
        rings_.append([(w * math.cos(a) * (1 if math.sin(a) > -.2 else .9), .25 + d * max(.15, math.sin(a)), zc) for a in [2 * math.pi * i / 12 for i in range(12)]])
    return loft(name, rings_, skin, parent, 1)
# The neck is one tapered, softly subdivided form rather than a sphere joined to the jaw.
# Its broader base disappears into the cloth collar; the narrower upper rings tuck under
# the jaw and leave a readable throat in front and a clean nape from the chase camera.
neck_rings = []
for z, rx, ry, cy in [(-.39, .19, .145, -.035), (-.34, .175, .14, -.028),
                      (-.29, .145, .13, -.018), (-.23, .12, .12, -.012),
                      (-.17, .125, .12, -.008), (-.115, .15, .13, -.008)]:
    neck_rings.append([(rx * math.cos(2 * math.pi * k / 20), cy + ry * math.sin(2 * math.pi * k / 20), z)
                       for k in range(20)])
loft('Tapered neck and nape', neck_rings, skin, head, 2)
big_nose = empty('cast-bignose', (0, 0, 0), head)    # default bulbous caricature nose
nose('Strong nose', .15, .045, .1, big_nose, .01)
straight = empty('cast-straightnose', (0, 0, 0), head)  # narrower, straight bridge (Hitler)
nose('Straight nose', .14, .036, .085, straight)
flat = empty('cast-flatnose', (0, 0, 0), head)          # small, broad and flat (Mao, Kim)
nose('Broad flat nose', .11, .055, .06, flat)
ear_shadow = mat('Warm ear concha', (.43, .28, .23), 0, .9)
for sd in [-1, 1]:
    e = ellipsoid('Ear', (sd * .285, 0, .06), (.03, .065, .095), skin, head, 18); e.rotation_euler[2] = sd * .25
    # Add an inset concha and a raised helix so the ear reads as anatomy in profile,
    # not a flat oval attached to the side of the skull.
    ellipsoid('Ear concha', (sd * .298, .034, .065), (.009, .027, .043), ear_shadow, head, 12)
    tube('Ear helix', [(sd * .296, .045, .13), (sd * .31, .056, .105),
                       (sd * .315, .06, .065), (sd * .306, .052, .025),
                       (sd * .294, .035, .015)], .009, skin, head)
    ellipsoid('Ear lobe', (sd * .295, .02, .005), (.02, .04, .027), skin, head, 12)
    # Adult eyes: smaller, set under the brow ridge, with lids, lower lids and slight bags.
    ellipsoid('Eye white', (sd * .095, .248, .14), (.05, .026, .036), eye_white, head)
    ellipsoid('Eye iris', (sd * .095, .268, .136), (.027, .01, .027), iris, head, 12)
    ellipsoid('Eye pupil', (sd * .095, .274, .136), (.012, .006, .014), leather, head, 10)
    lid = ellipsoid('Heavy eyelid', (sd * .095, .252, .16), (.058, .032, .024), skin, head)
    ellipsoid('Lower eyelid', (sd * .095, .25, .117), (.054, .028, .014), skin, head)
    tube('Bushy brow', [(sd * .04, .265, .2), (sd * .1, .272, .215), (sd * .16, .25, .2)], .016, hair, head)
    tube('Nasolabial fold', [(sd * .065, .3, .0), (sd * .095, .285, -.06), (sd * .1, .27, -.11)], .011, skin, head)
# Mouth: real upper and lower lip with a slight self-satisfied corner, chin and philtrum.
ellipsoid('Mouth opening', (0, .294, -.09), (.055, .018, .014), mouth_inner, head, 24)
tube('Upper lip', [(-.085, .277, -.082), (-.045, .295, -.076), (0, .3, -.079), (.045, .295, -.076), (.085, .277, -.082)], .017, lips, head)
tube('Lower lip', [(-.072, .279, -.096), (0, .296, -.101), (.072, .279, -.096)], .019, lips, head)
# A soft, oval cloth collar replaces the square neck block and metallic collar cluster.
uniform_collar = empty('cast-uniformcollar', (0, 0, 0), head)
ellipsoid('Uniform collar', (0, -.035, -.205), (.19, .19, .065), uniform, uniform_collar, 20)
# Stalin-specific mature facial planes sit on the same animated head rig as the skull.
# These layered, skin-toned forms deepen the brow and cheek transitions without painted-on lines.
stalin_crease = mat('Warm skin crease', (.34, .22, .18), 0, .92)
stalin_highlight = mat('Warm skin highlight', (.58, .42, .33), 0, .82)
stalin_face = face_variants['stalin']
# Stalin's quiet, closed-collar field tunic replaces the generic parade dressing.
# These cloth-only construction lines and pockets keep the silhouette tailored without insignia.
stalin_tunic = empty('cast-stalin-tunic', (0, 0, 0), driver)
loft('Stalin stand collar', [
    ring(.158, .116, 1.535, -.445, 28, 2.5),
    ring(.15, .112, 1.585, -.445, 28, 2.5),
    ring(.145, .108, 1.655, -.445, 28, 2.5),
], uniform, stalin_tunic, 2)
stalin_stitch = mat('Muted tunic seam', (.24, .26, .22), 0, .96)
stalin_button = mat('Dark tunic buttons', (.16, .18, .15), .04, .8)
# A narrow folded placket sits on the jacket front, with inset, low-contrast buttons.
box('Stalin tunic placket', (0, -.183, 1.285), (.075, .038, .42), uniform, .024, stalin_tunic)
for z in [.12, .2, .28, .36, .44]:
    ellipsoid('Stalin tunic button', (0, -.208, .99 + z), (.012, .007, .012), stalin_button, stalin_tunic, 12)
# Simple welt pockets and double topstitching give the chest an authored garment structure.
for sd in [-1, 1]:
    box('Stalin chest pocket welt', (sd * .17, -.196, 1.36), (.112, .024, .112), uniform, .018, stalin_tunic)
    tube('Stalin pocket seam', [(sd * .223, -.211, 1.405), (sd * .17, -.213, 1.405), (sd * .117, -.211, 1.405)], .003, stalin_stitch, stalin_tunic)
    tube('Stalin shoulder seam', [(sd * .13, -.56, 1.51), (sd * .25, -.57, 1.54), (sd * .37, -.55, 1.52)], .003, stalin_stitch, stalin_tunic)
# The drooping walrus moustache covers the shared mouth anchor at portrait size.
# Give Stalin his own lower-set, open mouth so the face still reads as a person speaking.
stalin_mouth = empty('cast-stalinmouth', (0, 0, 0), stalin_face)
ellipsoid('Stalin mouth opening', (0, .305, -.143), (.078, .022, .025), mouth_inner, stalin_mouth, 24)
tube('Stalin upper lip', [(-.09, .292, -.129), (-.045, .309, -.124), (0, .313, -.127),
                          (.045, .309, -.124), (.09, .292, -.129)], .014, lips, stalin_mouth)
tube('Stalin lower lip', [(-.073, .294, -.157), (0, .31, -.164), (.073, .294, -.157)], .017, lips, stalin_mouth)
for sd in [-1, 1]:
    brow = ellipsoid('Stalin heavy brow plane', (sd * .095, .267, .205), (.083, .034, .033), skin, stalin_face, 18)
    brow.rotation_euler[1] = sd * -.12
    tube('Stalin brow furrow', [(sd * .024, .291, .245), (sd * .018, .294, .218), (sd * .028, .291, .194)], .006, stalin_crease, stalin_face)
    # A soft cheek ridge and short smile crease make the broader skull read as an adult face.
    ellipsoid('Stalin cheek plane', (sd * .166, .205, .015), (.064, .044, .072), stalin_highlight, stalin_face, 18)
    tube('Stalin nasolabial crease', [(sd * .055, .307, -.005), (sd * .092, .294, -.055), (sd * .14, .275, -.09)], .007, stalin_crease, stalin_face)
    ellipsoid('Stalin nostril shadow', (sd * .037, .324, .005), (.014, .009, .009), stalin_crease, stalin_face, 12)
    tube('Stalin under-eye fold', [(sd * .055, .265, .105), (sd * .095, .273, .094), (sd * .14, .255, .105)], .006, stalin_crease, stalin_face)
short = empty('cast-shorthair', (0, 0, 0), head)    # short back and sides, shared by most roles
hair_shell('Short back and sides', short, lambda x, y, z: z > -.06 and (y < .02 or abs(x) > .24) and not (abs(x) > .25 and z < .08 and y > -.08), .012)

def cast(name):
    return empty('cast-' + name, (0, 0, 0), head)

c = cast('peaked')                               # plain service cap; no country or political insignia
cyl('Cap crown', (0, .0, .42), .29, .24, hat_cloth, c, r2=.245, verts=28)
ellipsoid('Cap crown top', (0, .03, .54), (.255, .31, .038), hat_cloth, c, 24)
cyl('Cap band', (0, -.02, .31), .29, .07, leather, c, verts=28)
ellipsoid('Cap visor', (0, .22, .3), (.25, .14, .025), leather, c)
for sd in [-1, 1]:
    tube('Peaked cap panel seam', [(sd * .025, .02, .575), (sd * .16, .02, .53), (sd * .28, 0, .44), (sd * .29, -.01, .34)], .006, leather, c)
ellipsoid('Peaked cap top button', (0, .02, .58), (.023, .023, .012), leather, c, 12)
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
c = cast('octagonal')                            # eight-panel field cap worn by Mao in a documented 1936 portrait
cyl('Octagonal cap band', (0, -.02, .315), .29, .075, hat_cloth, c, verts=8)
cyl('Octagonal cap crown', (0, -.03, .43), .29, .22, hat_cloth, c, r2=.12, verts=8)
ellipsoid('Octagonal cap visor', (0, .18, .33), (.24, .13, .025), hat_cloth, c, 16)
ellipsoid('Octagonal cap top button', (0, -.03, .55), (.03, .03, .014), hat_cloth, c, 12)
for k in range(8):
    a = 2 * math.pi * k / 8
    x, y = .286 * math.cos(a), -.03 + .286 * math.sin(a)
    tube('Octagonal cap panel seam', [(0, -.03, .56), (x * .72, -.03 + (y + .03) * .72, .51), (x, y, .34)], .005, uniform, c)
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


# --- Historical caricature parts (confirmed start roster; recognisable silhouette cues, no insignia) ---
briar = mat('Pipe briar', (.22, .1, .04), 0, .45)
tobacco = mat('Cigar leaf', (.32, .17, .07), 0, .8)
ash = mat('Cigar ash', (.55, .53, .5), 0, .95)
mole_dark = mat('Mole', (.12, .06, .04), 0, .6)

def strand(name, path, widths, thick, m, parent, centre=(0, 0, .08), n=10):
    """Flat lock of hair/moustache along a path; the flat side hugs the head surface."""
    rings_ = []
    for i, p in enumerate(path):
        a = path[max(0, i - 1)]; b = path[min(len(path) - 1, i + 1)]
        t = [b[k] - a[k] for k in range(3)]; tl = math.sqrt(sum(v * v for v in t)) or 1; t = [v / tl for v in t]
        nrm = [p[k] - centre[k] for k in range(3)]; nl = math.sqrt(sum(v * v for v in nrm)) or 1; nrm = [v / nl for v in nrm]
        bi = [t[1] * nrm[2] - t[2] * nrm[1], t[2] * nrm[0] - t[0] * nrm[2], t[0] * nrm[1] - t[1] * nrm[0]]
        w = widths[i] if isinstance(widths, (list, tuple)) else widths
        rings_.append([tuple(p[k] + bi[k] * w * math.cos(2 * math.pi * j / n) + nrm[k] * thick * (math.sin(2 * math.pi * j / n) + .35) for k in range(3)) for j in range(n)])
    return loft(name, rings_, m, parent, 1)

c = cast('sidepart')                              # Hitler: flat dark top, left parting, forelock across the brow
hair_shell('Slick parted hair', c, lambda x, y, z: z > .2 and (y < .17 or z > .3), .024, .05)
strand('Forelock', [(-.11, .08, .375), (-.04, .19, .34), (.05, .25, .285), (.12, .275, .23), (.18, .27, .19), (.205, .25, .17)], [.04, .08, .095, .08, .05, .02], .03, hair, c)
strand('Forelock lower strand', [(-.02, .2, .33), (.07, .262, .27), (.14, .278, .215)], [.03, .045, .02], .022, hair, c)
strand('Parting edge', [(-.1, -.15, .35), (-.1, 0, .375), (-.09, .12, .37)], .012, .012, hair, c)
c = cast('toothbrush')                            # Hitler: characteristic compact, square moustache with softly clipped corners
box('Toothbrush moustache', (0, .337, -.045), (.14, .055, .052), hair, .02, c)
c = cast('swept')                                 # Stalin: thick hair brushed straight back
hair_shell('Swept-back hair', c, lambda x, y, z: z > .16 and (y < .19 or z > .29), .032, .12)
for k in range(5):
    x = -.16 + k * .08
    strand('Combed strand', [(x, .19, .35), (x * 1.05, .02, .41), (x * 1.08, -.18, .38)], .028, .012, hair, c)
c = cast('walrus')                                # Stalin: heavy drooping moustache
for sd in [-1, 1]:
    strand('Walrus moustache', [(0, .345, -.025), (sd * .07, .34, -.04), (sd * .13, .315, -.075), (sd * .16, .29, -.11)], [.045, .05, .04, .02], .03, hair, c)
c = cast('pipe')                                  # Stalin: briar pipe in the mouth corner
rod('Pipe stem', (.07, .3, -.09), (.17, .45, -.13), .014, black, c)
cyl('Pipe bowl', (.19, .47, -.09), .038, .09, briar, c, verts=14)
ellipsoid('Pipe tobacco glow', (.19, .47, -.045), (.03, .03, .008), tobacco, c, 8)
c = cast('chin')                                  # Mussolini: bald dome, jutting jaw and pout
loft('Jutting jaw', [ring(w, h, z, y, 16, 3) for y, w, h, z in [(.05, .2, .05, -.17), (.18, .17, .06, -.18), (.27, .1, .055, -.2)]], skin, c, 1)
tube('Pouting lip', [(-.07, .3, -.105), (0, .315, -.115), (.07, .3, -.105)], .02, skin, c)
c = cast('maohair')                               # Mao: high receding hairline, hair combed back, chin mole
hair_shell('Receding combed-back hair', c, lambda x, y, z: z > .12 and y < .1, .028, .06)
for sd in [-1, 1]: ellipsoid('Full side hair', (sd * .245, -.06, .2), (.075, .18, .12), hair, c, 12)
ellipsoid('Chin mole', (-.035, .295, -.16), (.018, .012, .018), mole_dark, c, 8)
c = cast('undercut')                              # Kim Jong-un: shaved sides, flat volume on top, round cheeks
hair_shell('Undercut top', c, lambda x, y, z: z > .26 and abs(x) < .2, .03, .25)
strand('Undercut fringe', [(-.16, .17, .37), (-.06, .23, .345), (.06, .255, .325), (.15, .23, .31)], [.04, .055, .05, .03], .028, hair, c)

for sd in [-1, 1]: ellipsoid('Shaved side', (sd * .272, -.04, .15), (.035, .18, .12), hat_cloth, c, 12)
c = cast('chubby')                                # round full cheeks (Kim Jong-un, Mao)
for sd in [-1, 1]: e = ellipsoid('Full cheek', (sd * .17, .17, -.05), (.07, .07, .08), skin, c); e.scale[1] = .05
c = cast('patrol')                                # Castro: flat-topped olive patrol cap and cigar
cyl('Patrol cap crown', (0, -.02, .42), .29, .2, hat_cloth, c, r2=.3, verts=28)
cyl('Patrol cap flat top', (0, -.02, .525), .305, .02, hat_cloth, c, verts=28)
ellipsoid('Patrol cap visor', (0, .23, .33), (.24, .14, .022), hat_cloth, c)
c = cast('cigar')
rod('Cigar', (-.05, .31, -.1), (-.18, .5, -.14), .022, tobacco, c)
ellipsoid('Cigar ash tip', (-.185, .51, -.142), (.024, .024, .024), ash, c, 8)

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
    # Independent heraldic eagle relief: spread wings, head/beak and tail, with no regime insignia.
    cx = sd * .54
    outline = [(-.16, .025), (-.13, .065), (-.10, .035), (-.065, .075), (-.035, .04),
               (-.012, .085), (.018, .045), (.055, .076), (.09, .04), (.14, .065),
               (.12, .012), (.075, -.008), (.03, -.02), (0, -.09), (-.025, -.02),
               (-.075, -.008), (-.13, .012)]
    for face_y, reverse in [(-1.045, False), (-.955, True)]:
        eagle_verts = [(cx + x, face_y, 1.9 + z) for x, z in outline]
        eagle_faces = [tuple(reversed(range(len(outline)))) if reverse else tuple(range(len(outline)))]
        mesh('Independent spread-wing eagle pennant relief', eagle_verts, eagle_faces, trim, parade)
    ellipsoid('Eagle head', (cx + .035, -1.045, 1.94), (.025, .012, .02), trim, parade, 10)
    tube('Eagle beak', [(cx + .045, -1.052, 1.94), (cx + .065, -1.052, 1.93)], .008, trim, parade)

apply_all()
save('hero-kart')
print('KART_COMPLETE')
