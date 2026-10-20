import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_TS = path.join(ROOT, "src", "data", "tree.ts");
const OUT_SVG = path.join(ROOT, "scripts", "tree-preview.svg");

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(1142026);

const CENTER_X = 450;
const GROUND_Y = 650;
const TRUNK_TOP_Y = 470;

const LOBES = [
  { id: "left", cx: 300, cy: 285, rx: 165, ry: 130 },
  { id: "center", cx: 450, cy: 220, rx: 175, ry: 145 },
  { id: "right", cx: 600, cy: 285, rx: 165, ry: 130 },
];

function insideEllipse(x, y, ellipse) {
  const dx = (x - ellipse.cx) / ellipse.rx;
  const dy = (y - ellipse.cy) / ellipse.ry;
  return dx * dx + dy * dy <= 1;
}

const attractors = [];
let guard = 0;
while (attractors.length < 850 && guard < 60000) {
  guard += 1;
  const x = 120 + random() * 660;
  const y = 90 + random() * 320;
  if (y > TRUNK_TOP_Y - 40 && Math.abs(x - CENTER_X) < 55) continue;
  const lobe = LOBES.find((ellipse) => insideEllipse(x, y, ellipse));
  if (!lobe) continue;
  const dx = x - lobe.cx;
  const dy = y - lobe.cy;
  const distance = Math.sqrt((dx / lobe.rx) ** 2 + (dy / lobe.ry) ** 2);
  if (distance > 1) continue;
  attractors.push({
    x,
    y,
    lobe: lobe.id,
    alive: true,
  });
}

const nodes = [];
const branches = [];
const leaves = [];

function addNode(x, y, lobe, depth, parent = null) {
  const node = {
    id: nodes.length,
    x,
    y,
    lobe,
    depth,
    parent,
    children: [],
  };
  nodes.push(node);
  if (parent !== null) {
    const parentNode = nodes[parent];
    parentNode.children.push(node.id);
    branches.push({
      x1: parentNode.x,
      y1: parentNode.y,
      x2: x,
      y2: y,
      width: Math.max(1.6, 12 * Math.pow(0.85, depth)),
      depth,
      lobe,
    });
  }
  return node.id;
}

const root = addNode(CENTER_X, GROUND_Y, "center", 0);
const trunk1 = addNode(CENTER_X - 2, GROUND_Y - 38, "center", 1, root);
const trunk2 = addNode(CENTER_X + 2, GROUND_Y - 78, "center", 2, trunk1);
const trunk3 = addNode(CENTER_X - 1, GROUND_Y - 118, "center", 3, trunk2);
const trunk4 = addNode(CENTER_X + 2, GROUND_Y - 158, "center", 4, trunk3);

addNode(CENTER_X - 36, GROUND_Y - 190, "left", 5, trunk4);
addNode(CENTER_X + 2, GROUND_Y - 214, "center", 5, trunk4);
addNode(CENTER_X + 38, GROUND_Y - 190, "right", 5, trunk4);

const INFLUENCE = 105;
const KILL = 24;
const STEP = 13;
const MAX_ITERATIONS = 240;
const MAX_NODES = 420;

for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
  const associations = new Map();

  for (const attractor of attractors) {
    if (!attractor.alive) continue;
    let closest = null;
    let closestDistance = Infinity;

    for (const node of nodes) {
      const dx = attractor.x - node.x;
      const dy = attractor.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < closestDistance && distance < INFLUENCE) {
        closest = node;
        closestDistance = distance;
      }
    }

    if (closest) {
      const list = associations.get(closest.id) ?? [];
      list.push(attractor);
      associations.set(closest.id, list);
    }
  }

  if (associations.size === 0) break;

  for (const [nodeId, list] of associations) {
    if (nodes.length >= MAX_NODES) break;
    const node = nodes[nodeId];

    let dx = 0;
    let dy = 0;
    for (const attractor of list) {
      const vx = attractor.x - node.x;
      const vy = attractor.y - node.y;
      const length = Math.sqrt(vx * vx + vy * vy) || 1;
      dx += vx / length;
      dy += vy / length;
    }
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const jitter = (random() - 0.5) * 0.24;
    const cos = Math.cos(jitter);
    const sin = Math.sin(jitter);
    const nx = dx / length;
    const ny = dy / length;
    const dirX = nx * cos - ny * sin;
    const dirY = nx * sin + ny * cos;
    const step = STEP * (0.9 + random() * 0.2);

    const newX = node.x + dirX * step;
    const newY = node.y + dirY * step;
    if (newY < 70 || newX < 70 || newX > 830 || newY > GROUND_Y) continue;

    const lobe = node.lobe;
    const depth = node.depth + 1;
    addNode(newX, newY, lobe, depth, node.id);

    for (const attractor of attractors) {
      if (!attractor.alive) continue;
      const ax = attractor.x - newX;
      const ay = attractor.y - newY;
      if (ax * ax + ay * ay < KILL * KILL) {
        attractor.alive = false;
      }
    }
  }
}

