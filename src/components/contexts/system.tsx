import { ButtonProps } from '@chakra-ui/react'
import React, { createContext, FC, useMemo } from 'react'
import { encode, N_LINES, Point, xCode, yCode } from '../../rule'

export type BoardWidth = 640 | 360 | 320

export type BoardCoordinate = [number, number]

export class System {
  readonly N: number = N_LINES
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
    return this.P + (x - 1) * this.C
  }

  cy(y: number): number {
    return this.P + (this.N - y) * this.C
  }

  c([x, y]: Point): BoardCoordinate {
    return [this.cx(x), this.cy(y)]
  }

  p([bx, by]: [number, number]): Point {
    return [adjust((bx - this.P) / this.C + 1), adjust((this.W - by - this.P) / this.C + 1)]
  }

  xCode(x: number): string {
    return xCode(x)
  }

  yCode(y: number): string {
    return yCode(y)
  }

  code([x, y]: Point): string {
    return encode([x, y])
  }

  get indices(): number[] {
    return new Array(this.N).fill(null).map((_, i) => i + 1)
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

  get forbiddenStrokeWidth(): number {
    switch (this.W) {
      case 320:
        return 4
      case 360:
        return 4
      case 640:
        return 5
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

export const SystemProvider: FC = ({ children }) => {
  const system = useMemo(() => new System(window.innerWidth), [])
  return <SystemContext.Provider value={system}>{children}</SystemContext.Provider>
}

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), N_LINES)
