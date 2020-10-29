import { Point, equal, parsePoints, code } from '../rule'

type FreeLine = [Point, Point]

export class FreeLinesState {
  readonly lines: FreeLine[]
  readonly start: Point | 'empty'

  constructor (
    init:
      | {}
      | Pick<FreeLinesState, 'lines' | 'start'>
  ) {
    this.lines = 'lines' in init ? init.lines : []
    this.start = 'start' in init ? init.start : 'empty'
  }

  static fromCode (code: string): FreeLinesState | undefined {
    const points = parsePoints(code)
    if (!points) return undefined
    if (points.length % 2 !== 0) return undefined
    const lines: FreeLine[] = []
    for (let i = 0; i < points.length / 2; i++) {
      const l: FreeLine = [points[i * 2], points[i * 2 + 1]]
      if (valid(l) && !includes(lines, l)) lines.push(l)
    }
    return new FreeLinesState({ lines: lines })
  }

  draw (p: Point): FreeLinesState {
    if (this.start === 'empty') {
      return this.update({ start: p })
    }

    const line: FreeLine = [this.start, p]
    if (this.has(line) || !valid(line)) {
      return this.update({ start: 'empty' })
    }
    return this.update({
      lines: [...this.lines, line],
      start: 'empty',
    })
  }

  undo (): FreeLinesState {
    if (this.start !== 'empty') {
      return this.update({ start: 'empty' })
    }
    return this.update({
      lines: this.lines.slice(0, this.lines.length - 1),
    })
  }

  unstart (): FreeLinesState {
    return this.update({ start: 'empty' })
  }

  get canUndo (): boolean {
    return this.start !== 'empty' || this.lines.length > 0
  }

  get empty (): boolean {
    return this.lines.length === 0
  }

  get code (): string {
    return this.lines.map(([start, end]) => `${code(start)}${code(end)}`).join('')
  }

  private update (
    fields: Partial<Pick<FreeLinesState, 'lines' | 'start'>>
  ): FreeLinesState {
    return new FreeLinesState({
      lines: fields.lines ?? this.lines,
      start: fields.start ?? this.start,
    })
  }

  private has (line: FreeLine): boolean {
    return includes(this.lines, line)
  }
}

const includes = (lines: FreeLine[], [start, end]: FreeLine): boolean => {
  return lines.findIndex(
    ([s, e]) => (equal(start, s) && equal(end, e)) || (equal(start, e) && equal(end, s))
  ) >= 0
}

const valid = ([start, end]: FreeLine): boolean => {
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
