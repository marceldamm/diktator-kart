export interface Footprint { u0: number; u1: number; v0: number; v1: number }
export interface PlacementFrame { x: number; z: number; yaw: number; sx?: number; sc?: number }

/** Sample the whole scaled footprint, including all four exact edges. Local x follows the facade. */
export function footprintPoints(p: PlacementFrame, f: Footprint, step = 2.2): [number, number][] {
  const out: [number, number][] = [], c = Math.cos(p.yaw), sn = Math.sin(p.yaw);
  const sx = (p.sx ?? 1) * (p.sc ?? 1), sz = p.sc ?? 1;
  const nx = Math.max(1, Math.ceil((f.u1 - f.u0) * sx / step)), nz = Math.max(1, Math.ceil((f.v1 - f.v0) * sz / step));
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) {
    const u = (f.u0 + (f.u1 - f.u0) * i / nx) * sx, v = (f.v0 + (f.v1 - f.v0) * j / nz) * sz;
    out.push([p.x + u * c + v * sn, p.z - u * sn + v * c]);
  }
  return out;
}
