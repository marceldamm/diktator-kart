import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryPath = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(
  repositoryPath,
  "client/public/models/capital-finish-arch.glb",
);
const materials = [
  {
    name: "Ivory marble",
    color: [0.78, 0.75, 0.66, 1],
    metallic: 0.12,
    roughness: 0.36,
  },
  {
    name: "Brushed gold",
    color: [0.92, 0.66, 0.12, 1],
    metallic: 0.72,
    roughness: 0.24,
  },
  {
    name: "Imperial red enamel",
    color: [0.55, 0.045, 0.06, 1],
    metallic: 0.08,
    roughness: 0.4,
  },
  {
    name: "Teal enamel",
    color: [0.04, 0.54, 0.49, 1],
    metallic: 0.18,
    roughness: 0.32,
  },
  {
    name: "Graphite",
    color: [0.09, 0.11, 0.14, 1],
    metallic: 0.34,
    roughness: 0.38,
  },
  {
    name: "Warm paper",
    color: [0.91, 0.85, 0.68, 1],
    metallic: 0,
    roughness: 0.76,
  },
];
const groups = materials.map(() => ({
  positions: [],
  normals: [],
  indices: [],
}));

const addFace = (group, points, normal) => {
  const first = group.positions.length / 3;
  for (const point of points) {
    group.positions.push(...point);
    group.normals.push(...normal);
  }
  group.indices.push(first, first + 1, first + 2, first, first + 2, first + 3);
};

const addBox = (material, center, size) => {
  const [cx, cy, cz] = center;
  const [sx, sy, sz] = size.map((value) => value / 2);
  const x0 = cx - sx,
    x1 = cx + sx,
    y0 = cy - sy,
    y1 = cy + sy,
    z0 = cz - sz,
    z1 = cz + sz;
  const faces = [
    {
      n: [1, 0, 0],
      p: [
        [x1, y0, z0],
        [x1, y0, z1],
        [x1, y1, z1],
        [x1, y1, z0],
      ],
    },
    {
      n: [-1, 0, 0],
      p: [
        [x0, y0, z1],
        [x0, y0, z0],
        [x0, y1, z0],
        [x0, y1, z1],
      ],
    },
    {
      n: [0, 1, 0],
      p: [
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x0, y1, z1],
      ],
    },
    {
      n: [0, -1, 0],
      p: [
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y0, z0],
        [x0, y0, z0],
      ],
    },
    {
      n: [0, 0, 1],
      p: [
        [x1, y0, z1],
        [x0, y0, z1],
        [x0, y1, z1],
        [x1, y1, z1],
      ],
    },
    {
      n: [0, 0, -1],
      p: [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y1, z0],
        [x0, y1, z0],
      ],
    },
  ];
  for (const face of faces) addFace(groups[material], face.p, face.n);
};

const addCylinder = (material, x, y, z, radius, height, segments = 12) => {
  const group = groups[material];
  const bottom = y - height / 2;
  const top = y + height / 2;
  for (let index = 0; index < segments; index += 1) {
    const a0 = (index / segments) * Math.PI * 2;
    const a1 = ((index + 1) / segments) * Math.PI * 2;
    const p0 = [x + Math.cos(a0) * radius, bottom, z + Math.sin(a0) * radius];
    const p1 = [x + Math.cos(a1) * radius, bottom, z + Math.sin(a1) * radius];
    const p2 = [x + Math.cos(a1) * radius, top, z + Math.sin(a1) * radius];
    const p3 = [x + Math.cos(a0) * radius, top, z + Math.sin(a0) * radius];
    const middle = (a0 + a1) / 2;
    addFace(group, [p0, p1, p2, p3], [Math.cos(middle), 0, Math.sin(middle)]);
    addFace(group, [[x, top, z], p3, p2, [x, top, z]], [0, 1, 0]);
    addFace(group, [[x, bottom, z], p1, p0, [x, bottom, z]], [0, -1, 0]);
  }
};

// Four fluted columns, layered plinths, gold capitals and a stepped crown.
for (const x of [-1.15, 1.15]) {
  for (const z of [-26, 26]) {
    addBox(1, [x, 0.18, z], [2.2, 0.36, 2.2]);
    addBox(0, [x, 0.52, z], [1.55, 0.38, 1.55]);
    addCylinder(0, x, 2.35, z, 0.55, 3.35, 16);
    addCylinder(1, x, 1.1, z, 0.63, 0.22, 16);
    addCylinder(1, x, 3.65, z, 0.68, 0.28, 16);
    addBox(0, [x, 4.0, z], [1.8, 0.42, 1.8]);
  }
}
addBox(0, [0, 4.38, 0], [3.7, 0.8, 57]);
addBox(1, [0, 4.9, 0], [4.4, 0.2, 59]);
addBox(4, [0, 5.42, 0], [3.5, 0.9, 55]);
addBox(1, [0, 6.0, 0], [5.6, 0.3, 58]);
addBox(0, [0, 6.2, 0], [3.4, 0.25, 61]);

