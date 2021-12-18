import { decodePoint, Point, wrapPoint } from 'renjukit'
import {
  canonicalBitboard,
  inverseVariantId,
  pointsVariants,
  pointVariant,
  toBitboardVariants,
} from './symmetry'

export type GameRecord = {
  moves: Point[]
  blackWon?: boolean | null
  whiteWon?: boolean | null
}

export type GamesStat = {
  all: number
  blackWon: number
  whiteWon: number
  draw: number
}

export const calcStat = (records: GameRecord[]): GamesStat => {
  let blackWon = 0
  let whiteWon = 0
  let draw = 0
  for (const record of records) {
    if (record.blackWon) {
      blackWon += 1
    } else if (record.whiteWon) {
      whiteWon += 1
    } else {
      draw += 1
    }
  }
  return { all: records.length, blackWon, whiteWon, draw }
}

export const calcStatByNextMove = (records: GameRecord[], query: Point[]): [Point, GamesStat][] => {
  const dataset = records.map(record => record.moves.slice(0, query.length + 1))
  const groups = groupByNextMove(query, dataset)
  const stats: [Point, GamesStat][] = groups.map(([point, indices]) => {
    const subRecords = indices.map(i => records[i])
    const stat = calcStat(subRecords)
    return [point, stat]
  })
  return stats.sort((a, b) => b[1].all - a[1].all)
}

const groupByNextMove = (query: Point[], dataset: Point[][]): [Point, number[]][] => {
  const queryLength = query.length
  const mapByPointCode = new Map<number, number[]>()
  for (let i = 0; i < dataset.length; i++) {
    const moves = dataset[i]
    if (moves.length <= queryLength) continue
    const [headMoves, nextMove] = [moves.slice(0, queryLength), moves[queryLength]]
    const headMovesVariants = pointsVariants(headMoves)
    const canonicalVariantId = canonicalBitboard(toBitboardVariants(headMovesVariants))[0]
    const canonicalNextMove = pointVariant(nextMove, canonicalVariantId)
    const pointCode = wrapPoint(canonicalNextMove).encode()
    const item = mapByPointCode.get(pointCode)
    if (item === undefined) {
      mapByPointCode.set(pointCode, [i])
    } else {
      item.push(i)
    }
  }

  const queryVariantId = canonicalBitboard(toBitboardVariants(pointsVariants(query)))[0]
  const inversedVariantId = inverseVariantId(queryVariantId)
  const mapByBoardCode = new Map<string, [Point, number[]]>()
  for (const [code, indices] of Array.from(mapByPointCode.entries())) {
    const nextMove = pointVariant(decodePoint(code)!, inversedVariantId)
    const moves = [...query, nextMove]
    const boardCode = canonicalBitboard(toBitboardVariants(pointsVariants(moves)))[1].toString()
    const item = mapByBoardCode.get(boardCode)
    if (item === undefined) {
      mapByBoardCode.set(boardCode, [nextMove, indices])
    } else {
      if (wrapPoint(nextMove).encode() < wrapPoint(item[0]).encode()) item[0] = nextMove
      item[1].push(...indices)
    }
  }

  return Array.from(mapByBoardCode.values())
}
