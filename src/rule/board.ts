import { Point, N_INDICES } from './foundation'
import { Line } from './line'

export type LineGroupType = 'vertical' | 'horizontal' | 'ascending' | 'descending'

export type LineGroupCoordinate = [number, number]

export class Board {
  readonly moves: Point[]
  readonly lineGroups: Record<LineGroupType, LineGroup>
  readonly blackProps: BoardProps
  readonly whiteProps: BoardProps

  constructor (init?: Pick<Board, 'moves' | 'lineGroups'>) {
    if (init === undefined) {
      this.moves = []
      this.lineGroups = {
        vertical: new LineGroup('vertical'),
        horizontal: new LineGroup('horizontal'),
        ascending: new LineGroup('ascending'),
        descending: new LineGroup('descending'),
      }
    } else {
      this.moves = init.moves
      this.lineGroups = init.lineGroups
    }

    this.blackProps = this.computeBlackProps()
    this.whiteProps = this.computeWhiteProps()
  }

  move (p: Point): Board {
    if (this.occupied(p)) throw new Error('Already occupied')
    const moves = [...this.moves, p]

    const black = this.blackTurn()
    const lineGroups = {
      vertical: this.lineGroups.vertical.add(black, p),
      horizontal: this.lineGroups.horizontal.add(black, p),
      ascending: this.lineGroups.ascending.add(black, p),
      descending: this.lineGroups.descending.add(black, p)
    }

    return new Board({ moves, lineGroups })
  }

  occupied ([x, y]: Point): boolean {
    return this.moves.findIndex(m => m[0] === x && m[1] === y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  blackWon (): boolean {
    return this.blackProps.fives.length > 0
  }

  whiteWon (): boolean {
    return this.whiteProps.fives.length > 0
  }

  private computeBlackProps (): BoardProps {
    return {
      fives: this.lineGroupArray().flatMap(
        lg => lg.blackProps.fives.map(
          x => {
            return { type_: lg.type_, coordinate: x }
          }
        )
      )
    }
  }

  private computeWhiteProps (): BoardProps {
    return {
      fives: this.lineGroupArray().flatMap(
        lg => lg.whiteProps.fives.map(
          x => {
            return { type_: lg.type_, coordinate: x }
          }
        )
      )
    }
  }

  private lineGroupArray (): LineGroup[] {
    return [
      this.lineGroups.vertical,
      this.lineGroups.horizontal,
      this.lineGroups.ascending,
      this.lineGroups.descending,
    ]
  }
}

export type BoardProps = {
  fives: {type_: LineGroupType, coordinate: LineGroupCoordinate}[]
}

export class LineGroup {
  readonly type_: LineGroupType
  readonly lines: Line[]
  readonly blackProps: LineGroupProps
  readonly whiteProps: LineGroupProps

  constructor (init: LineGroupType | Pick<LineGroup, 'type_' | 'lines'>) {
    if (typeof init === 'string') {
      this.type_ = init
      if (init === 'vertical' || init === 'horizontal') {
        this.lines = newOrthogonalLines()
      } else {
        this.lines = newDiagonalLines()
      }
    } else {
      this.type_ = init.type_
      this.lines = init.lines
    }

    this.blackProps = this.computeBlackProps()
    this.whiteProps = this.computeWhiteProps()
  }

  add (black: boolean, p: Point): LineGroup {
    let i: number, j: number
    switch (this.type_) {
      case 'vertical':
        [i, j] = p2v(p)
        break
      case 'horizontal':
        [i, j] = p2h(p)
        break
      case 'ascending':
        [i, j] = p2a(p)
        break
      case 'descending':
        [i, j] = p2d(p)
        break
    }

    const newLine = this.lines[i].add(black, j)
    if (!newLine) throw new Error('Wrong move')
    const lines = this.lines.map((l, li) => li === i ? newLine : l)

    return new LineGroup({ type_: this.type_, lines })
  }

  private computeBlackProps (): LineGroupProps {
    return {
      fives: this.lines.flatMap(
        (l, i) => l.blackProps.fives.map(
          j => [i, j] as [number, number]
        )
      )
    }
  }

  private computeWhiteProps (): LineGroupProps {
    return {
      fives: this.lines.flatMap(
        (l, i) => l.whiteProps.fives.map(
          j => [i, j] as LineGroupCoordinate
        )
      )
    }
  }
}

export type LineGroupProps = {
  fives: LineGroupCoordinate[]
}

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

const newOrthogonalLines = (): Line[] => new Array(N_INDICES).fill(null).map(
  () => new Line(N_INDICES)
)

const newDiagonalLines = (): Line[] => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i) => {
    const size = i < N_INDICES ? i + 1 : N_DIAGONAL_LINES - i
    return new Line(size)
  }
)

type PointToCoordinate = ([x, y]: Point) => LineGroupCoordinate

const p2v: PointToCoordinate = ([x, y]) => [x - 1, y - 1]

const p2h: PointToCoordinate = ([x, y]) => [y - 1, x - 1]

const p2a: PointToCoordinate = ([x, y]) => {
  const i = (x - 1) + (N_INDICES - y)
  const j = i < N_INDICES ? x : (y - 1)
  return [i, j]
}

const p2d: PointToCoordinate = ([x, y]) => {
  const i = (x - 1) + (y - 1)
  const j = i < N_INDICES ? x : (N_INDICES - y)
  return [i, j]
}
