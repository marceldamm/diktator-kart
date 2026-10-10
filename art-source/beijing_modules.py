"""Kulturrevolutions-Schleife (Peking) modules (Claude, 10.10.2026). Executed by build_city_kit.py after the Havana file
and sharing the Module class, materials and helpers.

Track name and place come from the planned circuit list (Sarah/Marcel); the concrete world is Claude's elaboration:
grey hutong courtyard houses with curved tile roofs and red lacquered gates, a walled palace hall on a marble terrace,
the "Tor der Planerfüllung" spanning the road, a pagoda on the skyline, loudspeaker poles, lantern garlands and a
monument to the Red Rule Book. Satire of dogma, slogans and plan statistics; no portraits, flags or real slogans.
Three new materials: glazed tile (stripes and relief from a runtime texture, colour per vertex), red lacquer and a
glowing lantern silk.
"""

GLAZE = mat('glazed tile', hexrgb('#ffffff'), 0, .42)
LACQUER = mat('lacquer', hexrgb('#ffffff'), 0, .5)
LANTERN = mat('lantern silk', hexrgb('#d8452c'), 0, .6, emit=hexrgb('#ff7040'))

TILE_GREY, TILE_YELLOW, TILE_GREEN = (.42, .44, .46), (.95, .7, .2), (.3, .55, .38)
RED, DEEP_RED, TEAL = (.62, .1, .08), (.45, .07, .06), (.16, .42, .42)


def curved_roof(M, x0, x1, y0, y1, z, h, oh=1.2, curl=.5, col=TILE_GREY, thick=.32, seg=7):
    """Concave gable roof with upturned eaves along X (front eave at y0, back eave at y1)."""
    yc, half = (y0 + y1) / 2, (y1 - y0) / 2 + oh
    left = [(yc - half * (1 - k / seg), z + h * (k / seg) ** 1.7 + curl * (1 - k / seg) ** 3) for k in range(seg + 1)]
    right = [(2 * yc - y, zz) for y, zz in reversed(left[:-1])]
    top = left + right
    poly = top + [(y, zz - thick) for y, zz in reversed(top)]
    M.prism_x(GLAZE, x0 - oh, x1 + oh, poly, col)
    M.box(GLAZE, x0 - oh - .2, x1 + oh + .2, yc - .28, yc + .28, z + h - .1, z + h + .5, tuple(c * .8 for c in col))  # ridge
    for x in (x0 - oh - .2, x1 + oh + .2):  # ridge-end ornaments
        M.prism_y(GLAZE, yc - .22, yc + .22, [(x - .35, z + h + .4), (x + .35, z + h + .4), (x + .25, z + h + 1.3), (x - .05, z + h + 1.0)], tuple(c * .75 for c in col))


def eave_ring(M, cx, cy, hx, hy, z, out=1.6, drop=1.1, col=TILE_GREY, curl=.35):
    """Four sloping eave skirts around a box (pagoda tiers, lower eave of a double roof)."""
    for sx, sy, ax in ((0, -1, 'x'), (0, 1, 'x'), (-1, 0, 'y'), (1, 0, 'y')):
        if ax == 'x':
            y_in, y_out = cy + sy * hy, cy + sy * (hy + out)
            a, b = cx - hx, cx + hx; A, B = cx - hx - out, cx + hx + out
            v = [(a, y_in, z), (b, y_in, z), (B, y_out, z - drop + curl), (A, y_out, z - drop + curl)]
        else:
            x_in, x_out = cx + sx * hx, cx + sx * (hx + out)
            a, b = cy - hy, cy + hy; A, B = cy - hy - out, cy + hy + out
            v = [(x_in, a, z), (x_in, b, z), (x_out, B, z - drop + curl), (x_out, A, z - drop + curl)]
        v2 = [(p[0], p[1], p[2] - .25) for p in v]
        M.add(GLAZE, v + v2, [(0, 1, 2, 3), (7, 6, 5, 4), (3, 2, 6, 7), (0, 4, 5, 1), (1, 5, 6, 2), (0, 3, 7, 4)], col)
    for px, py in ((-1, -1), (1, -1), (1, 1), (-1, 1)):  # upturned corner tips
        M.push(TR(cx + px * (hx + out), cy + py * (hy + out), z - drop + curl))
        M.boxc(GLAZE, 0, 0, -.1, .45, .45, .7, tuple(c * .85 for c in col))
        M.pop()


