"""Joint positions of a standing Tripo driver model, measured from mesh cross-sections (Claude, 09.10.2026).

All Tripo drivers share Tripo's A-pose and roughly 0.98 m height, so joint heights follow fixed fractions (taken
from the hand-checked Stalin model); x/y come from slices through the actual mesh, so broad (Kim) and slim models
get their own shoulder, elbow, wrist, knee and ankle positions. x is relative to the body centre line, +x is the
character's left (the model faces -Y).
"""
from mathutils import Vector

# Stalin's hand-checked heights (source units, model height 0.979).
Z = {'pelvis': .47, 'spine_01': .53, 'spine_02': .61, 'spine_03': .70, 'neck_01': .83, 'Head': .872, 'head_top': .985,
     'clavicle': .81, 'shoulder': .795, 'elbow': .64, 'wrist': .515, 'knuckle': .466, 'fingertip': .424,
     'hip': .475, 'knee': .275, 'ankle': .085}
REF_H = .979


def _mid(sel):
    xs = [p.x for p in sel]; ys = [p.y for p in sel]
    return (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2


def _outer_cluster(xs, gap=.012):
    xs = sorted(xs, reverse=True)
    out = [xs[0]]
    for a, b in zip(xs, xs[1:]):
        if a - b > gap: break
        out.append(b)
    return out


def measure_joints(points):
    pts = list(points)
    H = max(p.z for p in pts)
    k = H / REF_H
    def sl(z, tol=.008): return [p for p in pts if abs(p.z - z * k) < tol * k]
    head = [p for p in pts if p.z > .9 * H]
    cx, head_y = _mid(head)
    rel = [Vector((p.x - cx, p.y, p.z)) for p in pts]
    def rsl(z, tol=.008): return [p for p in rel if abs(p.z - z * k) < tol * k]
    def torso_y(z):
        s = [p for p in rsl(z) if abs(p.x) < .06 * k]
        return _mid(s)[1] if s else 0.
    def side_mid(z, test=lambda p: True):
        s = [p for p in rsl(z, .012) if p.x > 0 and test(p)]
        return _mid(s)
    def arm_mid(z):
        s = [p for p in rsl(z, .01) if p.x > .04 * k]
        xs = _outer_cluster([p.x for p in s])
        lo = min(xs) if xs[0] - min(xs) < .09 * k else xs[0] - .07 * k
        sel = [p for p in s if p.x >= lo]
        return _mid(sel)
    J = {}
    for n in ('pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01'):
        J[n] = (0, torso_y(Z[n]), Z[n] * k)
    J['Head'] = (0, head_y, Z['Head'] * k)
    J['head_top'] = (0, head_y - .005, H + .005)
    J['root'] = (0, J['pelvis'][1], 0)
    for n in ('elbow', 'wrist', 'knuckle', 'fingertip'):
        x, y = arm_mid(Z[n]); J[n] = (x, y, Z[n] * k)
    ex, ey, _ = J['elbow']
    J['shoulder'] = (ex * .81, torso_y(Z['shoulder']) + .02 * k, Z['shoulder'] * k)
    J['clavicle'] = (.022 * k, J['shoulder'][1] - .008 * k, Z['clavicle'] * k)
    kx, ky = side_mid(Z['knee']); J['knee'] = (kx, ky, Z['knee'] * k)
    ax, ay = side_mid(Z['ankle']); J['ankle'] = (ax, ay, Z['ankle'] * k)
    J['hip'] = (kx * .64, torso_y(Z['hip']), Z['hip'] * k)
    foot = [p for p in rel if p.z < .03 * k and p.x > 0]
    fy0, fy1 = min(p.y for p in foot), max(p.y for p in foot)
    fx = _mid(foot)[0]
    J['toe'] = (fx, fy0 + .01 * k, .02 * k)
    J['ball'] = (fx, fy0 + .055 * k, .02 * k)
    return cx, J
