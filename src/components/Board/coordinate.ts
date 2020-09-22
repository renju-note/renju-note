import { N_LINES, Point } from '../../rule'

export const N = N_LINES

export const INDICES = new Array(N_LINES).fill(null).map((_, i) => i + 1)

// cell size
export const C = 40

export const WIDTH = (N + 1) * C

export const cx = (x: number): number => x * C
export const cy = (y: number): number => (N - y + 1) * C

// center of the point
export const center = ([x, y]: Point): [number, number] => [cx(x), cy(y)]

// square around center of the point
export const square = ([x, y]: Point): [[number, number], [number, number]] => {
  const [cx, cy] = center([x, y])
  return [
    [cx - C / 2, cy - C / 2],
    [cx + C / 2, cy + C / 2],
  ]
}