def lantern(M, x, y, z, r=.42):
    M.cyl(GOLD, x, y, z + r * 1.1, z + r * 1.3, r * .45, seg=8)
    M.sphere(LANTERN, x, y, z + r * .55, r, r, r * .7, 10, 6)
    M.cyl(GOLD, x, y, z - .05, z + .05, r * .4, seg=8)
    M.cyl(LANTERN, x, y, z - .45, z - .05, .04, seg=4)


def lattice_window(M, x, z, w, h):
    M.box(GLASS, x - w / 2, x + w / 2, -.06, .02, z, z + h, (.36, .32, .26))
    M.box(LACQUER, x - w / 2 - .12, x + w / 2 + .12, -.14, 0, z - .12, z + h + .12, DEEP_RED)
    for k in range(1, 4):
        M.box(WOOD, x - w / 2 + k * w / 4 - .03, x - w / 2 + k * w / 4 + .03, -.12, -.04, z, z + h, (.3, .14, .08))
    for k in range(1, 3):
        M.box(WOOD, x - w / 2, x + w / 2, -.12, -.04, z + k * h / 3 - .03, z + k * h / 3 + .03, (.3, .14, .08))


def hutong_house(name, width=13.0, seed=1, shop=None):
    """Single-storey courtyard house: brick plinth, plastered wall, curved grey tile roof, lacquered gate, lanterns."""
    rnd = random.Random(seed)
    M = Module(name)
    depth, wall = 11.0, 4.0
    M.box(DARK, -width / 2, width / 2, 0, depth, 0, .9, (.55, .56, .57))                     # grey brick plinth
    M.box(PLASTER, -width / 2, width / 2, 0, depth, .9, wall, 1.0)
    M.box(DARK, -width / 2 - .05, width / 2 + .05, -.06, 0, wall - .45, wall, (.5, .51, .52))  # brick frieze
    gx = rnd.choice((-1, 1)) * (width / 2 - 2.4)
    # gate: lacquered doors under a small roof, stone drums, brass studs
    M.box(LACQUER, gx - 1.15, gx + 1.15, -.12, .05, 0, 3.1, RED)
    M.box(DARK, gx - .03, gx + .03, -.16, -.1, .1, 3.0, .3)
    for k in range(3):
        for side in (-1, 1):
            for j in range(3): M.sphere(GOLD, gx + side * (.35 + j * .25), -.16, .8 + k * .7, .05, .04, .05, 6, 4)
    M.box(LACQUER, gx - 1.4, gx + 1.4, -.35, .1, 3.1, 3.45, TEAL)                            # painted beam
    curved_roof(M, gx - 1.3, gx + 1.3, -1.3, .4, 3.4, 1.0, oh=.4, curl=.25, thick=.18)
    for side in (-1, 1):
        M.cyl(DARK, gx + side * 1.55, -.45, 0, .7, .42, seg=10, col=.7)
        lantern(M, gx + side * 1.5, -.7, 2.6, .32)
    for k in range(max(1, int(width / 4.5))):
        wx = -width / 2 + 2.2 + k * 4.2
        if abs(wx - gx) > 2.4 and wx < width / 2 - 1.4: lattice_window(M, wx, 1.6, 1.8, 1.4)
    if shop is not None:  # vertical shop board, lettering from the runtime atlas row
        sx = -gx * .55
        v = [(sx - 1.6, -.4, 2.4), (sx + 1.6, -.4, 2.4), (sx + 1.6, -.4, 3.3), (sx - 1.6, -.4, 3.3),
             (sx - 1.6, -.25, 2.4), (sx + 1.6, -.25, 2.4), (sx + 1.6, -.25, 3.3), (sx - 1.6, -.25, 3.3)]
        M.add(SIGN, v, [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (2, 6, 7, 3), (0, 3, 7, 4), (1, 5, 6, 2)], 1.0, uvfit=(0, 1, 1 - (shop + 1) / 8, 1 - shop / 8))
    curved_roof(M, -width / 2, width / 2, 0, depth, wall, 2.6, oh=1.0, curl=.4)
    rear_facade(M, width, depth, 1.0, 1, 3.0, (.3, .3, .3))
    return M


