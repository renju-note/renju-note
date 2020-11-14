export class Options<T extends string> {
  readonly map: Partial<Record<T, boolean>> = {}

  constructor (init?: Partial<Record<T, boolean>>) {
    if (init) this.map = init
  }

  has (v: T): boolean {
    return !!this.map[v]
  }

  on (values: T[]): Options<T> {
    const map: Partial<Record<T, boolean>> = {}
    for (const v of values) map[v] = true
    return new Options<T>({ ...this.map, ...map })
  }

  off (values: T[]): Options<T> {
    const map: Partial<Record<T, boolean>> = {}
    for (const v of values) map[v] = false
    return new Options<T>({ ...this.map, ...map })
  }

  change (targets: T[], on: T[]): Options<T> {
    const map: Partial<Record<T, boolean>> = {}
    for (const v of targets) {
      map[v] = on.includes(v)
    }
    return new Options<T>({ ...this.map, ...map })
  }

  get values (): T[] {
    const values: T[] = []
    for (const v in this.map) {
      if (this.map[v] === true) values.push(v)
    }
    return values
  }
}
