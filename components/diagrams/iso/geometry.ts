export type V = [number, number];

export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
export const scale = (a: V, k: number): V => [a[0] * k, a[1] * k];

// 2:1 isometric axes
export const RX: V = [1, -0.5]; // width axis, up-right
export const LY: V = [-1, -0.5]; // depth axis, up-left
export const UP: V = [0, -1];

const pts = (...p: V[]) => p.map((q) => q.join(",")).join(" ");

/** A box whose front-bottom corner sits at `origin`. */
export function box(origin: V, w: number, d: number, h: number) {
  const F = origin;
  const R = add(F, scale(RX, w));
  const L = add(F, scale(LY, d));
  const B = add(R, scale(LY, d));
  const up = scale(UP, h);
  const Ft = add(F, up);
  const Rt = add(R, up);
  const Lt = add(L, up);
  const Bt = add(B, up);

  return {
    top: pts(Ft, Rt, Bt, Lt),
    left: pts(F, L, Lt, Ft),
    right: pts(F, R, Rt, Ft),
    ground: pts(F, R, B, L),
  };
}

export function hatch(
  side: "left" | "right",
  len: number,
  h: number,
  spacing: number,
  minFrac: number
) {
  const sign = side === "left" ? -1 : 1;
  const out: { x: number; y1: number; y2: number }[] = [];
  for (let i = 1, s = spacing; s < len; i++, s += spacing) {
    const frac = minFrac + (1 - minFrac) * (((i * 37) % 11) / 10);
    const y1 = -s / 2;
    out.push({ x: sign * s, y1, y2: y1 - h * frac });
  }
  return out;
}

export { pts };