def palace_hall():
    """Hall of plan fulfilment: three marble terraces, red columns, lattice doors and a double yellow roof."""
    M = Module('kit-cn-hall')
    W, D = 40.0, 18.0
    for k, (ox, oy, h) in enumerate(((4, 4, 1.2), (2.4, 2.4, 1.2), (1, 1, 1.2))):
        z0 = k * 1.2
        M.box(LIME, -W / 2 - ox, W / 2 + ox, -oy + 4, D + oy + 4, z0, z0 + h, .97 - k * .02)
        for x in [-W / 2 - ox + .5 + j * 2.0 for j in range(int((W + 2 * ox) / 2.0))]:  # balusters
            M.box(LIME, x - .12, x + .12, -oy + 4.05, -oy + 4.3, z0 + h, z0 + h + .9, .95)
        M.box(LIME, -W / 2 - ox, W / 2 + ox, -oy + 4, -oy + 4.35, z0 + h + .9, z0 + h + 1.05, .95)
    M.box(LIME, -5, 5, -1, 4, 0, 3.6, .96)                                                  # central stair ramp
    for k in range(9): M.box(LIME, -5, 5, -1 + k * .55, -.45 + k * .55, 0, .4 + k * .4, .9)
    base = 3.6; top = base + 9.0
    M.box(LACQUER, -W / 2 + 2, W / 2 - 2, 6, D + 2, base, top, RED)
    for k in range(11):  # colonnade
        x = -W / 2 + 2 + k * (W - 4) / 10
        M.cyl(LACQUER, x, 4.6, base, top, .45, seg=12, col=RED)
        M.cyl(LIME, x, 4.6, base - .05, base + .35, .65, seg=12, col=.95)
        if k < 10:
            cx = x + (W - 4) / 20
            M.box(GOLD, cx - 1.1, cx + 1.1, 5.9, 6.0, base + .4, top - 1.6)
            for j in range(5): M.box(WOOD, cx - 1.0, cx + 1.0, 5.85, 5.92, base + .9 + j * 1.3, base + 1.0 + j * 1.3, (.35, .16, .1))
    M.box(LACQUER, -W / 2 + 1.4, W / 2 - 1.4, 4, D + 2.6, top, top + 1.2, TEAL)              # painted bracket band
    for k in range(40): M.box(GOLD, -W / 2 + 1.8 + k * (W - 3.6) / 39 - .12, -W / 2 + 1.8 + k * (W - 3.6) / 39 + .12, 3.9, 4.0, top + .3, top + .9)
    eave_ring(M, 0, D / 2 + 3.6, W / 2 - .4, D / 2 + .4, top + 1.2, out=2.6, drop=1.6, col=TILE_YELLOW)
    M.box(LACQUER, -W / 2 + 5, W / 2 - 5, 7, D, top + 1.2, top + 4.2, RED)
    curved_roof(M, -W / 2 + 5, W / 2 - 5, 6.2, D + .8, top + 4.2, 6.5, oh=2.4, curl=.8, col=TILE_YELLOW, thick=.5)
    # gold title board on the upper storey: an original pastiche, lettering from the sign atlas row 0
    v = [(-4, 6.6, top + 1.6), (4, 6.6, top + 1.6), (4, 6.6, top + 3.8), (-4, 6.6, top + 3.8),
         (-4, 6.9, top + 1.6), (4, 6.9, top + 1.6), (4, 6.9, top + 3.8), (-4, 6.9, top + 3.8)]
    M.add(SIGN, v, [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (2, 6, 7, 3), (0, 3, 7, 4), (1, 5, 6, 2)], 1.0, uvfit=(0, 1, 7 / 8, 1))
    for x in (-8, 8):  # bronze cauldrons and lanterns on the terrace
        M.lathe(ZINC, x, 1.5, [(.0, 0), (1.1, .2), (1.3, 1.0), (1.1, 1.6), (1.2, 1.7)], 14, (.6, .5, .35), 3.6)
        lantern(M, x * 1.8, 2.0, 3.6 + 2.8, .5)
        M.cyl(LACQUER, x * 1.8, 2.0, 3.6, 3.6 + 2.6, .1, seg=6, col=DEEP_RED)
    return M


