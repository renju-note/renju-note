import { ButtonProps } from '@chakra-ui/core'
import { createContext } from 'react'
import { N_LINES, Point } from '../rule'

export type BoardWidth = 640 | 360 | 320

export type BoardCoordinate = [number, number]

export class System {
  readonly N: number = N_LINES
  readonly W: BoardWidth
  readonly C: number // cell size
  readonly P: number // padding

  constructor (windowInnerWidth: number) {
    if (windowInnerWidth >= 640) {
      this.W = 640
      this.C = 40
      this.P = 40
    } else if (windowInnerWidth >= 360) {
      this.W = 360
      this.C = 24
      this.P = 12
    } else {
      this.W = 320
      this.C = 20
      this.P = 20
    }
  }

  cx (x: number): number {
    return this.P + (x - 1) * this.C
  }

  cy (y: number): number {
    return this.P + (this.N - y) * this.C
  }

  c ([x, y]: Point): BoardCoordinate {
    return [this.cx(x), this.cy(y)]
  }

  p ([bx, by]: [number, number]): Point {
    return [
      adjust((bx - this.P) / this.C + 1),
      adjust((this.W - by - this.P) / this.C + 1),
    ]
  }

  className (black: boolean): string {
    return black ? 'black' : 'white'
  }

  xCode (x: number): string {
    return 'ABCDEFGHIJKLMNO'.charAt(x - 1)
  }

  yCode (x: number, padZero: boolean = false): string {
    const s = x.toString()
    return padZero ? s.padStart(2, '0') : s
  }

  code ([x, y]: Point, padZero: boolean = false): string {
    return `${this.xCode(x)}${this.yCode(y, padZero)}`
  }

  get indices (): number[] {
    return new Array(this.N).fill(null).map((_, i) => i + 1)
  }

  get buttonSize (): ButtonProps['size'] {
    switch (this.W) {
      case 320:
        return 'sm'
      case 360:
        return 'sm'
      case 640:
        return 'lg'
    }
  }
}

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), N_LINES)

export const SystemContext = createContext<System>(new System(640))
