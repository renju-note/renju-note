const DEFAULT_PAGE_SIZE = 20

export class PagerState {
  readonly hit: number = 0
  readonly page: number = 0
  readonly pageSize: number = DEFAULT_PAGE_SIZE

  constructor(init?: undefined | Partial<PagerState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<PagerState>): PagerState {
    return new PagerState({ ...this, ...fields })
  }

  get lastPage(): number {
    return ~~((this.hit - 1) / this.pageSize)
  }

  private navigate(page: number): PagerState {
    if (page < 0 || this.lastPage < page) return this
    return this.update({ page })
  }

  get isFirst(): boolean {
    return this.page === 0
  }

  get isLast(): boolean {
    return this.page === this.lastPage
  }

  next(): PagerState {
    if (this.isLast) return this
    return this.navigate(this.page + 1)
  }

  toLast(): PagerState {
    if (this.isLast) return this
    return this.navigate(this.lastPage)
  }

  prev(): PagerState {
    if (this.isFirst) return this
    return this.navigate(this.page - 1)
  }

  toFirst(): PagerState {
    if (this.isFirst) return this
    return this.navigate(0)
  }

  toString(): string {
    const start = this.page * this.pageSize + 1
    const last = Math.min((this.page + 1) * this.pageSize, this.hit)
    return `${start}-${last} of ${this.hit}`
  }
}