for (const node of nodes) {
  const isTerminal = node.children.length === 0;
  const isOuter = node.depth >= 7 && random() < 0.34;
  if ((isTerminal && node.depth >= 4) || isOuter) {
    const count = isTerminal
      ? 3 + Math.floor(random() * 4)
      : 1 + Math.floor(random() * 2);
    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const offset = 3 + random() * 6;
      const rx = 3.6 + random() * 2.6;
      const ry = 7 + random() * 5;
      leaves.push({
        x: node.x + Math.cos(angle) * offset,
        y: node.y + Math.sin(angle) * offset,
        rx,
        ry,
        angle: (angle * 180) / Math.PI + (random() - 0.5) * 30,
        lobe: node.lobe,
      });
    }
  }
}

const livingAttractors = attractors.filter((attractor) => attractor.alive).length;

const branchSvg = branches
  .map(
    (branch) =>
      `<line x1="${branch.x1.toFixed(1)}" y1="${branch.y1.toFixed(1)}" x2="${branch.x2.toFixed(1)}" y2="${branch.y2.toFixed(1)}" stroke-width="${branch.width.toFixed(2)}" />`
  )
  .join("\n    ");

const leafSvg = leaves
  .map(
    (leaf) =>
      `<ellipse cx="${leaf.x.toFixed(1)}" cy="${leaf.y.toFixed(1)}" rx="${leaf.rx.toFixed(2)}" ry="${leaf.ry.toFixed(2)}" transform="rotate(${leaf.angle.toFixed(1)} ${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)})" />`
  )
  .join("\n    ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 720">
  <defs>
    <linearGradient id="branch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6DBD25" />
      <stop offset="45%" stop-color="#0B8170" />
      <stop offset="100%" stop-color="#1C469E" />
    </linearGradient>
    <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9BDB58" />
      <stop offset="55%" stop-color="#6DBD25" />
      <stop offset="100%" stop-color="#0B8170" />
    </linearGradient>
  </defs>
  <rect width="900" height="720" fill="#F7FBF3" />
  <g stroke="url(#branch)" stroke-linecap="round" fill="none">
    ${branchSvg}
  </g>
  <g fill="url(#leaf)">
    ${leafSvg}
  </g>
</svg>`;

const lobeIndex = { left: 0, center: 1, right: 2 };
const compactBranches = branches.map((branch) => [
  Number(branch.x1.toFixed(1)),
  Number(branch.y1.toFixed(1)),
  Number(branch.x2.toFixed(1)),
  Number(branch.y2.toFixed(1)),
  Number(branch.width.toFixed(2)),
  lobeIndex[branch.lobe],
]);
const compactLeaves = leaves.map((leaf) => [
  Number(leaf.x.toFixed(1)),
  Number(leaf.y.toFixed(1)),
  Number(leaf.rx.toFixed(2)),
  Number(leaf.ry.toFixed(2)),
  Number(leaf.angle.toFixed(1)),
  lobeIndex[leaf.lobe],
]);

const ts = `export type TreeLobe = "left" | "center" | "right";
export type TreeLobeIndex = 0 | 1 | 2;

export type TreeBranch = [
  number,
  number,
  number,
  number,
  number,
  TreeLobeIndex
];

export type TreeLeaf = [
  number,
  number,
  number,
  number,
  number,
  TreeLobeIndex
];

export const treeBranches: TreeBranch[] = ${JSON.stringify(compactBranches)};

export const treeLeaves: TreeLeaf[] = ${JSON.stringify(compactLeaves)};
`;

await mkdir(path.dirname(OUT_TS), { recursive: true });
await mkdir(path.dirname(OUT_SVG), { recursive: true });
await writeFile(OUT_TS, ts, "utf8");
await writeFile(OUT_SVG, svg, "utf8");

console.log(
  JSON.stringify(
    {
      attractors: attractors.length,
      livingAttractors,
      nodes: nodes.length,
      branches: branches.length,
      leaves: leaves.length,
      iterations: MAX_ITERATIONS,
      ts: OUT_TS,
      svg: OUT_SVG,
    },
    null,
    2
  )
);

