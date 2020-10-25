import { code, equal, parsePoints, Point } from '../rule'

export class FreePointsState {
  readonly points: Point[]

  constructor (
    init:
      | {}
      | Pick<FreePointsState, 'points'>
  ) {
    this.points = 'points' in init ? init.points : []
  }

  static fromCode (code: string): FreePointsState | undefined {
    const points = parsePoints(code)
    return points && new FreePointsState({ points: points })
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

  private update (
    fields: Partial<Pick<FreePointsState, 'points'>>
  ): FreePointsState {
    return new FreePointsState({
      points: fields.points ?? this.points,
    })
  }

  private has (p: Point): boolean {
    return this.points.findIndex(q => equal(p, q)) >= 0
  }

  get code (): string {
    return this.points.map(code).join('')
  }
}
