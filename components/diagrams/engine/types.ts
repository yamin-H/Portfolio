export type Level = "simple" | "engineer";

export type Both = { simple: string; engineer: string };

export type Stage = {
  name: Both;
  role: Both;
  input: Both; // simple: a sentence, engineer: a code sample
  output: Both;
  why: Both;
};