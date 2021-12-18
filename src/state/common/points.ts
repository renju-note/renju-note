import { parsePoints, Point, pointEqual, wrapPoint } from 'renjukit'

export class PointsState {
  readonly points: Point[] = []

  constructor(init?: undefined | Partial<PointsState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<PointsState>): PointsState {
    return new PointsState({ ...this, ...fields })
  }

  edit(p: Point): PointsState {
    const ps = this.points
    const idx = ps.findIndex(q => pointEqual(p, q))
    return this.update({
      points: idx < 0 ? [...ps, p] : [...ps.slice(0, idx), ...ps.slice(idx + 1)],
    })
  }

  undo(): PointsState {
    return this.update({
      points: this.points.slice(0, this.points.length - 1),
    })
  }

  has(p: Point): boolean {
    return this.points.findIndex(q => pointEqual(p, q)) >= 0
  }

  get canUndo(): boolean {
    return this.points.length > 0
  }

  get empty(): boolean {
    return this.points.length === 0
  }

  encode(): string {
    return this.points.map(p => wrapPoint(p).toString()).join('')
  }

  static decode(code: string): PointsState | undefined {
    const points = parsePoints(code)
    return points && new PointsState({ points: points })
  }
}
