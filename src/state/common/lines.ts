import { decodePoints, encode, equal, Point } from '../../rule'

type Line = [Point, Point]

export class LinesState {
  readonly lines: Line[] = []
  readonly start: Point | undefined = undefined

  constructor(init?: undefined | Partial<LinesState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<LinesState>): LinesState {
    return new LinesState({ ...this, ...fields })
  }

  draw(p: Point): LinesState {
    if (this.start === undefined) {
      return this.update({ start: p })
    }

    const line: Line = [this.start, p]
    if (this.has(line) || !valid(line)) {
      return this.update({ start: undefined })
    }
    return this.update({
      lines: [...this.lines, line],
      start: undefined,
    })
  }

  undo(): LinesState {
    if (this.start !== undefined) {
      return this.update({ start: undefined })
    }
    return this.update({
      lines: this.lines.slice(0, this.lines.length - 1),
    })
  }

  unstart(): LinesState {
    return this.update({ start: undefined })
  }

  get canUndo(): boolean {
    return this.start !== undefined || this.lines.length > 0
  }

  get empty(): boolean {
    return this.lines.length === 0
  }

  private has(line: Line): boolean {
    return includes(this.lines, line)
  }

  encode(): string {
    return this.lines.map(([start, end]) => `${encode(start)}${encode(end)}`).join('')
  }

  static decode(code: string): LinesState | undefined {
    const points = decodePoints(code)
    if (!points) return undefined
    if (points.length % 2 !== 0) return undefined
    const lines: Line[] = []
    for (let i = 0; i < points.length / 2; i++) {
      const l: Line = [points[i * 2], points[i * 2 + 1]]
      if (valid(l) && !includes(lines, l)) lines.push(l)
    }
    return new LinesState({ lines: lines })
  }
}

const includes = (lines: Line[], [start, end]: Line): boolean => {
  return (
    lines.findIndex(
      ([s, e]) => (equal(start, s) && equal(end, e)) || (equal(start, e) && equal(end, s))
    ) >= 0
  )
}

const valid = ([start, end]: Line): boolean => {
  if (equal(start, end)) return false
  const [sx, sy] = start
  const [ex, ey] = end
  return (
    sx === ex || // vertical
    sy === ey || // horizontal
    ex - sx === ey - sy || // ascending
    ex - sx === sy - ey // descending
  )
}
