const tabNames = ['search', 'detail', 'mate', 'setup'] as const
export type TabName = typeof tabNames[number]
export const TabName: Record<TabName, TabName> = {
  search: 'search',
  detail: 'detail',
  mate: 'mate',
  setup: 'setup',
} as const

export class TabsState {
  readonly current: TabName = TabName.mate
  readonly names: TabName[] = [TabName.mate, TabName.setup]

  constructor(init?: undefined | Partial<TabsState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<TabsState>): TabsState {
    return new TabsState({ ...this, ...fields })
  }

  setCurrent(name: TabName): TabsState {
    return this.update({ current: name })
  }

  setNames(names: TabName[]): TabsState {
    return this.update({ names: names })
  }

  setIndex(index: number): TabsState {
    return this.update({ current: this.names[index] })
  }

  get index(): number {
    return this.names.indexOf(this.current)
  }
}
