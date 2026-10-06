"""Roman modules for the Duce-Drom world (second circuit, Claude 06/07.10.2026).

Executed inside art-source/build_city_kit.py (shared Module class, materials and facade vocabulary), so the
Roman pieces land in the same city-kit.glb and are placed by src/city-world.ts with the track theme 'rome'.
Everything is original procedural geometry: ochre insulae with terracotta roofs and arched travertine
ground floors, a satirical balcony palace (empty speaker's podium, loudspeaker horns, blank cloth), a
single-bay triumphal arch with an applause inscription panel, an obelisk, umbrella pines, an aqueduct
segment and forum ruins. No fasces, eagles of state or other regime insignia.
"""

TERRACOTTA = mat('roof terracotta', hexrgb('#b9643f'), 0, .78)
BRICK, GRANITE = DARK, DARK   # shared rustica stone; brick and granite tones come from vertex colour (small palette)
BRICK_TONE, GRANITE_TONE = (.97, .72, .66), (.84, .6, .62)
INSCRIPTION = mat('inscription panel', hexrgb('#ffffff'), .1, .5)   # runtime lettering (src/city-world.ts)
PINE = LEAF

SHUTTER_GREEN, SHUTTER_BROWN, SHUTTER_OX = (.26, .38, .27), (.42, .27, .17), (.5, .2, .16)


def arched_wall(M, m, x0, x1, y0, y1, z_top, cx, half, spring, col=1.0, seg=16):
    """Solid wall [x0,x1] x [0,z_top] with one semicircular opening (centre cx, half width, spring height)."""
    arc = [(cx + half * math.cos(math.pi * k / seg), spring + half * math.sin(math.pi * k / seg)) for k in range(seg + 1)]
    # left pier, right pier, and the arch head as a notched polygon
    M.prism_y(m, y0, y1, [(x0, 0), (cx - half, 0), (cx - half, spring), (x0, spring)], col)
    M.prism_y(m, y0, y1, [(cx + half, 0), (x1, 0), (x1, spring), (cx + half, spring)], col)
    M.prism_y(m, y0, y1, [(x1, spring), (x1, z_top), (x0, z_top), (x0, spring)] + list(reversed(arc))[1:-1], col)
    # barrel soffit so the opening reads deep from below and from the side
    for k in range(seg):
        a0, a1 = math.pi * k / seg, math.pi * (k + 1) / seg
        p0 = (cx + half * math.cos(a0), spring + half * math.sin(a0)); p1 = (cx + half * math.cos(a1), spring + half * math.sin(a1))
        M.add(m, [(p0[0], y0, p0[1]), (p1[0], y0, p1[1]), (p1[0], y1, p1[1]), (p0[0], y1, p0[1])], [(0, 1, 2, 3)], tuple(c * .82 for c in col) if isinstance(col, tuple) else col * .82)


def quoins(M, x, top, w=.55):
    z, k = .6, 0
    while z < top - .4:
        h = .55
        ww = w if k % 2 == 0 else w * .65
        M.box(LIME, x - ww / 2, x + ww / 2, -.1, .3, z, z + h - .05, .95)
        z += h; k += 1


def hip_roof(M, x0, x1, top, depth, rise=2.3, eave=.75):
    """Low Roman hip roof in terracotta with a projecting eave."""
    a, b = x0 - eave, x1 + eave
    y0, y1 = -eave, depth + eave
    ridge = min(rise * 1.2, (b - a) / 2 - .5)
    v = [(a, y0, top), (b, y0, top), (b, y1, top), (a, y1, top),
         (a + ridge * 1.6, depth / 2, top + rise), (b - ridge * 1.6, depth / 2, top + rise)]
    M.add(TERRACOTTA, v, [(0, 1, 5, 4), (1, 2, 5), (2, 3, 4, 5), (3, 0, 4), (3, 2, 1, 0)], (1.0, .96, .92))
    # tile courses: thin ridges across the front slope (vertex tone stripes)
    for k in range(1, 6):
        t = k / 6
        za = top + rise * t; ya = y0 + (depth / 2 - y0) * t
        M.box(TERRACOTTA, a + ridge * 1.6 * t, b - ridge * 1.6 * t, ya - .06, ya + .06, za - .02, za + .07, .82)


