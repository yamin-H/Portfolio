import type { ComponentType } from "react";
import IsoGithub from "./IsoGithub";
import IsoQueue from "./IsoQueue";
import IsoWorker from "./IsoWorker";
import IsoGraph from "./IsoGraph";
import IsoVectors from "./IsoVectors";
import IsoReview from "./IsoReview";
import IsoTerminal from "./IsoTerminal";
import IsoAgent from "./IsoAgent";
import IsoProvider from "./IsoProvider";
import IsoTools from "./IsoTools";
import IsoGate from "./IsoGate";
import IsoResult from "./IsoResult";
import type { BlockState } from "./tones";

export type BlockKind =
  | "github"
  | "queue"
  | "worker"
  | "graph"
  | "vectors"
  | "review"
  | "terminal"
  | "agent"
  | "provider"
  | "tools"
  | "gate"
  | "result";

export const blockMap: Record<
  BlockKind,
  ComponentType<{ state?: BlockState; label?: string }>
> = {
  github: IsoGithub,
  queue: IsoQueue,
  worker: IsoWorker,
  graph: IsoGraph,
  vectors: IsoVectors,
  review: IsoReview,
  terminal: IsoTerminal,
  agent: IsoAgent,
  provider: IsoProvider,
  tools: IsoTools,
  gate: IsoGate,
  result: IsoResult,
};