import { useMemo } from 'react'
import { makeQrMatrix } from '../../utils/ticket'

export default function QrCode({ seed, className = 'h-28 w-28' }) {
  const matrix = useMemo(() => makeQrMatrix(seed), [seed])
  const size = matrix.length
  const scale = 4

  return (
    <svg
      viewBox={`0 0 ${size * scale} ${size * scale}`}
      className={className}
      role="img"
      aria-label="Bilet QR kodu"
    >
      {matrix.flatMap((row, y) =>
        row.map((v, x) =>
          v ? (
            <rect
              key={`${x}-${y}`}
              x={x * scale}
              y={y * scale}
              width={scale}
              height={scale}
              fill="currentColor"
            />
          ) : null
        )
      )}
    </svg>
  )
}