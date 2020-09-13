import { Point, Segment, Square, ithPoint } from './square'
import { Row } from './row'

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
  return square.put(true, point).getRows(true, 'overline').length > 0
}

const doubleFour = (square: Square, point: Point): boolean => {
  const newFours = square.put(true, point).getRows(true, 'four').filter(([s, _]) => onSegment(point, s))
  if (newFours.length < 2) return false

  // checking not open four
  return distinct(newFours.map(([seg, _]) => seg)).length >= 2
}

const doubleThree = (square: Square, point: Point): boolean => {
  const nextSquare = square.put(true, point)
  const newThrees = nextSquare.getRows(true, 'three').filter(([s, _]) => onSegment(point, s))
  if (newThrees.length < 2) return false

  // checking not fake three
  const trueThrees: [Segment, Row][] = []
  for (let i = 0; i < newThrees.length; i++) {
    const [seg, row] = newThrees[i]
    const eyep = ithPoint(seg, row.eyes[0])
    if (!forbidden(nextSquare, eyep)) {
      trueThrees.push([seg, row])
    }
  }
  if (trueThrees.length < 2) return false

  // checking not open three
  return distinct(newThrees.map(([seg, _]) => seg)).length >= 2
}

const onSegment = (p: Point, segment: Segment): boolean => {
  const [s, l] = [segment.start, segment.size]
  switch (segment.direction) {
    case 'vertical':
      return p[0] === s[0] && (s[1] <= p[1] && p[1] < (s[1] + l))
    case 'horizontal':
      return p[1] === s[1] && (s[0] <= p[0] && p[0] < (s[0] + l))
    case 'ascending':
      return (s[0] <= p[0] && p[0] < (s[0] + l)) && (p[0] - s[0] === p[1] - s[1])
    case 'descending':
      return (s[0] <= p[0] && p[0] < (s[0] + l)) && (p[0] - s[0] === s[1] - p[1])
  }
}

const distinct = (segments: Segment[]): Segment[] => {
  const result: Segment[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (result.findIndex(s => adjacent(seg, s)) < 0) {
      result.push(seg)
    }
  }
  return result
}

const adjacent = (a: Segment, b: Segment): boolean => {
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
