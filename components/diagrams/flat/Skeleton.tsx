import { layouts, NW, NH, type FlatLayout } from "./layout";

function Sketch({ layout, className }: { layout: FlatLayout; className: string }) {
  return (
    <svg
      viewBox={`0 0 ${layout.w} ${layout.h}`}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      {layout.nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <rect width={NW} height={NH} rx={6} strokeWidth={1.4} strokeDasharray="6 6" className="stroke-ink-soft/40" />
          <path d={`M0 26H${NW}`} strokeWidth={1.2} className="stroke-ink-soft/30" />
          <path
            d={`M16 60H${NW * 0.72}M16 82H${NW * 0.5}M16 104H${NW * 0.62}`}
            strokeWidth={1.2}
            strokeLinecap="round"
            className="stroke-ink-soft/25"
          />
        </g>
      ))}
    </svg>
  );
}

export default function DiagramSkeleton() {
  return (
    <div role="status" className="animate-pulse motion-reduce:animate-none">
      <span className="sr-only">Loading diagram</span>
      <Sketch layout={layouts.wide} className="hidden w-full min-[990px]:block" />
      <Sketch
        layout={layouts.tall}
        className="mx-auto block w-full max-w-[360px] min-[990px]:hidden"
      />
    </div>
  );
}