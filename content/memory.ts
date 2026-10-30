export type Card = {
  n: number;
  verdict: "rejected" | "approved";
  text: string;
  col: number;
  row: number;
  nx: number; // center, 0..1 across the width
  ny: number; // center, 0..1 down the height
  rot: number;
};

export const COLS = 4;
export const ROWS = 5;
export const RATIO = 1.1; // wall height / wall width
export const CARD_W = 0.21; // card width as a share of the wall width
export const CARD_H = 0.17; // card height as a share of the wall width

type Row = [number, "rejected" | "approved", string, number, number];

// [PR number, verdict, decision, column, row]. Sample values, grouped by topic region.
const raw: Row[] = [
    // database (top-left)
    [118, "approved", "Parameterised queries everywhere", 0, 0],
    [234, "rejected", "Raw SQL string in a request handler", 1, 0],
    [77, "approved", "Add an index before shipping the new filter", 0, 1],
    [301, "rejected", "N+1 query inside the list endpoint", 1, 1],
    [189, "approved", "Migrations are reversible, or they don't merge", 0, 2],
    // auth and security (top-right)
    [142, "rejected", "Token stored in localStorage", 2, 0],
    [256, "approved", "Short-lived tokens with refresh rotation", 3, 0],
    [98, "rejected", "Hard-coded API key in a config file", 2, 1],
    [211, "approved", "Verify webhook signatures before parsing", 3, 1],
    [340, "rejected", "Role check done only in the UI", 3, 2],
    // testing (bottom-left)
    [64, "approved", "Regression test ships with every bug fix", 1, 2],
    [173, "rejected", "Test that depends on the wall clock", 0, 3],
    [228, "approved", "Mock the network edge, not the module", 1, 3],
    [305, "rejected", "Snapshot test of an entire page", 0, 4],
    [91, "approved", "Fixture factories over copied JSON", 1, 4],
    // API and errors (bottom-right)
    [156, "rejected", "Catch and swallow the error", 2, 2],
    [267, "approved", "Retry with backoff, then surface the failure", 2, 3],
    [124, "rejected", "Unbounded retry loop", 3, 3],
    [318, "approved", "Validate input at the boundary", 2, 4],
    [203, "rejected", "Breaking change to a response field", 3, 4],
];

export const cards: Card[] = raw.map(([n, verdict, text, col, row], i) => ({
    n,
    verdict,
    text,
    col,
    row,
    nx: (col + 0.5) / COLS + (((i * 37) % 11) / 10 - 0.5) * 0.04,
    ny: (row + 0.5) / ROWS + (((i * 53) % 11) / 10 - 0.5) * 0.04,
    rot: (((i * 29) % 11) / 10 - 0.5) * 6,
}));