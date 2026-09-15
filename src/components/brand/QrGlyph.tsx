const SIZE = 21;

/** Deterministic PRNG so server and client render the same matrix. */
const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hash = (text: string) =>
  [...text].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7);

const inFinder = (x: number, y: number) => {
  const corners = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ];
  return corners.some(
    ([cx, cy]) => x >= cx - 1 && x <= cx + 7 && y >= cy - 1 && y <= cy + 7,
  );
};

const Finder = ({ x, y }: { x: number; y: number }) => (
  <g data-qr-finder>
    <rect
      fill="none"
      height="6"
      rx="1.6"
      stroke="currentColor"
      strokeWidth="1"
      width="6"
      x={x + 0.5}
      y={y + 0.5}
    />
    <rect
      fill="currentColor"
      height="3"
      rx="0.8"
      width="3"
      x={x + 2}
      y={y + 2}
    />
  </g>
);

/**
 * Illustrative QR seal. It is not a scannable code — it stands in for the
 * printed sticker artwork, and each module is tagged so it can be animated.
 */
export const QrGlyph = ({
  value,
  className = "size-20",
}: {
  value: string;
  className?: string;
}) => {
  const random = mulberry(hash(value));
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const on = random() > 0.52;
      if (on && !inFinder(x, y)) {
        cells.push({ x, y });
      }
    }
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      shapeRendering="geometricPrecision"
      viewBox={`-1 -1 ${SIZE + 2} ${SIZE + 2}`}
    >
      {cells.map((cell) => (
        <rect
          data-qr-cell
          fill="currentColor"
          height="0.86"
          key={`${cell.x}-${cell.y}`}
          rx="0.22"
          width="0.86"
          x={cell.x + 0.07}
          y={cell.y + 0.07}
        />
      ))}
      <Finder x={0} y={0} />
      <Finder x={SIZE - 7} y={0} />
      <Finder x={0} y={SIZE - 7} />
    </svg>
  );
};
