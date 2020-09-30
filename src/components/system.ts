import { createContext } from 'react'

import { Point, N_LINES } from '../rule'

const N = N_LINES

export type BoardWidth = 640 | 360 | 320

export type BoardCoordinate = [number, number]

export class System {
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
    return this.P + (N - y) * this.C
  }

  c ([x, y]: Point): BoardCoordinate {
    return [this.cx(x), this.cy(y)]
  }
}

export const SystemContext = createContext<System>(new System(640))