def insula(name, width, axes, floors, loggia=False, arcade=True, depth=13.0, shutter=SHUTTER_GREEN):
    M = Module(name)
    gf, fh = 4.4, 3.4
    top = gf + floors * fh
    M.box(PLASTER, -width / 2, width / 2, 0, depth, 0, top, 1.0)
    M.box(LIME, -width / 2 - .05, width / 2 + .05, -.14, depth, 0, .6, .9)          # travertine plinth
    step = width / axes
    xs = [-width / 2 + step * (k + .5) for k in range(axes)]
    for k, x in enumerate(xs):
        if arcade:
            M.prism_y(LIME, -.32, 0, arch_poly(x - step * .4, x + step * .4, .6, gf - step * .4 - .35, 10), .95)
            M.prism_y(GLASS, -.36, -.03, arch_poly(x - step * .32, x + step * .32, .6, gf - step * .4 - .35, 10), (.32, .3, .27))
            if k % 2 == 1:  # shop sign over every other arch, lettering from the runtime atlas
                r = random.randrange(8); sw = min(step - .8, 3.0); z = gf - .2
                v = [(x - sw / 2, -.4, z), (x + sw / 2, -.4, z), (x + sw / 2, -.4, z + .45), (x - sw / 2, -.4, z + .45),
                     (x - sw / 2, -.33, z), (x + sw / 2, -.33, z), (x + sw / 2, -.33, z + .45), (x - sw / 2, -.33, z + .45)]
                M.add(SIGN, v, [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (2, 6, 7, 3), (0, 3, 7, 4), (1, 5, 6, 2)], 1.0, uvfit=(0, 1, 1 - (r + 1) / 8, 1 - r / 8))
        else:
            shopfront(M, x - step / 2 + .25, x + step / 2 - .25, 0, gf - .5, awning=random.choice([OXBLOOD, BOTTLE, (.75, .5, .2)]), frame=random.choice([BOTTLE, (.32, .16, .14)]))
    M.prism_x(LIME, -width / 2, width / 2, [(y * 1.2, z * 1.1 + gf - .05) for y, z in BAND], .94)
    for f in range(floors):
        z = gf + f * fh + .7
        last = f == floors - 1
        for k, x in enumerate(xs):
            if loggia and last:
                continue
            hood = 'tri' if f == 0 and k % 2 == 0 else 'cornice' if f == 0 else 'flat'
            window(M, x, z, step * .36, 2.15 if f == 0 else 1.9, hood, shutter, surround=LIME)
        if f == 0 and axes >= 3:
            mid = xs[axes // 2]
            balcony(M, mid - step * .45, mid + step * .45, gf + .55, .85)
        if not last:
            M.prism_x(LIME, -width / 2, width / 2, [(y, z0 + gf + (f + 1) * fh - .1) for y, z0 in BAND], .93)
    if loggia:  # open top-floor loggia: dark recess behind slim columns
        z = gf + (floors - 1) * fh
        M.box(GLASS, -width / 2 + .6, width / 2 - .6, -.06, .02, z + .3, z + fh - .2, (.22, .2, .18))
        for k in range(axes * 2 + 1):
            x = -width / 2 + .6 + k * (width - 1.2) / (axes * 2)
            M.cyl(LIME, x, -.25, z + .3, z + fh - .35, .16, .13, 10)
        M.box(LIME, -width / 2, width / 2, -.4, .02, z + fh - .35, z + fh - .1, .95)
        M.box(IRON, -width / 2 + .6, width / 2 - .6, -.32, -.27, z + 1.1, z + 1.16)
    for sx in (-width / 2 + .27, width / 2 - .27):
        quoins(M, sx, top)
    M.prism_x(LIME, -width / 2 - .1, width / 2 + .1, [(y * 1.7, z * 1.5 + top - .3) for y, z in CORNICE], .96)
    for k in range(int(width / .5)):
        dx = -width / 2 + .25 + k * .5
        M.box(LIME, dx - .1, dx + .1, -.55, -.08, top - .3, top - .05, .9)
    hip_roof(M, -width / 2, width / 2, top + .5, depth)
    chimney(M, width / 4, depth * .6, top + 1.4, 1.6)
    return M


def balcony_palace():
    """Hero: the 'Balkonpalast' facing the triumphal avenue. A staged empty podium for the endless speech."""
    M = Module('kit-balcony-palace')
    w, d, gf, fh, floors = 46.0, 24.0, 6.4, 5.2, 3
    top = gf + floors * fh
    M.box(PLASTER, -w / 2, w / 2, 0, d, 0, top, (1.0, .97, .9))
    rustic_floor(M, -w / 2, w / 2, gf)
    axes = 11; step = w / axes
    xs = [-w / 2 + step * (k + .5) for k in range(axes)]
    for k, x in enumerate(xs):
        if k == axes // 2:
            M.prism_y(LIME, -.45, 0, arch_poly(x - 2.0, x + 2.0, 0, 3.6), .96)
            M.prism_y(WOOD, -.3, .01, arch_poly(x - 1.6, x + 1.6, 0, 3.6, 8), (.45, .29, .2))
        else:
            M.prism_y(DARK, -.2, 0, arch_poly(x - .8, x + .8, 1.4, 3.6, 8), .8)
            M.prism_y(GLASS, -.24, -.02, arch_poly(x - .62, x + .62, 1.5, 3.6, 8), (.3, .32, .34))
    M.prism_x(LIME, -w / 2, w / 2, [(y * 1.5, z * 1.4 + gf - .1) for y, z in BAND], .95)
    for f in range(floors):
        z = gf + f * fh + 1.0
        for k, x in enumerate(xs):
            if f == 0 and k == axes // 2:
                continue
            window(M, x, z, step * .4, 2.9 if f == 0 else 2.3, 'tri' if f == 0 and k % 2 == 0 else 'seg' if f == 0 else 'cornice', None, surround=LIME)
        if f < floors - 1:
            M.prism_x(LIME, -w / 2, w / 2, [(y, z0 + gf + (f + 1) * fh - .12) for y, z0 in BAND], .94)
    # the balcony: deep stone slab, balustrade, tall arched door, empty podium and two loudspeaker horns
    bz = gf + .6; cx = 0
    M.box(LIME, cx - 5.2, cx + 5.2, -2.6, 0, bz - .45, bz, .97)
    M.prism_x(LIME, cx - 5.2, cx + 5.2, [(-2.6, bz - .45), (0, bz - .45), (0, bz - 1.6)], .9)
    for k in range(27):
        bx = cx - 5 + k * 10 / 26
        M.lathe(LIME, bx, -2.45, [(.11, 0), (.16, .25), (.09, .55), (.14, .8), (.1, 1.0)], 8, .97, bz)
    M.box(LIME, cx - 5.2, cx + 5.2, -2.6, -2.2, bz + 1.0, bz + 1.18, .95)
    M.prism_y(LIME, -.5, 0, arch_poly(cx - 1.9, cx + 1.9, bz, bz + 3.6, 10), .97)
    M.prism_y(GLASS, -.54, -.02, arch_poly(cx - 1.5, cx + 1.5, bz, bz + 3.6, 10), (.2, .22, .26))
    M.box(WOOD, cx - .7, cx + .7, -2.1, -1.3, bz, bz + 1.25, (.42, .26, .17))       # podium, nobody behind it
    M.box(GOLD, cx - .72, cx + .72, -2.14, -2.1, bz + .9, bz + 1.0)
    for side in (-1, 1):
        px = cx + side * 4.3
        M.cyl(IRON, px, -2.0, bz + 1.0, bz + 3.8, .06, seg=6)
        M.push(TR(px, -2.0, bz + 3.6) @ Matrix.Rotation(math.radians(-70), 4, 'X') @ Matrix.Rotation(math.radians(side * 18), 4, 'Z'))
        M.lathe(GOLD, 0, 0, [(.08, 0), (.12, .3), (.3, .8), (.62, 1.15), (.6, 1.2)], 14, 1.0)
        M.pop()
    # long blank cloth hanging below the balcony (runtime: fictional emblem, no regime symbol)
    M.add(BANNER, [(cx - 1.6, -2.65, bz - 7.2), (cx + 1.6, -2.65, bz - 7.2), (cx + 1.6, -2.65, bz - .5), (cx - 1.6, -2.65, bz - .5)], [(0, 1, 2, 3), (3, 2, 1, 0)], 1.0, uvfit=True)
    # crown: heavy cornice, roof balustrade, flag masts
    M.prism_x(LIME, -w / 2 - .15, w / 2 + .15, [(y * 2.0, z * 1.8 + top - .4) for y, z in CORNICE], .96)
    for k in range(int(w / .7)):
        bx = -w / 2 + .35 + k * .7
        M.lathe(LIME, bx, -.2, [(.12, 0), (.17, .3), (.1, .6), (.15, .85), (.11, 1.05)], 8, .96, top + .6)
    M.box(LIME, -w / 2, w / 2, -.4, .1, top + 1.65, top + 1.85, .95)
    M.box(TERRACOTTA, -w / 2 + .5, w / 2 - .5, .5, d - .5, top + .55, top + 1.0, .9)
    for side in (-1, 1):
        quoins(M, side * (w / 2 - .3), top, .8)
        M.cyl(IRON, side * 9, .4, top + .6, top + 9, .1, .07, 8)
        M.lathe(GOLD, side * 9, .4, [(.18, 0), (.2, .2), (0, .45)], 8, 1.0, top + 9)
    return M


def triumphal_arch():
    """Single-bay arch spanning the avenue (local X across the road, opening half width 10.4)."""
    M = Module('kit-arch')
    half, spring, x0, x1, ztop = 10.4, 9.2, -17.0, 17.0, 23.0
    arched_wall(M, LIME, x0, x1, -4.2, 4.2, ztop, 0, half, spring, .97)
    for yy in (-4.2, 4.2):  # paired detached columns on both faces
        sgn = -1 if yy < 0 else 1
        for side in (-1, 1):
            for cx in (11.8, 15.6):
                column_order(M, side * cx, yy + sgn * .75, 2.2, 14.6, .62)
                M.boxc(LIME, side * cx, yy + sgn * .75, 0, 1.9, 1.9, 2.2, .9)
        y0, y1 = yy + (-1.6 if yy < 0 else 0), yy + (0 if yy < 0 else 1.6)
        for ea, eb in ((x0 - .4, -half - .4), (half + .4, x1 + .4)):   # entablature over the column pairs only
            M.box(LIME, ea, eb, y0, y1, 16.8, 18.0, .95)
        M.prism_y(LIME, yy - (.3 if yy < 0 else -.02), yy + (.02 if yy < 0 else .3), [(-1.0, 19.1), (1.0, 19.1), (1.3, 21.3), (-1.3, 21.3)], .9)   # keystone on the crown
        for side in (-1, 1):  # relief panels above the arch, below the attic
            M.box(LIME, side * 5.3 - 2.9, side * 5.3 + 2.9, yy + (-.22 if yy < 0 else 0), yy + (0 if yy < 0 else .22), 20.3, 22.5, .8)
            for k in range(3):  # carved figures standing out of the relief panel
                fx = side * 5.3 - 1.8 + k * 1.8
                M.sphere(LIME, fx, yy + (-.3 if yy < 0 else .3), 21.4, .32, .2, .75, 8, 5, .9)
    # attic with the inscription panel (lettering is painted at runtime)
    M.box(LIME, x0 - .5, x1 + .5, -4.8, 4.8, ztop, ztop + .8, .95)
    M.box(LIME, x0 + 1, x1 - 1, -4.3, 4.3, ztop + .8, ztop + 7.0, .97)
    for yy in (-4.32, 4.3):
        v = [(-12, yy, ztop + 1.6), (12, yy, ztop + 1.6), (12, yy, ztop + 6.0), (-12, yy, ztop + 6.0)]
        M.add(INSCRIPTION, v, [(0, 1, 2, 3)] if yy < 0 else [(3, 2, 1, 0)], 1.0, uvfit=True)
        M.box(GOLD, -12.3, 12.3, yy - .06 if yy < 0 else yy, yy if yy < 0 else yy + .06, ztop + 1.4, ztop + 1.55)
    M.box(LIME, x0 + .6, x1 - .6, -4.6, 4.6, ztop + 7.0, ztop + 7.6, .95)
    statue(M, 0, 0, ztop + 7.6, 2.6)
    for side in (-1, 1):
        statue(M, side * 12, 0, ztop + 7.6, 1.8, pose='hold')
    return M


def obelisk():
    M = Module('kit-obelisk')
    M.boxc(LIME, 0, 0, 0, 6.4, 6.4, .8, .92)
    M.boxc(LIME, 0, 0, .8, 5.2, 5.2, .7, .95)
    M.boxc(DARK, 0, 0, 1.5, 4.0, 4.0, 3.6, .9)
    M.boxc(LIME, 0, 0, 5.1, 4.6, 4.6, .6, .96)
    for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):   # four small bronze crouching lions reduced to blocks
        M.sphere(GOLD, sx * 2.0, sy * 2.0, 6.1, .45, .7, .4, 8, 5)
    M.lathe(GRANITE, 0, 0, [(1.35, 0), (.95, 21.0)], 4, GRANITE_TONE, 5.7, smooth=False)
    M.lathe(GOLD, 0, 0, [(.98, 0), (0, 1.6)], 4, 1.0, 26.7, smooth=False)
    for k in range(6):  # carved bands
        z = 7.5 + k * 3.1
        r = 1.35 - (z - 5.7) / 21 * .4 + .02
        M.lathe(GRANITE, 0, 0, [(r, 0), (r, .12)], 4, tuple(c * .7 for c in GRANITE_TONE), z, smooth=False)
    return M


