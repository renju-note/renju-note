import { Point, equal } from '../rule'

type FreeLine = [Point, Point]

export class FreeLinesState {
  readonly lines: FreeLine[]
  readonly start: Point | undefined

  constructor (
    init:
      | {}
      | Pick<FreeLinesState, 'lines' | 'start'>
  ) {
    this.lines = 'lines' in init ? init.lines : []
    this.start = 'start' in init ? init.start : undefined
  }

  draw (p: Point): FreeLinesState {
    if (this.start === undefined) {
      return this.update({ start: p })
    }

    const line: FreeLine = [this.start, p]
    if (this.has(line) || !this.valid(line)) {
      return this.update({ start: undefined })
    }
    return this.update({
      lines: [...this.lines, line],
      start: undefined
    })
  }

  undo (): FreeLinesState {
    if (this.start !== undefined) {
      return this.update({ start: undefined })
    }
    return this.update({
      lines: this.lines.slice(0, this.lines.length - 1),
    })
  }

  get canUndo (): boolean {
    return this.start !== undefined || this.lines.length > 0
  }

  private update (
    fields: Partial<Pick<FreeLinesState, 'lines' | 'start'>>
  ): FreeLinesState {
    return new FreeLinesState({
      lines: fields.lines ?? this.lines,
      start: fields.start ?? this.start,
    })
  }

  private has ([start, end]: FreeLine): boolean {
    return this.lines.findIndex(
      ([s, e]) => (equal(start, s) && equal(end, e)) || (equal(start, e) && equal(end, s))
    ) >= 0
  }

  private valid ([start, end]: FreeLine): boolean {
    if (equal(start, end)) return false
    const [sx, sy] = start
    const [ex, ey] = end
    return (
      (sx === ex) || // vertical
      (sy === ey) || // horizontal
      (ex - sx === ey - sy) || // ascending
      (ex - sx === sy - ey) // descending
    )
  }
}