def plan_gate():
    """Tor der Planerfüllung: red gate wall straddling the road (opening ±9.6 m like kit-gate) with a hall on top."""
    M = Module('kit-cn-gate')
    half, D, H = 26.0, 12.0, 11.0
    arc = [(9.6 * math.cos(math.pi * k / 16), 6.6 + 4.6 * math.sin(math.pi * k / 16)) for k in range(17)]
    for side in (-1, 1):
        x0, x1 = sorted((side * 9.6, side * half))
        M.box(LACQUER, x0, x1, -D / 2, D / 2, 0, H, RED)
        M.box(LIME, x0, x1, -D / 2 - .1, D / 2 + .1, 0, 1.2, .92)                              # marble plinth
        M.push(TR((x0 + x1) / 2, -D / 2))
        M.prism_y(LACQUER, -.12, 0, arch_poly(-2.4, 2.4, 1.2, 5.6, 10), DEEP_RED)              # blind side arch
        M.pop()
    M.prism_y(LACQUER, -D / 2, D / 2, [(9.7, 6.6), (9.7, H), (-9.7, H), (-9.7, 6.6)] + list(reversed(arc))[1:-1], RED)
    M.box(LIME, -half - .3, half + .3, -D / 2 - .3, D / 2 + .3, H, H + .8, .95)               # parapet
    for k in range(52): M.box(LACQUER, -half + .3 + k * (2 * half - .6) / 51 - .3, -half + .3 + k * (2 * half - .6) / 51 + .3, -D / 2 - .25, -D / 2 + .25, H + .8, H + 1.8, RED)
    base = H + .8; top = base + 7.0
    M.box(LACQUER, -18, 18, -3.5, 3.5, base, top, RED)
    for k in range(9):
        x = -18 + k * 4.5
        for y in (-4.6, 4.6): M.cyl(LACQUER, x, y, base, top, .4, seg=10, col=RED)
        if k < 8:
            for y in (-3.55, 3.55):
                M.box(GOLD, x + .9, x + 3.6, y - .05, y + .05, base + .6, top - 1.4)
    M.box(LACQUER, -19, 19, -5.2, 5.2, top, top + 1.0, TEAL)
    eave_ring(M, 0, 0, 19, 5.2, top + 1.0, out=2.4, drop=1.5, col=TILE_YELLOW)
    M.box(LACQUER, -14, 14, -3.2, 3.2, top + 1.0, top + 3.6, RED)
    curved_roof(M, -14, 14, -4.4, 4.4, top + 3.6, 5.6, oh=2.4, curl=.8, col=TILE_YELLOW, thick=.5)
    # front title board above the arch (sign atlas row 1) and lanterns
    for y, flip in ((-D / 2 - .35, 0), (D / 2 + .05, 1)):
        v = [(-6, y, 8.8), (6, y, 8.8), (6, y, 10.6), (-6, y, 10.6), (-6, y + .3, 8.8), (6, y + .3, 8.8), (6, y + .3, 10.6), (-6, y + .3, 10.6)]
        M.add(SIGN, v, [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (2, 6, 7, 3), (0, 3, 7, 4), (1, 5, 6, 2)], 1.0, uvfit=(0, 1, 6 / 8, 7 / 8))
    for x in (-12, -6, 6, 12):
        for y in (-5.2, 5.2): lantern(M, x, y, top - .4, .6)
    return M


def pagoda():
    M = Module('kit-pagoda')
    M.box(LIME, -7, 7, -7, 7, 0, 1.6, .94)
    z, hx = 1.6, 5.0
    for tier in range(7):
        h = 4.2 if tier == 0 else 3.0
        M.box(LACQUER, -hx, hx, -hx, hx, z, z + h, RED if tier % 2 == 0 else DEEP_RED)
        for k in (-1, 1):
            M.box(GOLD, -hx * .35, hx * .35, k * hx - .05 * k, k * hx + .02 * k, z + .8, z + h - .7)
        eave_ring(M, 0, 0, hx, hx, z + h, out=1.8 - tier * .1, drop=1.5, col=TILE_GREEN)
        z += h; hx *= .88
    M.lathe(GOLD, 0, 0, [(1.2, 0), (.9, .8), (.5, 1.0), (.5, 2.0), (.8, 2.2), (.3, 2.6), (.3, 5.5), (0, 7.0)], 10, 1.0, z - .2)
    return M


