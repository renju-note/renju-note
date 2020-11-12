import { decodePoints, encode, equal, Point } from '../rule'

export class FreePointsState {
  readonly points: Point[] = []

  constructor (init?: undefined | Partial<FreePointsState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update (fields: Partial<FreePointsState>): FreePointsState {
    return new FreePointsState({ ...this, ...fields })
  }

  add (p: Point): FreePointsState {
    if (this.has(p)) return this
    return this.update({
      points: [...this.points, p],
    })
  }

  undo (): FreePointsState {
    return this.update({
      points: this.points.slice(0, this.points.length - 1),
    })
  }

  get canUndo (): boolean {
    return this.points.length > 0
  }

  get empty (): boolean {
    return this.points.length === 0
  }

  private has (p: Point): boolean {
    return this.points.findIndex(q => equal(p, q)) >= 0
  }

  encode (): string {
    return this.points.map(encode).join('')
  }

  static decode (code: string): FreePointsState | undefined {
    const points = decodePoints(code)
    return points && new FreePointsState({ points: points })
  }
}
