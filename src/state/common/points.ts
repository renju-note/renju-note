import { decodePoints, encodePoints, equal, Point } from '../../rule'

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
    const idx = ps.findIndex(q => equal(p, q))
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
    return this.points.findIndex(q => equal(p, q)) >= 0
  }

  get canUndo(): boolean {
    return this.points.length > 0
  }

  get empty(): boolean {
    return this.points.length === 0
  }

  encode(): string {
    return encodePoints(this.points)
  }

  static decode(code: string): PointsState | undefined {
    const points = decodePoints(code)
    return points && new PointsState({ points: points })
  }
}