def palace_wall():
    M = Module('kit-cn-wall')
    M.box(LACQUER, -12, 12, 0, 2.4, 0, 7.0, RED)
    M.box(LIME, -12, 12, -.05, 2.45, 0, .8, .9)
    curved_roof(M, -12, 12, 0, 2.4, 7.0, 1.0, oh=.5, curl=.2, col=TILE_YELLOW, thick=.25)
    return M


def loudspeaker_pole():
    M = Module('kit-loudspeaker', grime=False)
    M.cyl(IRON, 0, 0, 0, 7.4, .12, .08, 8, (.45, .45, .42))
    for k, a in enumerate((0, 120, 240)):
        M.push(TR(0, 0, 6.6 + k * .25) @ ROT(a) @ Matrix.Rotation(math.radians(-80), 4, 'X'))
        M.lathe(ZINC, 0, 0, [(.08, 0), (.12, .2), (.35, .8), (.42, .85)], 10, (.7, .72, .7), 0, smooth=True)
        M.pop()
    M.box(LACQUER, -.04, .04, -.6, .0, 3.0, 5.6, RED)                                      # slogan strip
    return M


def rulebook_monument():
    """Denkmal des Roten Regelhefts: giant open rule book on a marble plinth (Mao's projectile, writ large)."""
    M = Module('kit-rulebook')
    M.box(LIME, -6, 6, -4, 4, 0, 1.0, .9); M.box(LIME, -4.5, 4.5, -3, 3, 1.0, 3.6, .95)
    M.box(GOLD, -4.6, 4.6, -3.05, -2.95, 2.4, 3.0)
    for side in (-1, 1):  # two covers, opened in a shallow V towards the street
        M.push(TR(0, 0, 3.6) @ ROT(side * 18))
        M.box(CLOTH, 0 if side > 0 else -5.2, 5.2 if side > 0 else 0, -.6, .2, 0, 7.2, RED)
        M.box(FRAME, (.2 if side > 0 else -5.0), (5.0 if side > 0 else -.2), -.75, -.6, .3, 6.9, (.96, .93, .84))  # pages
        for k in range(6):
            M.box(DARK, (.8 if side > 0 else -4.4), (4.4 if side > 0 else -.8), -.77, -.75, 1.2 + k * .9, 1.35 + k * .9, (.25, .2, .2))
        M.pop()
    M.box(GOLD, -.25, .25, -.8, .3, 3.6, 10.8)                                              # spine
    return M


def lantern_span():
    """Lantern garland across the road between two red poles (span ±9.2 m, origin on the road centre)."""
    M = Module('kit-lantern-span', grime=False)
    for side in (-1, 1):
        M.cyl(LACQUER, side * 9.2, 0, 0, 7.6, .16, .12, 10, RED)
        M.sphere(GOLD, side * 9.2, 0, 7.7, .22, .22, .22, 8, 5)
    n = 11
    for k in range(n):
        t = (k + .5) / n; x = -9.2 + t * 18.4; z = 7.3 - 1.4 * math.sin(math.pi * t)
        M.box(IRON, x - .84, x + .84, -.02, .02, z + .02 + .1 * math.cos(math.pi * t), z + .06 + .1 * math.cos(math.pi * t), .2)
        lantern(M, x, 0, z - .9, .36)
    return M


def beijing_modules():
    return [
        hutong_house('kit-cn-house-a', 13.0, 11, shop=None), hutong_house('kit-cn-house-b', 15.0, 12, shop=2),
        hutong_house('kit-cn-house-c', 11.0, 13, shop=5), palace_hall(), plan_gate(), pagoda(), palace_wall(),
        loudspeaker_pole(), rulebook_monument(), lantern_span(),
    ]
