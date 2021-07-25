import { N_LINES, Point } from '../rule/foundation'

export class Bitboard {
  private readonly vlines: number[] = new Array(N_LINES).fill(0)

  putMut(black: boolean, [x, y]: Point) {
    this.vlines[x - 1] += (black ? 0b01 : 0b10) << (2 * (y - 1))
  }

  toString(): string {
    let result = ''
    let skip = 0
    for (const vline of this.vlines) {
      if (vline === 0) {
        skip++
      } else {
        if (skip !== 0) {
          result += skip.toString(16) + '.'
          skip = 0
        }
        result += vline.toString(16) + '/'
        skip = 0
      }
    }
    return result
  }
}
