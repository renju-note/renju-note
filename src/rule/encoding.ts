import { N_LINES, Point } from './foundation'

export const xCode = (x: number) => X_CODES.charAt(x - 1)

export const yCode = (x: number) => x.toString()

export const decodePoints = (code: string): Point[] | undefined => {
  const codes = code.match(/[a-oA-O][0-9]+/g)
  if (!codes) return
  const points: Point[] = []
  for (const c of codes) {
    const p = decode(c)
    if (p === undefined) return undefined
    points.push(p)
  }
  return points
}

export const encode = ([x, y]: Point): string => `${xCode(x)}${yCode(y)}`

const decode = (code: string): Point | undefined => {
  const x = X_CODE_TO_NUM[code[0]]
  const y = parseInt(code.slice(1))
  if (
    x === undefined ||
    y === undefined ||
    isNaN(y) ||
    x < 1 ||
    N_LINES < x ||
    y < 1 ||
    N_LINES < y
  ) return undefined
  return [x, y]
}

const X_CODES = 'ABCDEFGHIJKLMNO'

const X_CODE_TO_NUM: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
  O: 15,
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
}
