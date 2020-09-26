import { N_LINES, Point } from '../../rule'

export const N = N_LINES

export const INDICES = new Array(N_LINES).fill(null).map((_, i) => i + 1)

export const cx = (x: number, C: number): number => x * C
export const cy = (y: number, C: number): number => (N - y + 1) * C

// center of the point
export const center = ([x, y]: Point, C: number): [number, number] => [cx(x, C), cy(y, C)]

// square around center of the point
export const square = ([x, y]: Point, C: number): [[number, number], [number, number]] => {
  const [cx, cy] = center([x, y], C)
  return [
    [cx - C / 2, cy - C / 2],
    [cx + C / 2, cy + C / 2],
  ]
}
