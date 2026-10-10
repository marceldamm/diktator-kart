"""Own start areas for every city and the Moscow landmarks (Claude, 10.10.2026). Executed by build_city_kit.py after
beijing_modules.py (uses its GLAZE/LACQUER materials and curved_roof/eave_ring/lantern helpers).

Marcel: every circuit except Berlin gets its own start area instead of the Berlin grandstands. Each city now has a
grandstand (same 24 m footprint and crowd as kit-grandstand) and a start/finish gantry in its own architecture:
  Moscow   - dark red granite tiers, crenellated brick back wall, tower gantry with green tent roofs
  Peking   - grey tiers, red lacquer wall under a yellow tile roof, lantern gantry
  Havana   - white tiers, pastel arcade wall, striped awning, palm-trunk gantry
  Pyongyang- grey concrete tiers, plain wall with a huge red panel, concrete pylon gantry
Moscow landmarks (fictional, no regime symbols): crenellated red brick wall, a wall tower with a green tent roof and a
gilded spire ball, and the "Kathedrale der Planerfüllung" with striped onion domes.
"""

BRICK, GRANITE, TENT_GREEN = (.56, .2, .15), (.36, .2, .18), (.28, .5, .38)


def crowd_tiers(M, L=24.0, rows=10, tier=STONE, tier_col=.9, seat_col=(.62, .45, .32), seed=7):
    rnd = random.Random(seed)
    clothes = [hexrgb(h) for h in ('#2c2f36', '#4a3b30', '#6b5a43', '#293349', '#7a2a2c', '#c9bfa8', '#3d4a3a', '#59606a', '#8a7a5a', '#1f2124')]
    for r in range(rows):
        y0, z0 = .5 + r * .9, 1.2 + r * .55
        M.box(tier, -L / 2, L / 2, y0, y0 + .9, 0, z0, tier_col if isinstance(tier_col, tuple) else tier_col - r * .01)
        M.box(WOOD, -L / 2, L / 2, y0 + .45, y0 + .8, z0, z0 + .42, seat_col)
        for k in range(int(L / .62)):
            if rnd.random() < .12: continue
            x = -L / 2 + .31 + k * .62 + rnd.uniform(-.06, .06)
            c = rnd.choice(clothes); y = y0 + .55
            M.boxc(CROWD, x, y, z0 + .42, .44, .34, .62, c)
            M.boxc(CROWD, x, y - .3, z0 + .25, .38, .4, .22, tuple(v * .8 for v in c))
            M.sphere(SKIN, x, y + .02, z0 + 1.2, .13, .14, .16, 6, 4)
            if rnd.random() < .35: M.cyl(CROWD, x, y + .02, z0 + 1.27, z0 + 1.42, .17, .13, 7, rnd.choice(clothes))
            if rnd.random() < .18: M.boxc(CROWD, x + .2, y - .05, z0 + 1.0, .1, .1, .7, c)
    return .5 + rows * .9, 1.2 + rows * .55


def merlons(M, x0, x1, y0, y1, z, col, mat=None, w=1.0, gap=.8, h=1.4):
    """Swallowtail merlons along X on top of a wall."""
    mat = mat or DARK
    x = x0
    while x + w <= x1 + .01:
        M.prism_y(mat, y0, y1, [(x, z), (x + w, z), (x + w, z + h), (x + w * .5, z + h * .62), (x, z + h)], col)
        x += w + gap


