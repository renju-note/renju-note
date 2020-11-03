import Dexie, { Table } from 'dexie'

const DBNAME = 'rif'

export const TableName = {
  countries: 'countries',
  cities: 'cities',
  months: 'months',
  rules: 'rules',
  openings: 'openings',
  players: 'players',
  tournaments: 'tournaments',
  games: 'games',
} as const
export type TableName = typeof TableName[keyof typeof TableName]

const tableFields: Record<TableName, string | null> = {
  countries: null,
  cities: null,
  months: null,
  rules: null,
  openings: null,
  players: null,
  tournaments: null,
  games: null,
}

type Base = {
  id: number
}

type Named = Base & {
  name: string
}

export type Country = Named & {
  abbr: string
}
tableFields[TableName.countries] = '++id,name,abbr'

export type City = Named & {
  country: Country['id']
}
tableFields[TableName.cities] = '++id,name,country'

export type Month = Named
tableFields[TableName.months] = '++id,name'

export type Rule = Named & {
  info: string
}
tableFields[TableName.rules] = '++id,name,info'

export type Opening = Named & {
  abbr: string
}
tableFields[TableName.openings] = '++id,name,abbr'

export type Player = Named & {
  surname: string
  country: Country['id']
  city: City['id']
}
tableFields[TableName.players] = '++id,name,surname,country,city'

export type Tournament = Named & {
  country: Country['id']
  city: City['id']
  year: number
  month: Month['id']
  start: string
  end: string
  rule: Rule['id']
  rated: boolean
}
tableFields[TableName.tournaments] = '++id,name,country,city,year,month,start,end,rule,rated'

export type Game = Base & {
  publisher: Player['id']
  tournament: Tournament['id']
  round: string
  rule: Rule['id']
  black: Player['id']
  white: Player['id']
  bresult: number
  btime: number
  wtime: number
  opening: Opening['id']
  alt: string[]
  swap: string
  move: string[]
  info?: string
}
tableFields[TableName.games] = '++id,publisher,tournament,round,rule,black,white,bresult,btime,wtime,opening,alt,swap,move,info'

export class RIFDatabase extends Dexie {
  readonly countries: Table<Country, number>
  readonly cities: Table<City, number>
  readonly months: Table<Month, number>
  readonly rules: Table<Rule, number>
  readonly openings: Table<Opening, number>
  readonly players: Table<Player, number>
  readonly tournaments: Table<Tournament, number>
  readonly games: Table<Game, number>

  static reset () {
    indexedDB.deleteDatabase(DBNAME)
  }

  constructor () {
    super(DBNAME)
    this.version(1).stores(tableFields)
    this.countries = this.table(TableName.countries)
    this.cities = this.table(TableName.cities)
    this.months = this.table(TableName.months)
    this.rules = this.table(TableName.rules)
    this.openings = this.table(TableName.openings)
    this.players = this.table(TableName.players)
    this.tournaments = this.table(TableName.tournaments)
    this.games = this.table(TableName.games)
  }

  async loadFromFile (file: File) {
    const text = await file.text()
    const dom = new DOMParser().parseFromString(text, 'application/xml')
    const countries = dom.querySelector(TableName.countries)
    if (countries !== null) {
      console.log(`Adding: ${TableName.countries}`)
      await this.addCountries(countries.children)
    }
  }

  private async addCountries (elems: HTMLCollection) {
    const items: Country[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
        abbr: e.getAttribute('abbr') ?? '',
      })
    }
    await this.transaction('rw', this.countries, async () => {
      await this.countries.bulkAdd(items)
    })
  }

  private async addCities (elems: HTMLCollection) {
    const items: City[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
        country: parseInt(e.getAttribute('country') ?? ''),
      })
    }
    await this.transaction('rw', this.countries, async () => {
      await this.cities.bulkAdd(items)
    })
  }

  private async addMonths (elems: HTMLCollection) {
    const items: Month[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
      })
    }
    await this.transaction('rw', this.countries, async () => {
      await this.months.bulkAdd(items)
    })
  }

  private async addRules (elems: HTMLCollection) {
    const items: Rule[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
        info: e.getElementsByTagName('info').item(0)?.innerHTML ?? '',
      })
    }
    await this.transaction('rw', this.countries, async () => {
      await this.rules.bulkAdd(items)
    })
  }
}
