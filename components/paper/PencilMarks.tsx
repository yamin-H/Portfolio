const G = "#4a4234"; // graphite
const B = "#2f4bff"; // accent, used sparingly

export default function PencilMarks() {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* construction circle with centre lines and a radius */}
      <g stroke={G} strokeOpacity={0.5} strokeWidth={1}>
        <circle cx={1050} cy={480} r={170} />
        <path d="M830 480H1270M1050 260V700" strokeDasharray="14 5 2 5" />
        <path d="M1050 480L1197 395" />
        <path d="M1050 220A260 260 0 0 1 1310 480" strokeDasharray="4 6" />
      </g>
      <g className="font-mono" fontSize={11} letterSpacing={2}>
        <text x={1112} y={424} fill={B} fillOpacity={0.7}>R 170</text>
        <text x={1318} y={474} fill={G} fillOpacity={0.5}>± 0.02</text>
      </g>

      {/* isometric construction cube, with the 30° angle */}
      <g stroke={G} strokeOpacity={0.5} strokeWidth={1}>
        <path d="M380 450L475 505V615L380 670L285 615V505Z" />
        <path d="M285 505L380 560L475 505M380 560V670" />
        <path d="M200 560H640" strokeDasharray="14 5 2 5" />
        <path d="M380 560L545 465" strokeDasharray="4 6" />
        <path d="M440 560A60 60 0 0 0 432 530" />
      </g>
      <text
        x={452}
        y={548}
        className="font-mono"
        fontSize={11}
        letterSpacing={2}
        fill={B}
        fillOpacity={0.7}
      >
        30°
      </text>

      {/* horizontal dimension line */}
      <g stroke={B} strokeOpacity={0.5} strokeWidth={1}>
        <path d="M200 782V816M620 782V816" />
        <path d="M200 800H620" />
        <path d="M212 795L200 800L212 805M608 795L620 800L608 805" />
      </g>
      <text
        x={410}
        y={791}
        textAnchor="middle"
        className="font-mono"
        fontSize={11}
        letterSpacing={2}
        fill={B}
        fillOpacity={0.7}
      >
        420
      </text>

      {/* vertical dimension line */}
      <g stroke={B} strokeOpacity={0.5} strokeWidth={1}>
        <path d="M1384 300H1418M1384 700H1418" />
        <path d="M1400 300V700" />
        <path d="M1395 312L1400 300L1405 312M1395 688L1400 700L1405 688" />
      </g>
      <text
        x={1388}
        y={500}
        transform="rotate(-90 1388 500)"
        textAnchor="middle"
        className="font-mono"
        fontSize={11}
        letterSpacing={2}
        fill={B}
        fillOpacity={0.7}
      >
        400
      </text>

      {/* a design curve with its control handles */}
      <g stroke={G} strokeOpacity={0.5} strokeWidth={1}>
        <path d="M640 330C740 180 860 180 960 300" />
        <path d="M640 330L740 180M960 300L860 180" strokeDasharray="3 5" />
        <rect x={636} y={326} width={8} height={8} />
        <rect x={956} y={296} width={8} height={8} />
        <circle cx={740} cy={180} r={3.5} />
        <circle cx={860} cy={180} r={3.5} />
      </g>

      {/* registration marks */}
      <g stroke={G} strokeOpacity={0.45} strokeWidth={1}>
        <circle cx={120} cy={120} r={10} />
        <path d="M96 120H144M120 96V144" />
        <circle cx={1480} cy={880} r={10} />
        <path d="M1456 880H1504M1480 856V904" />
      </g>

      {/* title-block notes */}
      <g className="font-mono" fontSize={10} letterSpacing={2.4} fill={G} fillOpacity={0.5}>
        <text x={1290} y={150}>FIG. 07</text>
        <text x={1290} y={168}>SCALE 1 : 1</text>
        <text x={160} y={870}>SHEET 1 / 1</text>
      </g>
    </svg>
  );
}