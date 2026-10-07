"""Havanna-Revolutionsring modules (Claude, 07.10.2026). Executed by build_city_kit.py after the Roman files and
sharing the Module class, materials and facade vocabulary (no new materials: the kit palette stays small).

Sarah's track name and place; the concrete world is Claude's elaboration: pastel colonial arcade houses with
flat roofs and iron balconies, royal palms, 1950s-style street cruisers that never got spare parts, a harbour
fortress lighthouse, a speaker's tribune with an endless microphone, and a ministry wearing a colossal
wire-sculpture beard with a cigar. Satire of the endless-speech cult; no flags, portraits or real slogans.
"""


def colonial_house(name, width=12.0, floors=2, seed=1):
    rnd = random.Random(seed)
    M = Module(name)
    gf, fh = 4.8, 4.0
    top = gf + floors * fh
    depth = 12.0
    M.box(PLASTER, -width / 2, width / 2, 0, depth, 0, top, 1.0)
    axes = max(3, int(width / 3.6)); step = width / axes
    for k in range(axes):  # arcade portal on slim columns in front of the ground floor
        x = -width / 2 + (k + .5) * step
        M.prism_y(LIME, -2.6, -2.2, [(x - step / 2, gf - .2), (x + step / 2, gf - .2), (x + step / 2, gf + .5), (x - step / 2, gf + .5)], .95)
        M.prism_y(GLASS, -.06, .02, arch_poly(x - step * .32, x + step * .32, 0, gf - step * .32 - .6, 8), (.3, .26, .22))
    for k in range(axes + 1):
        x = -width / 2 + k * step
        M.cyl(LIME, x, -2.4, 0, gf - .2, .2, .17, 10)
    M.box(PLASTER, -width / 2, width / 2, -2.6, 0, gf + .5, gf + .7, .96)                      # arcade roof slab
    shutter = rnd.choice([(.2, .45, .45), (.5, .3, .18), (.25, .35, .55), (.55, .55, .5)])
    for f in range(floors):
        z = gf + f * fh + .7
        for k in range(axes):
            x = -width / 2 + (k + .5) * step
            M.box(GLASS, x - .55, x + .55, -.05, .02, z, z + 2.8, (.24, .22, .2))           # tall French doors
            for side in (-1, 1): M.box(WOOD, x + side * .78 - .22, x + side * .78 + .22, -.12, -.02, z, z + 2.8, shutter)
            M.box(LIME, x - .8, x + .8, -.16, 0, z + 2.8, z + 3.05, .95)
            if f >= 0: balcony(M, x - .9, x + .9, z, .7)
    M.prism_x(LIME, -width / 2 - .1, width / 2 + .1, [(y * 1.2, zz * 1.1 + top - .2) for y, zz in CORNICE], .95)
    for k in range(int(width / .55)):  # roof balustrade
        bx = -width / 2 + .27 + k * .55
        M.lathe(LIME, bx, -.1, [(.09, 0), (.13, .22), (.07, .45), (.11, .65), (.08, .8)], 8, .96, top + .5)
    M.box(LIME, -width / 2, width / 2, -.25, .1, top + 1.3, top + 1.45, .94)
    # weathered patches: the city has not been repainted since the last five-year plan
    for k in range(4):
        px = rnd.uniform(-width / 2 + 1, width / 2 - 2); pz = rnd.uniform(gf + .5, top - 2)
        M.box(PLASTER, px, px + rnd.uniform(1, 2.6), -.07, -.01, pz, pz + rnd.uniform(.6, 1.6), (.78, .76, .72))
    return M