// A front-facing red seal, raised gold stripes and a teal center medallion.
addBox(2, [-1.84, 5.4, 0], [0.16, 0.72, 23]);
for (const y of [5.16, 5.64]) addBox(1, [-1.94, y, 0], [0.08, 0.055, 20]);
addBox(5, [-1.95, 5.4, 0], [0.07, 0.28, 5.5]);
addCylinder(1, -2.02, 5.4, 0, 0.72, 0.15, 16);
addCylinder(3, -2.13, 5.4, 0, 0.49, 0.12, 16);
for (const z of [-27.9, 27.9]) {
  addBox(1, [-1.78, 5.4, z], [0.18, 0.2, 0.42]);
  addCylinder(1, -1.75, 5.4, z, 0.42, 0.38, 12);
}

const binaryParts = [];
const bufferViews = [];
const accessors = [];
const meshes = [];
let byteOffset = 0;
const align4 = () => {
  const remainder = byteOffset % 4;
  if (remainder) {
    const padding = Buffer.alloc(4 - remainder);
    binaryParts.push(padding);
    byteOffset += padding.length;
  }
};
const addBufferData = (
  typedArray,
  target,
  componentType,
  type,
  count,
  extra = {},
) => {
  align4();
  const bytes = Buffer.from(
    typedArray.buffer,
    typedArray.byteOffset,
    typedArray.byteLength,
  );
  const view = bufferViews.length;
  bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.length, target });
  binaryParts.push(bytes);
  byteOffset += bytes.length;
  const accessor = accessors.length;
  accessors.push({ bufferView: view, componentType, count, type, ...extra });
  return accessor;
};

groups.forEach((group, materialIndex) => {
  const positions = Float32Array.from(group.positions);
  const normals = Float32Array.from(group.normals);
  const indices = Uint16Array.from(group.indices);
  if (!indices.length) return;
  const mins = [Infinity, Infinity, Infinity];
  const maxs = [-Infinity, -Infinity, -Infinity];
  for (let index = 0; index < positions.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      mins[axis] = Math.min(mins[axis], positions[index + axis]);
      maxs[axis] = Math.max(maxs[axis], positions[index + axis]);
    }
  }
  const positionAccessor = addBufferData(
    positions,
    34962,
    5126,
    "VEC3",
    positions.length / 3,
    { min: mins, max: maxs },
  );
  const normalAccessor = addBufferData(
    normals,
    34962,
    5126,
    "VEC3",
    normals.length / 3,
  );
  const indexAccessor = addBufferData(
    indices,
    34963,
    5123,
    "SCALAR",
    indices.length,
    {
      min: [0],
      max: [positions.length / 3 - 1],
    },
  );
  meshes.push({
    name: materials[materialIndex].name,
    primitives: [
      {
        attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
        indices: indexAccessor,
        material: materialIndex,
        mode: 4,
      },
    ],
  });
});

const json = {
  asset: {
    version: "2.0",
    generator: "Diktator Kart procedural capital finish arch",
  },
  scene: 0,
  scenes: [{ nodes: meshes.map((_, index) => index) }],
  nodes: meshes.map((mesh, index) => ({
    name: `Capital finish arch · ${mesh.name}`,
    mesh: index,
  })),
  meshes,
  materials: materials.map((material) => ({
    name: material.name,
    pbrMetallicRoughness: {
      baseColorFactor: material.color,
      metallicFactor: material.metallic,
      roughnessFactor: material.roughness,
    },
    doubleSided: true,
  })),
  accessors,
  bufferViews,
  buffers: [{ byteLength: byteOffset }],
};
const jsonBytes = Buffer.from(JSON.stringify(json), "utf8");
const jsonPadding = (4 - (jsonBytes.length % 4)) % 4;
const paddedJson = Buffer.concat([jsonBytes, Buffer.alloc(jsonPadding, 0x20)]);
const rawBinary = Buffer.concat(binaryParts);
const binaryPadding = (4 - (rawBinary.length % 4)) % 4;
const paddedBinary = Buffer.concat([rawBinary, Buffer.alloc(binaryPadding)]);
const totalLength = 12 + 8 + paddedJson.length + 8 + paddedBinary.length;
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(totalLength, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(paddedJson.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(paddedBinary.length, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  Buffer.concat([header, jsonHeader, paddedJson, binaryHeader, paddedBinary]),
);
process.stdout.write(
  `Wrote ${outputPath} (${totalLength} bytes; ${meshes.length} material batches).\n`,
);
