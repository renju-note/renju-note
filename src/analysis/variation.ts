import { N_LINES, Point } from '../rule/foundation'
import { Bitboard } from './bitboard'

export type Degree = 0 | 90 | 180 | 270
export type Mirror = boolean
export type Variant = [Degree, Mirror]
export type Variants = [Variant, Variant, Variant, Variant, Variant, Variant, Variant, Variant]

export const variants = [
  [0, false],
  [0, true],
  [90, false],
  [90, true],
  [180, false],
  [180, true],
  [270, false],
  [270, true],
]

export type PointsVariants = [
  Point[],
  Point[],
  Point[],
  Point[],
  Point[],
  Point[],
  Point[],
  Point[]
]

export const pointsVariants = (ps: Point[]): PointsVariants => {
  return [
    pointsVariant(ps, [0, false]),
    pointsVariant(ps, [0, true]),
    pointsVariant(ps, [90, false]),
    pointsVariant(ps, [90, true]),
    pointsVariant(ps, [180, false]),
    pointsVariant(ps, [180, true]),
    pointsVariant(ps, [270, false]),
    pointsVariant(ps, [270, true]),
  ]
}

export const pointsVariant = (ps: Point[], [degree, mirror]: Variant): Point[] => {
  const N = N_LINES + 1
  const result: Point[] = []
  for (let i = 0; i < ps.length; i++) {
    const [x, y] = mirror ? [ps[i][1], ps[i][0]] : ps[i]
    switch (degree) {
      case 0:
        result[i] = [x, y]
        break
      case 90:
        result[i] = [y, N - x]
        break
      case 180:
        result[i] = [N - x, N - y]
        break
      case 270:
        result[i] = [N - y, x]
        break
      default:
        result[i] = [x, y]
    }
  }
  return result
}

export type BitboardVariants = [
  Bitboard,
  Bitboard,
  Bitboard,
  Bitboard,
  Bitboard,
  Bitboard,
  Bitboard,
  Bitboard
]

export const emptyBitboardVariants = (): BitboardVariants => {
  return [
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
    new Bitboard(),
  ]
}

export const canonicalBitboardString = (bvs: BitboardVariants): string => {
  return minString(bvs.map(b => b.toString()))
}

const minString = (ss: string[]): string => {
  let min = ss[0]
  for (let i = 1; i < ss.length; i++) {
    if (ss[i] < min) min = ss[i]
  }
  return min
}
