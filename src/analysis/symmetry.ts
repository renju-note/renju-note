import { BOARD_SIZE, Point } from 'renjukit'
import { Bitboard } from './bitboard'

export type VariantId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type Reversed = boolean
export type Rotation = 0 | 90 | 180 | 270
export type Variant = {
  id: VariantId
  reversed: Reversed
  rotation: Rotation
}
export type Variants = [Variant, Variant, Variant, Variant, Variant, Variant, Variant, Variant]

export const variants: Variants = [
  { id: 0, reversed: false, rotation: 0 },
  { id: 1, reversed: true, rotation: 0 },
  { id: 2, reversed: false, rotation: 90 },
  { id: 3, reversed: true, rotation: 90 },
  { id: 4, reversed: false, rotation: 180 },
  { id: 5, reversed: true, rotation: 180 },
  { id: 6, reversed: false, rotation: 270 },
  { id: 7, reversed: true, rotation: 270 },
]

export const inverseVariantId = (v: VariantId): VariantId => {
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
  return variants.map(v =>
    ps.map(p => pointVariantRaw(p, v.reversed, v.rotation))
  ) as PointsVariants
}

export const pointVariant = (p: Point, v: VariantId): Point => {
  const { reversed, rotation } = variants[v]
  return pointVariantRaw(p, reversed, rotation)
}

const pointVariantRaw = (p: Point, reversed: Reversed, rotation: Rotation): Point => {
  const N = BOARD_SIZE - 1
  const [x, y] = reversed ? [p[1], p[0]] : p
  switch (rotation) {
    case 0:
      return [x, y]
    case 90:
      return [y, N - x]
    case 180:
      return [N - x, N - y]
    case 270:
      return [N - y, x]
    default:
      return [x, y]
  }
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
