export const NW = 230;
export const NH = 170;
export const HEAD = 26;

export type FlatEdge = {
  d: string;
  arrow: string;
  mid: { x: number; y: number };
  vertical: boolean;
  box: { x: number; y: number; w: number; h: number };
};

export type FlatLayout = {
  w: number;
  h: number;
  nodes: { x: number; y: number }[];
  edges: FlatEdge[];
};

function edge(x1: number, y1: number, x2: number, y2: number): FlatEdge {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 8;
  const by = y2 - uy * 8;
  const px = -uy * 5;
  const py = ux * 5;
  return {
    d: `M${x1} ${y1} L${x2} ${y2}`,
    arrow: `M${bx + px} ${by + py} L${x2} ${y2} L${bx - px} ${by - py}`,
    mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 },
    vertical: x1 === x2,
    // a straight line has a flat bounding box, which breaks the ink filter, so each edge carries a padded box
    box: {
      x: Math.min(x1, x2) - 14,
      y: Math.min(y1, y2) - 14,
      w: Math.abs(x2 - x1) + 28,
      h: Math.abs(y2 - y1) + 28,
    },
  };
}

const MID = 98; // where edges meet a node, measured from its top

function wide(): FlatLayout {
  const cx = [30, 390, 750];
  const ry = [40, 310];
  const n = [
    { x: cx[0], y: ry[0] },
    { x: cx[1], y: ry[0] },
    { x: cx[2], y: ry[0] },
    { x: cx[2], y: ry[1] },
    { x: cx[1], y: ry[1] },
    { x: cx[0], y: ry[1] },
  ];
  const edges = [
    edge(n[0].x + NW + 3, n[0].y + MID, n[1].x - 3, n[1].y + MID),
    edge(n[1].x + NW + 3, n[1].y + MID, n[2].x - 3, n[2].y + MID),
    edge(n[2].x + NW / 2, n[2].y + NH + 3, n[3].x + NW / 2, n[3].y - 3),
    edge(n[3].x - 3, n[3].y + MID, n[4].x + NW + 3, n[4].y + MID),
    edge(n[4].x - 3, n[4].y + MID, n[5].x + NW + 3, n[5].y + MID),
  ];
  return { w: 1010, h: ry[1] + NH + 30, nodes: n, edges };
}

function tall(): FlatLayout {
  const x = 50;
  const nodes = Array.from({ length: 6 }, (_, i) => ({ x, y: 20 + i * 270 }));
  const edges = nodes
    .slice(0, -1)
    .map((n, i) =>
      edge(x + NW / 2, n.y + NH + 3, x + NW / 2, nodes[i + 1].y - 3)
    );
  return { w: 330, h: nodes[5].y + NH + 20, nodes, edges };
}

export const layouts = { wide: wide(), tall: tall() };