def city_stand(style):
    M = Module(f'kit-stand-{style}')
    L = 24.0
    tier, tier_col = {'moscow': (DARK, GRANITE), 'beijing': (STONE, (.62, .62, .6)), 'havana': (LIME, (.96, .95, .92)),
                      'pyongyang': (LIME, (.72, .74, .74))}[style]
    M.box(DARK, -L / 2, L / 2, 0, .5, 0, 1.3, .85)
    M.box(LIME, -L / 2, L / 2, -.06, .56, 1.3, 1.45, .95)
    yb, zb = crowd_tiers(M, L, 10, tier, tier_col, seed={'moscow': 11, 'beijing': 12, 'havana': 13, 'pyongyang': 14}[style])
    if style == 'moscow':
        M.box(DARK, -L / 2, L / 2, yb, yb + 1.2, 0, zb + 3.2, BRICK)
        merlons(M, -L / 2, L / 2, yb, yb + 1.2, zb + 3.2, BRICK)
        for x in (-L / 2 + 2, 0, L / 2 - 2):  # gilded reviewing balcony fronts
            M.box(GOLD, x - 1.6, x + 1.6, yb - .4, yb, zb + .9, zb + 1.05)
            for k in range(7): M.cyl(GOLD, x - 1.5 + k * .5, yb - .2, zb, zb + .9, .05, seg=6)
        for x in (-L / 2 + 6, L / 2 - 6):
            M.add(BANNER, [(x - .9, yb - .05, zb + 3.0), (x + .9, yb - .05, zb + 3.0), (x + .9, yb - .05, zb + .2), (x - .9, yb - .05, zb + .2),
                           (x - .9, yb, zb + 3.0), (x + .9, yb, zb + 3.0), (x + .9, yb, zb + .2), (x - .9, yb, zb + .2)],
                  [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], uvfit=True)
    elif style == 'beijing':
        M.box(LACQUER, -L / 2, L / 2, yb, yb + .8, 0, zb + 4.2, RED)
        for x in (-L / 2 + .4, -L / 6, L / 6, L / 2 - .4):
            M.cyl(LACQUER, x, .9, 1.45, zb + 4.2, .2, seg=10, col=RED)
        M.box(LACQUER, -L / 2 - .3, L / 2 + .3, .5, yb + .8, zb + 4.2, zb + 4.6, TEAL)
        curved_roof(M, -L / 2, L / 2, .5, yb + .8, zb + 4.6, 2.2, oh=1.4, curl=.5, col=TILE_YELLOW, thick=.3)
        for x in (-8, -4, 0, 4, 8): lantern(M, x, -.2, zb + 3.6, .38)
    elif style == 'havana':
        M.box(PLASTER, -L / 2, L / 2, yb, yb + .8, 0, zb + 4.4, (.95, .78, .82))
        for k in range(4):
            x = -L / 2 + 3 + k * 6
            M.prism_y(LIME, yb - .05, yb + .01, arch_poly(x - 1.6, x + 1.6, zb + .3, zb + 2.4, 8), .95)
        n = 24
        for k in range(n):  # striped awning sloping out over the crowd
            a, b = -L / 2 + k * L / n, -L / 2 + (k + 1) * L / n
            c = (.25, .62, .65) if k % 2 == 0 else (.97, .95, .9)
            M.add(CLOTH, [(a, yb, zb + 4.2), (b, yb, zb + 4.2), (b, -1.2, zb + 2.9), (a, -1.2, zb + 2.9),
                          (a, yb, zb + 4.25), (b, yb, zb + 4.25), (b, -1.2, zb + 2.95), (a, -1.2, zb + 2.95)],
                  [(0, 1, 2, 3), (7, 6, 5, 4), (3, 2, 6, 7), (0, 3, 7, 4), (1, 5, 6, 2)], c)
        for x in (-L / 2 + .3, 0, L / 2 - .3): M.cyl(IRON, x, -1.1, 1.45, zb + 2.95, .08, seg=8)
    else:  # pyongyang
        M.box(LIME, -L / 2, L / 2, yb, yb + .9, 0, zb + 5.0, (.74, .75, .74))
        M.add(BANNER, [(-7, yb - .05, zb + 4.6), (7, yb - .05, zb + 4.6), (7, yb - .05, zb + .6), (-7, yb - .05, zb + .6),
                       (-7, yb, zb + 4.6), (7, yb, zb + 4.6), (7, yb, zb + .6), (-7, yb, zb + .6)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], uvfit=True)
        M.box(LIME, -L / 2 - .3, L / 2 + .3, -1.6, yb + .9, zb + 5.0, zb + 5.5, (.7, .71, .7))   # flat concrete canopy
        for x in (-L / 2 + .3, L / 2 - .3): M.box(LIME, x - .3, x + .3, -1.5, -.9, 1.45, zb + 5.0, (.7, .71, .7))
    return M


