import { parsePoints, Point, pointEqual, wrapPoints } from 'renjukit'

type Segment = [Point, Point]

export class SegmentsState {
  readonly segments: Segment[] = []
  readonly start: Point | undefined = undefined

  constructor(init?: undefined | Partial<SegmentsState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SegmentsState>): SegmentsState {
    return new SegmentsState({ ...this, ...fields })
  }

  draw(p: Point): SegmentsState {
    if (this.start === undefined) {
      return this.update({ start: p })
    }

    const segment: Segment = [this.start, p]
    if (this.has(segment) || !valid(segment)) {
      return this.update({ start: undefined })
    }
    return this.update({
      segments: [...this.segments, segment],
      start: undefined,
    })
  }

  undo(): SegmentsState {
    if (this.start !== undefined) {
      return this.update({ start: undefined })
    }
    return this.update({
      segments: this.segments.slice(0, this.segments.length - 1),
    })
  }

  unstart(): SegmentsState {
    return this.update({ start: undefined })
  }

  get canUndo(): boolean {
    return this.start !== undefined || this.segments.length > 0
  }

  get empty(): boolean {
    return this.segments.length === 0
  }

  private has(segment: Segment): boolean {
    return includes(this.segments, segment)
  }

  encode(): string {
    return this.segments.map(s => wrapPoints(s).toString('')).join('')
  }

  static decode(code: string): SegmentsState | undefined {
    const points = parsePoints(code)
    if (!points) return undefined
    if (points.length % 2 !== 0) return undefined
    const segments: Segment[] = []
    for (let i = 0; i < points.length / 2; i++) {
      const l: Segment = [points[i * 2], points[i * 2 + 1]]
      if (valid(l) && !includes(segments, l)) segments.push(l)
    }
    return new SegmentsState({ segments: segments })
  }
}

const includes = (segments: Segment[], [start, end]: Segment): boolean =>
  segments.findIndex(
    ([s, e]) =>
      (pointEqual(start, s) && pointEqual(end, e)) || (pointEqual(start, e) && pointEqual(end, s))
  ) >= 0

const valid = ([start, end]: Segment): boolean => {
  if (pointEqual(start, end)) return false
  const [sx, sy] = start
  const [ex, ey] = end
  return (
    sx === ex || // vertical
    sy === ey || // horizontal
    ex - sx === ey - sy || // ascending
    ex - sx === sy - ey // descending
  )
}