def royal_palm(name='kit-palm', h=13.0, seed=5):
    rnd = random.Random(seed)
    M = Module(name, grime=False)
    M.lathe(BARK, 0, 0, [(.34, 0), (.28, .6), (.24, h * .45), (.27, h * .7), (.22, h * .92), (.2, h)], 10, (.82, .8, .76))
    M.lathe(LEAF, 0, 0, [(.24, 0), (.3, 1.4), (.2, 1.8)], 8, (.5, .62, .38), h - .2)     # green crownshaft
    top = h + 1.6
    for k in range(11):  # arching fronds
        a = k / 11 * math.tau + rnd.uniform(-.15, .15); droop = rnd.uniform(.5, 1.1)
        pts = [(0, 0, 0), (1.2, 0, .6), (2.6, 0, .4), (3.8, 0, -droop)]
        M.push(TR(0, 0, top) @ ROT(math.degrees(a)))
        for j in range(3):
            (x0, _, z0), (x1, _, z1) = pts[j], pts[j + 1]
            w0, w1 = .5 - j * .14, .5 - (j + 1) * .14
            M.add(LEAF, [(x0, -w0, z0), (x1, -w1, z1), (x1, w1, z1), (x0, w0, z0)], [(0, 1, 2, 3), (3, 2, 1, 0)], (.42, .58, .3))
        M.pop()
    return M


def oldtimer(name, paint=(.35, .7, .72), seed=3):
    """1950s-style cruiser with tail fins and chrome, parked for good (no spare parts)."""
    M = Module(name, grime=False)
    L, W = 5.4, 2.0
    M.box(CLOTH, -L / 2, L / 2, -W / 2, W / 2, .35, 1.0, paint)                               # body
    M.box(CLOTH, -1.1, 1.0, -W / 2 + .12, W / 2 - .12, 1.0, 1.55, paint)                     # cabin
    M.box(GLASS, -1.05, .95, -W / 2 + .1, W / 2 - .1, 1.05, 1.5, (.3, .36, .4))
    M.box(CLOTH, -1.15, 1.05, -W / 2 + .1, W / 2 - .1, 1.55, 1.62, (.95, .94, .9))           # white roof
    for side in (-1, 1):
        M.prism_x(CLOTH, -L / 2, -L / 2 + 1.4, [(side * (W / 2 - .05), 1.0), (side * (W / 2 - .3), 1.0), (side * (W / 2 - .2), 1.35)], paint)  # tail fins
        for x in (-1.6, 1.6):
            M.push(TR(x, side * (W / 2 - .05), .38) @ Matrix.Rotation(math.radians(90), 4, 'X'))
            M.cyl(DARK, 0, 0, -.14, .14, .38, .38, 14, (.18, .18, .18))
            M.cyl(ZINC, 0, 0, -.16, .16, .2, .2, 10, 1.2)
            M.pop()
    M.box(ZINC, L / 2 - .05, L / 2 + .08, -W / 2, W / 2, .35, .55, 1.25)                     # chrome bumper
    M.box(ZINC, -L / 2 - .08, -L / 2 + .05, -W / 2, W / 2, .35, .55, 1.25)
    for side in (-1, 1): M.sphere(LAMP, L / 2 + .02, side * .65, .75, .06, .16, .12, 8, 5)
    return M


def lighthouse(name='kit-lighthouse'):
    """Harbour fortress with a tapered lighthouse tower (seen across the bay from the seafront)."""
    M = Module(name)
    M.box(DARK, -16, 16, -10, 10, 0, 6, (.82, .74, .6))
    for k in range(9):  # crenellations
        x = -15 + k * 3.75
        M.box(DARK, x - .8, x + .8, -10.4, -9.6, 6, 7.2, (.82, .74, .6))
    M.lathe(LIME, 4, 0, [(3.0, 0), (2.4, 18), (2.0, 24), (2.6, 24.4), (2.6, 25.2)], 16, .97, 6)
    M.lathe(GLASS, 4, 0, [(1.6, 0), (1.6, 2.2)], 12, (.6, .55, .3), 31.2)
    M.lathe(LAMP, 4, 0, [(1.0, 0), (1.0, 1.6)], 10, 1.0, 31.5)
    M.lathe(ZINC, 4, 0, [(2.0, 0), (.3, 1.6), (0, 2.2)], 12, .9, 33.4)
    return M


