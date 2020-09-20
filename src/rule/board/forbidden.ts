import { Point } from '../foundation'
import { Square, SquareRow } from './square'

export const forbiddenKinds = ['doubleThree', 'doubleFour', 'overline'] as const
export type ForbiddenKind = typeof forbiddenKinds[number]

export const forbidden = (square: Square, point: Point): ForbiddenKind | undefined => {
  if (overline(square, point)) {
    return 'overline'
  } else if (doubleFour(square, point)) {
    return 'doubleFour'
  } else if (doubleThree(square, point)) {
    return 'doubleThree'
  }
}

const overline = (square: Square, point: Point): boolean => {
  return square.put(true, point).rows.get(true, 'overline').length > 0
}

const doubleFour = (square: Square, point: Point): boolean => {
  const newFours = square.put(true, point).rows.get(true, 'four').filter(r => between(point, r))
  if (newFours.length < 2) return false

  // checking not open four
  return distinct(newFours).length >= 2
}

const doubleThree = (square: Square, point: Point): boolean => {
  const next = square.put(true, point)
  const newThrees = next.rows.get(true, 'three').filter(r => between(point, r))
  if (newThrees.length < 2) return false

  // checking not fake three
  const trueThrees = newThrees.filter(t => !forbidden(next, t.eyes[0]))
  if (trueThrees.length < 2) return false

  // checking not open three
  return distinct(trueThrees).length >= 2
}

const between = (p: Point, r: SquareRow): boolean => {
  const [s, e] = [r.start, r.end]
  switch (r.direction) {
    case 'vertical':
      return p[0] === s[0] && (s[1] <= p[1] && p[1] <= e[1])
    case 'horizontal':
      return p[1] === s[1] && (s[0] <= p[0] && p[0] <= e[0])
    case 'ascending':
      return (s[0] <= p[0] && p[0] <= e[0]) && (p[0] - s[0] === p[1] - s[1])
    case 'descending':
      return (s[0] <= p[0] && p[0] <= e[0]) && (p[0] - s[0] === s[1] - p[1])
  }
}

const distinct = (srows: SquareRow[]): SquareRow[] => {
  const result: SquareRow[] = []
  for (let i = 0; i < srows.length; i++) {
    const srow = srows[i]
    if (result.findIndex(r => adjacent(srow, r)) < 0) {
      result.push(srow)
    }
  }
  return result
}

const adjacent = (a: SquareRow, b: SquareRow): boolean => {
  if (a.direction !== b.direction) return false
  const [xd, yd] = [a.start[0] - b.start[0], a.start[1] - b.start[1]]
  switch (a.direction) {
    case 'vertical':
      return xd === 0 && Math.abs(yd) === 1
    case 'horizontal':
      return Math.abs(xd) === 1 && yd === 0
    case 'ascending':
      return Math.abs(xd) === 1 && xd === yd
    case 'descending':
      return Math.abs(xd) === 1 && xd === -yd
  }
}
