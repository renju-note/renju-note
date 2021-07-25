import { N_LINES, Point } from '../rule/foundation'

export type Degree = 0 | 90 | 180 | 270
export type Mirror = boolean

export const variants = (ps: Point[]): [Point[], Degree, Mirror][] => {
  return [
    [variant(ps, 0, false), 0, false],
    [variant(ps, 0, true), 0, true],
    [variant(ps, 90, false), 90, false],
    [variant(ps, 90, true), 90, true],
    [variant(ps, 180, false), 180, false],
    [variant(ps, 180, true), 180, true],
    [variant(ps, 270, false), 270, false],
    [variant(ps, 270, true), 270, true],
  ]
}

export const variant = (ps: Point[], degree: 0 | 90 | 180 | 270, mirror: boolean): Point[] => {
  const result: Point[] = []
  for (let i = 0; i < ps.length; i++) {
    const [x, y] = mirror ? [ps[i][1], ps[i][0]] : ps[i]
    switch (degree) {
      case 0:
        result[i] = [x, y]
        break
      case 90:
        result[i] = [y, N_PLUS_1 - x]
        break
      case 180:
        result[i] = [N_PLUS_1 - x, N_PLUS_1 - y]
        break
      case 270:
        result[i] = [N_PLUS_1 - y, x]
        break
      default:
        result[i] = [x, y]
    }
  }
  return result
}

const N_PLUS_1 = N_LINES + 1
