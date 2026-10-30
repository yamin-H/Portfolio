export default function CornerFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const c = "absolute h-4 w-4 border-accent";
    return (
        <div className={`relative ${className}`}>
            <span className={`${c} left-0 top-0 border-l border-t`} />
            <span className={`${c} right-0 top-0 border-r border-t`} />
            <span className={`${c} bottom-0 left-0 border-b border-l`} />
            <span className={`${c} bottom-0 right-0 border-b border-r`} />
            {children}
        </div>
    );
}