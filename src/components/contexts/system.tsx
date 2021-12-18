import { ButtonProps } from '@chakra-ui/react'
import { createContext, FC, useMemo } from 'react'
import { BOARD_SIZE, Point } from 'renjukit'

export type BoardWidth = 640 | 360 | 320

export type BoardCoordinate = [number, number]

export class System {
  readonly N: number = BOARD_SIZE
  readonly W: BoardWidth
  readonly C: number // cell size
  readonly P: number // padding

  constructor(windowInnerWidth: number) {
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

  cx(x: number): number {
    return this.P + x * this.C
  }

  cy(y: number): number {
    return this.P + (this.N - 1 - y) * this.C
  }

  c([x, y]: Point): BoardCoordinate {
    return [this.cx(x), this.cy(y)]
  }

  p([bx, by]: [number, number]): Point {
    return [adjust((bx - this.P) / this.C), adjust((this.W - by - this.P) / this.C)]
  }

  get indices(): number[] {
    return new Array(this.N).fill(null).map((_, i) => i)
  }

  get buttonSize(): ButtonProps['size'] {
    switch (this.W) {
      case 320:
        return 'sm'
      case 360:
        return 'sm'
      case 640:
        return 'lg'
    }
  }

  get rulerStrokeWidth(): number {
    switch (this.W) {
      case 320:
        return 1
      case 360:
        return 1
      case 640:
        return 2
    }
  }

  get stoneStrokeWidth(): number {
    switch (this.W) {
      case 320:
        return 1.5
      case 360:
        return 1.5
      case 640:
        return 2
    }
  }

  get indexFontSize(): string {
    switch (this.W) {
      case 320:
        return '8px'
      case 360:
        return '8px'
      case 640:
        return '16px'
    }
  }

  get indexPadding(): number {
    switch (this.W) {
      case 320:
        return 1
      case 360:
        return 1
      case 640:
        return 2
    }
  }

  get orderFontSize(): string {
    switch (this.W) {
      case 320:
        return '12px'
      case 360:
        return '12px'
      case 640:
        return '16px'
    }
  }

  get markerFontSize(): string {
    switch (this.W) {
      case 320:
        return '12px'
      case 360:
        return '12px'
      case 640:
        return '20px'
    }
  }

  get propertyRowStrokeWidth(): number {
    switch (this.W) {
      case 320:
        return 3
      case 360:
        return 3
      case 640:
        return 4
    }
  }

  get propertyRowStrokeDasharray(): string {
    switch (this.W) {
      case 320:
        return '1 4'
      case 360:
        return '1 4'
      case 640:
        return '3 5'
    }
  }
}

export const SystemContext = createContext<System>(new System(640))

export const SystemContextProvider: FC = ({ children }) => {
  const system = useMemo(() => new System(window.innerWidth), [])
  return <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
}

const adjust = (n: number): number => Math.min(Math.max(0, Math.round(n)), BOARD_SIZE - 1)