def beard_ministry(name='kit-beard-ministry'):
    """Plain ministry block wearing a colossal steel-tube sculpture: a beard and a cigar, nothing else."""
    M = Module(name)
    w, d, h = 34.0, 14.0, 24.0
    M.box(PLASTER, -w / 2, w / 2, 0, d, 0, h, (.9, .9, .86))
    for f in range(6):
        for k in range(12):
            x = -w / 2 + (k + .5) * w / 12
            if abs(x) < 11 and 1 <= f <= 4: continue
            M.box(GLASS, x - .5, x + .5, -.05, .02, 2 + f * 3.6, 4.6 + f * 3.6, (.26, .28, .3))
    rnd = random.Random(19)
    cx, cz = 0, 12.0
    for k in range(70):  # beard: curly steel strands hanging off the facade
        a = rnd.uniform(-1.25, 1.25); r = rnd.uniform(1, 9.5)
        x0, z0 = cx + math.sin(a) * r, cz - math.cos(a) * r * .9
        pts = [(x0, -.4, z0)]
        for j in range(4):
            pts.append((pts[-1][0] + rnd.uniform(-.6, .6), -.4 - .2 * j, pts[-1][2] - rnd.uniform(.5, 1.1)))
        for (ax, ay, az), (bx, by, bz) in zip(pts, pts[1:]):
            M.push(TR(ax, ay, az))
            dx, dz = bx - ax, bz - az; length = math.hypot(dx, dz)
            M.push(Matrix.Rotation(math.atan2(dx, -dz), 4, 'Y'))
            M.cyl(IRON, 0, 0, -length, 0, .09, .09, 6, (.3, .3, .32))
            M.pop(); M.pop()
    M.push(TR(5.5, -1.2, 13.5) @ Matrix.Rotation(math.radians(80), 4, 'Y') @ Matrix.Rotation(math.radians(-12), 4, 'X'))
    M.cyl(WOOD, 0, 0, 0, 7.5, .55, .5, 14, (.55, .36, .2))                                    # the cigar
    M.cyl(GOLD, 0, 0, 1.2, 1.9, .57, .56, 14)
    M.cyl(LAMP, 0, 0, 7.5, 7.7, .5, .45, 12)
    M.pop()
    M.box(LIME, -w / 2 - .2, w / 2 + .2, -.3, d, h, h + .5, .93)
    return M


def speech_tribune(name='kit-tribune'):
    """Speaker's tribune: steps, a lectern with a microphone on an absurdly long stand, loudspeaker towers."""
    M = Module(name)
    for k in range(4):
        M.box(LIME, -7 + k * .6, 7 - k * .6, -k * .7 - 1, 3, k * .45, (k + 1) * .45, .95)
    M.box(WOOD, -.8, .8, -1.2, -.2, 1.8, 3.1, (.42, .26, .16))
    M.cyl(IRON, 0, -1.3, 3.1, 6.5, .04, .03, 6)
    M.sphere(IRON, 0, -1.3, 6.6, .12, .12, .16, 8, 5)
    for side in (-1, 1):
        M.box(IRON, side * 6 - .15, side * 6 + .15, 1.4, 1.7, 0, 9, 1.0)
        for k in range(3):
            M.push(TR(side * 6, 1.2, 6.5 + k * .9) @ Matrix.Rotation(math.radians(-80), 4, 'X') @ Matrix.Rotation(math.radians(side * 15), 4, 'Z'))
            M.lathe(GOLD, 0, 0, [(.1, 0), (.15, .3), (.45, .8), (.5, .85)], 12, .8)
            M.pop()
    return M


def havana_modules():
    return [
        colonial_house('kit-colonial-a', 12, 2, 1), colonial_house('kit-colonial-b', 16, 3, 2), colonial_house('kit-colonial-c', 9, 2, 3),
        royal_palm('kit-palm'), royal_palm('kit-palm-b', 11, 9),
        oldtimer('kit-oldtimer-a', (.38, .72, .74)), oldtimer('kit-oldtimer-b', (.86, .42, .5)), oldtimer('kit-oldtimer-c', (.9, .8, .4)),
        lighthouse(), beard_ministry(), speech_tribune(),
    ]
