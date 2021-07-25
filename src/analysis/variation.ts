import { N_LINES, Point } from '../rule/foundation'
import { Bitboard } from './bitboard'

export type VariantId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Mirrored = boolean
export type Degree = 0 | 90 | 180 | 270
export type Variant = {
  id: VariantId
  mirrored: Mirrored
  degree: Degree
}
export type Variants = [Variant, Variant, Variant, Variant, Variant, Variant, Variant, Variant]

export const variants: Variants = [
  { id: 0, mirrored: false, degree: 0 },
  { id: 1, mirrored: true, degree: 0 },
  { id: 2, mirrored: false, degree: 90 },
  { id: 3, mirrored: true, degree: 90 },
  { id: 4, mirrored: false, degree: 180 },
  { id: 5, mirrored: true, degree: 180 },
  { id: 6, mirrored: false, degree: 270 },
  { id: 7, mirrored: true, degree: 270 },
]

export const reverseVariantId = (v: VariantId): VariantId => {
  return [0, 1, 6, 3, 4, 5, 2, 7][v] as VariantId
}

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
  return variants.map(v => pointsVariant(ps, v.mirrored, v.degree)) as PointsVariants
}

const pointsVariant = (ps: Point[], mirror: Mirrored, degree: Degree): Point[] => {
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

export const toBitboardVariants = (movesVariants: PointsVariants): BitboardVariants => {
  const ret = emptyBitboardVariants()
  for (let v = 0; v < movesVariants.length; v++) {
    ret[v].putMovesMut(true, movesVariants[v])
  }
  return ret
}

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

export const canonicalBitboard = (bvs: BitboardVariants): [VariantId, Bitboard] => {
  const v = minString(bvs.map(b => b.toString()))[0] as VariantId
  return [v, bvs[v]]
}

export const canonicalBitboardString = (bvs: BitboardVariants): [VariantId, string] => {
  return minString(bvs.map(b => b.toString())) as [VariantId, string]
}

const minString = (ss: string[]): [number, string] => {
  let minI = 0
  let minS = ss[0]
  for (let i = 1; i < ss.length; i++) {
    if (ss[i] < minS) {
      minI = i
      minS = ss[i]
    }
  }
  return [minI, minS]
}