def umbrella_pine(name, h=12.5, lean=.12, spread=5.2, seed=3):
    rnd = random.Random(seed)
    M = Module(name, grime=False)
    x = y = 0.0; z = 0.0; segs = 6
    for k in range(segs):  # slender bare trunk with a gentle lean
        nx = x + lean * h / segs * (1 + .3 * math.sin(k)); nz = z + h / segs
        r0, r1 = .32 - k * .035, .32 - (k + 1) * .035
        M.add(BARK, *_trunk_piece(x, y, z, nx, y, nz, r0, r1), col=(.85, .78, .72))
        x, z = nx, nz
    for k in range(3):  # main boughs
        a = k / 3 * math.tau + rnd.uniform(-.3, .3)
        ex, ey = x + math.cos(a) * spread * .45, y + math.sin(a) * spread * .45
        M.add(BARK, *_trunk_piece(x, y, z - .4, ex, ey, z + 1.1, .16, .08), col=.8)
    for k in range(9):  # flat, layered parasol canopy
        a = rnd.uniform(0, math.tau); rr = rnd.uniform(0, spread * .55)
        cx, cy = x + math.cos(a) * rr, y + math.sin(a) * rr
        r = spread * rnd.uniform(.42, .6)
        shade = rnd.uniform(.82, 1.0)
        M.sphere(PINE, cx, cy, z + 1.2 + rnd.uniform(-.3, .5), r, r, r * .34, 10, 5, (shade * .78, shade * .86, shade * .68), jitter=.12)
    return M


