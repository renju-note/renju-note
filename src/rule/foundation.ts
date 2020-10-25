export const N_LINES = 15

export const X_CODES = 'ABCDEFGHIJKLMNO'

export type Point = [number, number]

export const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]

export const xCode = (x: number) => X_CODES.charAt(x - 1)

export const yCode = (x: number) => x.toString()

export const code = ([x, y]: Point): string => `${xCode(x)}${yCode(y)}`

export const parsePoint = (code: string): Point | undefined => {
  const x = X_CODES.indexOf(code[0].toUpperCase()) + 1
  const y = parseInt(code.slice(1))
  if (x < 1 || N_LINES < x || y < 1 || N_LINES < y) return undefined
  return [x, y]
}

export const parsePoints = (code: string): Point[] | undefined => {
  const codes = Array.from(code.matchAll(/[a-zA-Z][0-9]+/g)).map(m => m[0])
  const points: Point[] = []
  for (let i = 0; i < codes.length; i++) {
    const p = parsePoint(codes[i])
    if (p === undefined) return undefined
    points.push(p)
  }
  return points
}
