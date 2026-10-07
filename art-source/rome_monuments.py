"""Duce-Drom monument vocabulary (Claude, 07.10.2026, second pass). Executed by build_city_kit.py after
rome_kit_modules.py and sharing its Module class, materials and helpers.

The circuit is the self-built racetrack of a vain dictator: white travertine rationalism, a marble stadium
ringed by identical oversized athletes (all with the same bald head and jutting jaw), a square arcade palace
with a pompous pastiche inscription and a colossal stone head. Satire of the personality cult; no fasces,
eagles of state, real slogans or portraits. Only existing kit materials are used (small shared palette).
"""
MARBLE = LIME


def _tone(col, f):
    return tuple(c * f for c in (col if isinstance(col, tuple) else (col,) * 3))


def bald_head(M, x, y, z, s=1.0, m=None, col=1.0, chin=.35):
    """Oversized bald egg head with a jutting jaw, heavy brow and set mouth (the recurring cult motif)."""
    m = m or MARBLE
    M.sphere(m, x, y, z + .62 * s, .46 * s, .5 * s, .6 * s, 14, 9, col)                       # skull
    M.sphere(m, x, y - .12 * s, z + .18 * s, .4 * s, .42 * s, .32 * s, 12, 7, col)             # jaw block
    M.push(TR(x, y - .3 * s, z + .2 * s) @ Matrix.Rotation(math.radians(-18 - 30 * chin), 4, 'X'))
    M.sphere(m, 0, -.05 * s, 0, .3 * s, .2 * s, .2 * s, 10, 6, col)                           # protruding chin
    M.pop()
    M.boxc(m, x, y - .43 * s, z + .72 * s, .66 * s, .14 * s, .1 * s, col)                       # brow ridge
    M.sphere(m, x, y - .52 * s, z + .5 * s, .07 * s, .12 * s, .17 * s, 8, 5, col)              # nose
    for side in (-1, 1):
        M.sphere(m, x + side * .17 * s, y - .41 * s, z + .62 * s, .07 * s, .04 * s, .045 * s, 8, 5, _tone(col, .55))
        M.sphere(m, x + side * .46 * s, y, z + .55 * s, .06 * s, .12 * s, .15 * s, 8, 5, col)   # ears
    M.boxc(m, x, y - .5 * s, z + .25 * s, .3 * s, .05 * s, .03 * s, _tone(col, .6))           # set mouth


def athlete(name='kit-athlete'):
    """Oversized marble athlete on a plinth: hands on hips, chest out, the cult head (about 6 m in total)."""
    M = Module(name)
    M.boxc(MARBLE, 0, 0, 0, 2.0, 2.0, 1.4, .93)
    M.boxc(MARBLE, 0, 0, 1.4, 2.2, 2.2, .18, .97)
    z0, s = 1.58, 1.15
    for side in (-1, 1):  # legs in a wide stance
        M.push(TR(side * .32 * s, 0, z0) @ Matrix.Rotation(math.radians(side * 7), 4, 'Y'))
        M.lathe(MARBLE, 0, 0, [(.16 * s, 0), (.19 * s, .5 * s), (.2 * s, 1.0 * s), (.25 * s, 1.55 * s), (.28 * s, 1.95 * s)], 10, .98)
        M.boxc(MARBLE, 0, -.08 * s, 0, .26 * s, .5 * s, .12 * s, .95)
        M.pop()
    zt = z0 + 1.95 * s
    M.lathe(MARBLE, 0, 0, [(.42 * s, 0), (.5 * s, .35 * s), (.62 * s, .9 * s), (.66 * s, 1.15 * s), (.3 * s, 1.35 * s), (0, 1.4 * s)], 14, 1.0, zt, sy=.72)
    for side in (-1, 1):  # arms akimbo: upper arm out and down, forearm back to the hip
        M.push(TR(side * .62 * s, 0, zt + 1.1 * s) @ Matrix.Rotation(math.radians(side * 38), 4, 'Y'))
        M.cyl(MARBLE, 0, 0, -.62 * s, 0, .12 * s, .15 * s, 9)
        M.pop()
        M.push(TR(side * 1.0 * s, 0, zt + .6 * s) @ Matrix.Rotation(math.radians(-side * 62), 4, 'Y'))
        M.cyl(MARBLE, 0, 0, -.55 * s, 0, .1 * s, .12 * s, 9)
        M.sphere(MARBLE, 0, 0, -.6 * s, .12 * s, .1 * s, .1 * s, 8, 5)
        M.pop()
    M.cyl(MARBLE, 0, 0, zt + 1.35 * s, zt + 1.55 * s, .16 * s, .15 * s, 10)
    bald_head(M, 0, .02, zt + 1.5 * s, .78 * s)
    return M