def _trunk_piece(x0, y0, z0, x1, y1, z1, r0, r1, seg=7):
    d = Vector((x1 - x0, y1 - y0, z1 - z0)); up = d.normalized()
    side = up.cross(Vector((0, 1, 0)) if abs(up.y) < .9 else Vector((1, 0, 0))).normalized(); fwd = up.cross(side)
    v, f = [], []
    for (px, py, pz, r) in ((x0, y0, z0, r0), (x1, y1, z1, r1)):
        for k in range(seg):
            a = math.tau * k / seg
            o = side * math.cos(a) * r + fwd * math.sin(a) * r
            v.append((px + o.x, py + o.y, pz + o.z))
    for k in range(seg):
        f.append((k, (k + 1) % seg, seg + (k + 1) % seg, seg + k))
    f.append(tuple(seg + k for k in range(seg)))
    return v, f


def aqueduct():
    """24 m arcade segment of an aqueduct ruin in Roman brick with travertine imposts (local X along it)."""
    M = Module('kit-aqueduct')
    for k in range(4):
        x0 = -12 + k * 6
        arched_wall(M, BRICK, x0, x0 + 6, -1.3, 1.3, 13.2, x0 + 3, 2.1, 8.0, tuple(c * (.95 - .04 * (k % 2)) for c in BRICK_TONE), seg=10)
        M.box(LIME, x0 + .8, x0 + 1.0, -1.42, 1.42, 7.85, 8.15, .92)
        M.box(LIME, x0 + 5.0, x0 + 5.2, -1.42, 1.42, 7.85, 8.15, .92)
    M.box(LIME, -12.2, 12.2, -1.5, 1.5, 13.2, 13.8, .93)                 # cornice
    M.box(BRICK, -12, 12, -1.0, 1.0, 13.8, 15.4, tuple(c * .88 for c in BRICK_TONE))                    # water channel
    M.box(LIME, -12, 12, -1.15, 1.15, 15.4, 15.65, .9)
    for x in (-11.2, 11.2):  # broken, ragged ends
        M.box(BRICK, x - .6, x + .6, -1.0, 1.0, 15.65, 16.3, tuple(c * .8 for c in BRICK_TONE))
    return M


