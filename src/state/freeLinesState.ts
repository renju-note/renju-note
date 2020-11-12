import { code, equal, parsePoints, Point } from '../rule'

type FreeLine = [Point, Point]

export class FreeLinesState {
  readonly lines: FreeLine[] = []
  readonly start: Point | undefined = undefined

  constructor (init?: undefined | Partial<FreeLinesState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update (fields: Partial<FreeLinesState>): FreeLinesState {
    return new FreeLinesState({ ...this, ...fields })
  }

  draw (p: Point): FreeLinesState {
    if (this.start === undefined) {
      return this.update({ start: p })
    }

    const line: FreeLine = [this.start, p]
    if (this.has(line) || !valid(line)) {
      return this.update({ start: undefined })
    }
    return this.update({
      lines: [...this.lines, line],
      start: undefined,
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

  unstart (): FreeLinesState {
    return this.update({ start: undefined })
  }

  get canUndo (): boolean {
    return this.start !== undefined || this.lines.length > 0
  }

  get empty (): boolean {
    return this.lines.length === 0
  }

  private has (line: FreeLine): boolean {
    return includes(this.lines, line)
  }

  encode (): string {
    return this.lines.map(([start, end]) => `${code(start)}${code(end)}`).join('')
  }

  static decode (code: string): FreeLinesState | undefined {
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