def city_finish(style):
    """Start/finish gantry: posts at ±9.8 m like kit-finish, a checkered beam and a city crown."""
    M = Module(f'kit-finish-{style}')
    for side in (-1, 1):
        x = side * 9.8
        if style == 'moscow':
            M.box(DARK, x - 1.4, x + 1.4, -1.4, 1.4, 0, 11.0, BRICK)
            merlons(M, x - 1.4, x + 1.4, -1.4, 1.4, 11.0, BRICK, w=.7, gap=.35, h=1.0)
            M.lathe(COPPER, x, 0, [(1.3, 0), (.2, 4.5), (0, 4.8)], 4, TENT_GREEN, 12.0, smooth=False)
            M.sphere(GOLD, x, 0, 17.1, .35, .35, .35, 10, 6)
        elif style == 'beijing':
            M.box(LIME, x - 1.4, x + 1.4, -1.4, 1.4, 0, 1.0, .92)
            M.cyl(LACQUER, x, 0, 1.0, 10.8, .75, seg=12, col=RED)
            eave_ring(M, x, 0, 1.0, 1.0, 11.6, out=1.2, drop=.9, col=TILE_YELLOW)
            M.box(LACQUER, x - .9, x + .9, -.9, .9, 10.6, 11.6, TEAL)
            M.lathe(GOLD, x, 0, [(.3, 0), (.2, .6), (0, 1.2)], 8, 1.0, 11.6)
            lantern(M, x, -1.3, 7.2, .5)
        elif style == 'havana':
            M.lathe(BARK, x, 0, [(.6, 0), (.48, 1.0), (.42, 8.0), (.38, 11.0)], 12, (.86, .82, .74))
            M.box(PLASTER, x - 1.1, x + 1.1, -1.1, 1.1, 0, 1.6, (.95, .85, .6))
            for k in range(7):
                a = k / 7 * math.tau
                M.push(TR(x, 0, 11.0) @ ROT(math.degrees(a)))
                M.add(LEAF, [(0, -.35, 0), (2.8, -.15, -.7), (2.8, .15, -.7), (0, .35, 0)], [(0, 1, 2, 3), (3, 2, 1, 0)], (.42, .58, .3))
                M.pop()
        else:  # pyongyang
            M.box(LIME, x - 1.2, x + 1.2, -1.2, 1.2, 0, 12.5, (.76, .77, .76))
            M.box(BANNER, x - 1.25, x + 1.25, -1.25, -1.2, 5.0, 11.5)
            M.lathe(GOLD, x, 0, [(.5, 0), (.5, .4), (0, 1.6)], 4, 1.0, 12.5, smooth=False)
    n, w = 32, 18.0 / 32
    for i in range(n):
        for j in range(3):
            c = (.08, .09, .1) if (i + j) % 2 else (.95, .93, .88)
            M.box(FRAME, -9 + i * w, -9 + (i + 1) * w, -.45, .45, 8.0 + j * .45, 8.45 + j * .45, c)
    top = {'moscow': BRICK, 'beijing': RED, 'havana': (.95, .85, .6), 'pyongyang': (.76, .77, .76)}[style]
    M.box(LACQUER if style == 'beijing' else (DARK if style == 'moscow' else PLASTER if style == 'havana' else LIME), -9, 9, -.6, .6, 9.35, 10.2, top)
    if style == 'beijing': curved_roof(M, -9, 9, -.6, .6, 10.2, 1.0, oh=.6, curl=.3, col=TILE_YELLOW, thick=.25)
    if style == 'moscow': merlons(M, -9, 9, -.6, .6, 10.2, BRICK, w=.7, gap=.45, h=.9)
    for x in (-5.5, 5.5):
        M.add(BANNER, [(x - 1.1, -.65, 7.9), (x + 1.1, -.65, 7.9), (x + 1.1, -.65, 4.6), (x - 1.1, -.65, 4.6),
                       (x - 1.1, -.6, 7.9), (x + 1.1, -.6, 7.9), (x + 1.1, -.6, 4.6), (x - 1.1, -.6, 4.6)],
              [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (2, 3, 7, 6)], uvfit=True)
    return M


def kremlin_wall():
    M = Module('kit-kremlin-wall')
    M.box(DARK, -12, 12, 0, 3.0, 0, 9.0, BRICK)
    M.box(DARK, -12.05, 12.05, -.08, 3.08, 0, .9, tuple(c * .8 for c in BRICK))
    for z in (3.0, 6.0): M.box(DARK, -12, 12, -.06, 0, z, z + .12, tuple(c * 1.15 for c in BRICK))
    merlons(M, -12, 11.6, 0, .9, 9.0, BRICK, w=1.1, gap=.75, h=1.6)
    return M