def marble_terrace(name='kit-marble-terrace', width=22.0, rows=9, seed=4):
    """Stadium segment: stepped travertine terraces with spectators and a parapet; the front faces the track."""
    rnd = random.Random(seed)
    M = Module(name)
    step_h, step_d = .48, .85
    M.box(MARBLE, -width / 2, width / 2, -.4, 0, 0, 1.1, .92)
    for r in range(rows):
        z = 1.1 + r * step_h; y = r * step_d
        M.box(MARBLE, -width / 2, width / 2, y, rows * step_d + .6, 0, z + step_h, .95 - .025 * (r % 2))
    top = 1.1 + rows * step_h
    M.box(MARBLE, -width / 2, width / 2, rows * step_d + .2, rows * step_d + .7, top, top + 1.0, .9)
    for k in range(int(width / 2.2) + 1):  # plain square piers along the back, rationalist rhythm
        x = -width / 2 + k * 2.2
        M.box(MARBLE, x - .18, x + .18, rows * step_d + .2, rows * step_d + .9, 0, top + 1.0, .98)
    clothes = [(.2, .2, .22), (.85, .82, .74), (.45, .12, .14), (.24, .3, .4), (.5, .44, .3)]
    for r in range(1, rows - 1):
        z0 = 1.1 + (r + 1) * step_h; y = r * step_d + .45
        for k in range(int(width / .9)):
            if rnd.random() < .3: continue
            x = -width / 2 + .45 + k * .9 + rnd.uniform(-.1, .1); c = rnd.choice(clothes)
            M.boxc(CROWD, x, y, z0, .44, .34, .62, c)
            M.sphere(SKIN, x, y + .02, z0 + .78, .13, .14, .16, 6, 4)
            if rnd.random() < .25: M.boxc(CROWD, x + .2, y - .05, z0 + .6, .1, .1, .7, c)
    return M


def palazzo_quadrato(name='kit-quadrato'):
    """Square arcade palace: a white cube with stacked rows of identical arches and a pastiche inscription."""
    M = Module(name)
    w, h, cols, rows = 30.0, 34.0, 9, 6
    base = 3.2
    for k in range(4):  # podium steps
        M.box(MARBLE, -w / 2 - 4 + k, w / 2 + 4 - k, -4 + k, w + 4 - k, k * .5, (k + 1) * .5, .9)
    M.box(MARBLE, -w / 2, w / 2, 0, w, 2.0, base + h, .98)
    cell_w, cell_h = w / cols, (h - 5.5) / rows
    for side in range(4):
        M.push({0: TR(0, 0), 1: TR(w / 2, w / 2) @ ROT(90), 2: TR(0, w) @ ROT(180), 3: TR(-w / 2, w / 2) @ ROT(-90)}[side])
        for r in range(rows):
            z0 = base + 1.0 + r * cell_h
            for c in range(cols):
                x = -w / 2 + (c + .5) * cell_w
                M.prism_y(GLASS, -.06, .02, arch_poly(x - cell_w * .3, x + cell_w * .3, z0, z0 + cell_h - cell_w * .3 - .5, 8), (.16, .15, .14))
                M.prism_y(MARBLE, -.22, 0, [(x - cell_w * .5, z0 - .25), (x + cell_w * .5, z0 - .25), (x + cell_w * .5, z0), (x - cell_w * .5, z0)], .95)
        if side == 0:  # inscription band (lower half of the runtime inscription texture)
            v = [(-w / 2 + 1, -.08, base + h - 3.6), (w / 2 - 1, -.08, base + h - 3.6), (w / 2 - 1, -.08, base + h - .9), (-w / 2 + 1, -.08, base + h - .9)]
            M.add(INSCRIPTION, v, [(0, 1, 2, 3)], 1.0, uvfit=(0, 1, 0, .5))
        M.pop()
    M.box(MARBLE, -w / 2 - .3, w / 2 + .3, -.3, w + .3, base + h, base + h + .5, .93)
    return M


