import { BOARD_SIZE, Point } from 'renjukit'

export class Bitboard {
  private readonly vlines: number[] = new Array(BOARD_SIZE).fill(0)

  putMut(black: boolean, [x, y]: Point) {
    this.vlines[x] += (black ? 0b01 : 0b10) << (2 * y)
  }

  putMovesMut(blackFirst: boolean, moves: Point[]) {
    let black = blackFirst
    for (const move of moves) {
      this.putMut(black, move)
      black = !black
    }
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