def kremlin_tower():
    M = Module('kit-kremlin-tower')
    M.box(DARK, -5, 5, -5, 5, 0, 16, BRICK)
    merlons(M, -5, 5, -5, -4.2, 16, BRICK, w=.9, gap=.5, h=1.2)
    for k in range(4):  # white stone trim bands and blind arches
        M.box(LIME, -5.1, 5.1, -5.1, 5.1, 4 + k * 3.6, 4.25 + k * 3.6, .95)
    M.prism_y(LIME, -5.12, -5.0, arch_poly(-1.6, 1.6, 0, 3.4, 10), .9)
    M.box(DARK, -3.4, 3.4, -3.4, 3.4, 16, 22, BRICK)
    for y in (-3.45, 3.45):
        M.box(LIME, -.7, .7, y - .05, y + .05, 18, 20.5, .95)
    M.box(DARK, -2.4, 2.4, -2.4, 2.4, 22, 25, tuple(c * 1.05 for c in BRICK))
    M.lathe(COPPER, 0, 0, [(3.4, 0), (.4, 11), (0, 11.6)], 4, TENT_GREEN, 25, smooth=False)   # green tent roof
    M.cyl(GOLD, 0, 0, 36.4, 38.6, .08, seg=6)
    M.sphere(GOLD, 0, 0, 39.2, .7, .7, .7, 12, 8)                                             # gilded spire ball
    return M


def onion(M, cx, cy, z, r, h, colours, gores=8):
    """Onion dome with vertical colour gores (separate vertices per gore keep the stripes crisp)."""
    prof = [(r * .62, 0), (r, h * .25), (r * 1.05, h * .42), (r * .8, h * .62), (r * .35, h * .82), (r * .08, h * .95), (0, h)]
    for g in range(gores):
        a0, a1 = g / gores * math.tau, (g + 1) / gores * math.tau
        v, f = [], []
        for (pr, pz) in prof:
            for a in (a0, (a0 + a1) / 2, a1):
                v.append((cx + pr * math.cos(a), cy + pr * math.sin(a), z + pz))
        for i in range(len(prof) - 1):
            for j in range(2):
                p = i * 3 + j
                f.append((p, p + 1, p + 4, p + 3))
        M.add(CLOTH, v, f, colours[g % len(colours)], smooth=True)
    M.lathe(GOLD, cx, cy, [(.08, 0), (.08, h * .5), (0, h * .55)], 6, 1.0, z + h)


def onion_church():
    """Kathedrale der Planerfüllung: fictional church with a central tent tower and striped onion domes."""
    M = Module('kit-onion-church')
    M.box(DARK, -14, 14, -10, 10, 0, 1.4, (.8, .78, .74))
    M.box(PLASTER, -9, 9, -6, 6, 1.4, 12, (.86, .36, .3))
    for k in range(5): M.box(LIME, -9.05, 9.05, -6.05, 6.05, 3 + k * 2, 3.2 + k * 2, .95)
    M.lathe(PLASTER, 0, 0, [(4, 0), (4, 10), (3.4, 12)], 8, (.92, .78, .5), 12, smooth=False)       # central drum
    M.lathe(GOLD, 0, 0, [(3.6, 0), (.5, 9), (0, 9.4)], 8, 1.0, 24, smooth=False)                  # gilded tent
    onion(M, 0, 0, 33.2, 1.4, 3.6, [(.85, .65, .2), (.95, .9, .7)])
    domes = [(-10, -7, (.85, .15, .15), (.95, .93, .88)), (10, -7, (.15, .5, .35), (.95, .8, .25)), (-10, 7, (.2, .35, .7), (.95, .93, .88)),
             (10, 7, (.95, .7, .15), (.8, .2, .15)), (0, -10, (.8, .2, .15), (.2, .5, .3)), (0, 10, (.2, .45, .65), (.95, .75, .2))]
    for x, y, a, b in domes:
        M.cyl(PLASTER, x, y, 1.4, 14, 2.2, 1.9, 12, (.9, .82, .7))
        M.lathe(LIME, x, y, [(2.3, 0), (2.3, .5)], 12, .95, 14)
        onion(M, x, y, 14.5, 2.6, 5.4, [a, b])
    for x in (-5, 0, 5): M.prism_y(GLASS, -6.08, -6.0, arch_poly(x - .9, x + .9, 4, 7, 8), (.3, .3, .35))
    return M


def city_start_modules():
    return [city_stand(s) for s in ('moscow', 'beijing', 'havana', 'pyongyang')] + \
           [city_finish(s) for s in ('moscow', 'beijing', 'havana', 'pyongyang')] + \
           [kremlin_wall(), kremlin_tower(), onion_church()]