def colossal_head(name='kit-colossal-head'):
    """Plain office block wearing a colossal stone head on its facade: the face of the week."""
    M = Module(name)
    w, d, h = 22.0, 12.0, 16.0
    M.box(MARBLE, -w / 2, w / 2, 0, d, 0, h, .96)
    for f in range(4):
        for k in range(7):
            x = -w / 2 + (k + .5) * w / 7
            if abs(x) < 6 and f >= 1: continue
            M.box(GLASS, x - .45, x + .45, -.05, .02, 2.2 + f * 3.4, 4.6 + f * 3.4, (.3, .32, .34))
    M.box(MARBLE, -w / 2 - .2, w / 2 + .2, -.4, d, h, h + .6, .9)
    M.box(MARBLE, -4, 4, -3.8, 0, 0, 3.2, .9)                                                 # neck plinth
    bald_head(M, 0, -2.6, 2.4, 11.0, MARBLE, (.86, .84, .8), chin=.7)
    return M


def rational_block(name, w=18.0, d=14.0, floors=5, portico=True, seed=2):
    """Stripped-classicist travertine block: flat roof, thin cornice, tall slit windows, square-pillar portico."""
    M = Module(name)
    gf, fh = 5.0, 3.6
    h = gf + floors * fh
    M.box(PLASTER, -w / 2, w / 2, 0, d, 0, h, (1.0, .98, .94))
    M.box(MARBLE, -w / 2 - .05, w / 2 + .05, -.08, d, 0, gf, .95)
    n = max(3, int(w / 2.4))
    for f in range(floors):
        for k in range(n):
            x = -w / 2 + (k + .5) * w / n
            z = gf + f * fh + .5
            M.box(GLASS, x - .32, x + .32, -.06, .02, z, z + 2.5, (.26, .28, .3))
            M.box(MARBLE, x - .48, x + .48, -.2, 0, z - .14, z - .02, .92)
    if portico:  # square pillars in front of the ground floor
        for k in range(n + 1):
            x = -w / 2 + .35 + k * (w - .7) / n
            M.box(MARBLE, x - .3, x + .3, -2.6, -2.0, 0, gf, .98)
        M.box(MARBLE, -w / 2, w / 2, -2.8, 0, gf - .1, gf + .5, .94)
        M.box(GLASS, -w / 2 + .5, w / 2 - .5, -.06, .02, .2, gf - .4, (.22, .22, .22))
    M.box(MARBLE, -w / 2 - .2, w / 2 + .2, -.25, d + .1, h, h + .45, .93)
    if random.Random(seed).random() < .6:  # rooftop mast with a blank oxblood cloth
        M.cyl(IRON, w / 2 - 1.5, 1.0, h + .45, h + 7, .07, .05, 6)
        M.box(CLOTH, w / 2 - 1.5, w / 2 + .9, .97, 1.03, h + 5.4, h + 6.9, OXBLOOD)
    rear_facade(M, w, d, gf, floors, fh)
    return M


def rational_colonnade(name='kit-colonnade', length=26.0):
    """Long open colonnade of square travertine pillars with a plain attic (avenue backdrop)."""
    M = Module(name)
    h = 9.0
    M.box(MARBLE, -length / 2, length / 2, -.6, 3.6, 0, .4, .9)
    for k in range(14):
        x = -length / 2 + .6 + k * (length - 1.2) / 13
        for y in (0, 2.8):
            M.box(MARBLE, x - .32, x + .32, y - .32, y + .32, .4, h, .98)
    M.box(MARBLE, -length / 2, length / 2, -.5, 3.4, h, h + 1.6, .95)
    M.box(MARBLE, -length / 2 - .1, length / 2 + .1, -.6, 3.5, h + 1.6, h + 1.85, .9)
    return M


def monument_modules():
    return [
        athlete(), marble_terrace(), palazzo_quadrato(), colossal_head(),
        rational_block('kit-rational-a', 18, 14, 5), rational_block('kit-rational-b', 26, 15, 4, seed=5),
        rational_block('kit-rational-c', 12, 12, 7, portico=False, seed=8), rational_colonnade(),
    ]
