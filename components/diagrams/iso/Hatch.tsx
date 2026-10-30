export default function Hatch({
  lines,
  className,
}: {
  lines: { x: number; y1: number; y2: number }[];
  className: string;
}) {
    return (
        <>
            {lines.map((l, i) => (
                <line
                    key={i}
                    x1={l.x}
                    y1={l.y1}
                    x2={l.x}
                    y2={l.y2}
                    strokeWidth={0.9}
                    className={className}
                />
            ))}
        </>
    );
}