def forum_ruin(name='kit-ruin', seed=7):
    rnd = random.Random(seed)
    M = Module(name)
    M.box(LIME, -6.5, 6.5, -3.4, 4.2, 0, 1.2, .9)
    for k in range(3):
        M.box(LIME, -6.5 + k * .3, 6.5 - k * .3, -3.4 - (3 - k) * .45, -3.4 - (2 - k) * .45, k * .4, (k + 1) * .4, .92)
    heights = [10.5, 10.5, 7.2, 4.1]
    for k, h in enumerate(heights):
        column_order(M, -4.8 + k * 3.2, 0, 1.2, h, .62) if h > 8 else M.lathe(LIME, -4.8 + k * 3.2, 0, [(.72, 0), (.62, .3), (.56, h)], 16, .93, 1.2)
    M.box(LIME, -6.0, -.2, -.9, .9, 12.05, 13.3, .94)                    # surviving entablature over two columns
    M.prism_x(LIME, -6.0, -.2, [(y * .9, z * .8 + 13.1) for y, z in CORNICE], .95)
    for k in range(3):  # fallen drums and a capital lying in the grass
        x = rnd.uniform(-5, 5); y = rnd.uniform(2.0, 3.6)
        M.push(TR(x, y, 1.2 + .62) @ Matrix.Rotation(math.radians(90), 4, 'Y') @ ROT(rnd.uniform(0, 90)))
        M.lathe(LIME, 0, 0, [(.62, -.8), (.62, .8)], 14, .88)
        M.pop()
    return M


def rome_modules():
    return [
        insula('kit-insula-a', 14, 4, 4, arcade=True, shutter=SHUTTER_GREEN),
        insula('kit-insula-b', 10, 3, 3, loggia=True, arcade=False, shutter=SHUTTER_BROWN, depth=12),
        insula('kit-insula-c', 18, 5, 5, arcade=True, shutter=SHUTTER_OX, depth=15),
        balcony_palace(), triumphal_arch(), obelisk(), umbrella_pine('kit-pine'), umbrella_pine('kit-pine-b', 10.5, -.18, 4.4, 11),
        aqueduct(), forum_ruin(),
    ]
