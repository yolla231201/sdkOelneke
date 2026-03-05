const Loading = () => {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const size = 100;

  const toXY = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });

  // --- Solid arc: tapered using many small segments ---
  // From -90° (top/head) clockwise to 90° (bottom/mid)
  const arcSegments = 40;
  const arcParts = Array.from({ length: arcSegments }).map((_, i) => {
    const t       = i / arcSegments;            // 0 = head, 1 = junction
    const degA    = -90 + t * 180;
    const degB    = -90 + ((i + 1) / arcSegments) * 180;
    const p1      = toXY(degA);
    const p2      = toXY(degB);
    const sw      = 4.5 - t * 3.5;             // 4.5 at head → 1.0 at junction
    const opacity = 1 - t * 0.1;
    return { p1, p2, sw, opacity };
  });

  // --- Dot tail: 90° → ~265°, shrinking ---
  const numDots = 10;
  const dots = Array.from({ length: numDots }).map((_, i) => {
    const t     = i / (numDots - 1);           // 0 = near junction, 1 = tail end
    const angle = 90 + t * 170;
    const pos   = toXY(angle);
    const dotR  = 1.2 * (1 - t * 0.88);       // starts small (matches arc end), shrinks
    const opacity = 0.85 - t * 0.75;
    return { ...pos, dotR, opacity };
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-8">
        <div style={{ animation: "spinRing 1s linear infinite" }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>

            {/* Tapered solid arc */}
            {arcParts.map((seg, i) => (
              <line
                key={i}
                x1={seg.p1.x} y1={seg.p1.y}
                x2={seg.p2.x} y2={seg.p2.y}
                stroke="white"
                strokeWidth={seg.sw}
                strokeLinecap="round"
                opacity={seg.opacity}
              />
            ))}

            {/* Shrinking dot tail */}
            {dots.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.dotR}
                fill="white"
                opacity={d.opacity}
              />
            ))}
          </svg>
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-zinc-600">
          Loading
        </p>
      </div>

      <style>{`
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;