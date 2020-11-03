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
  alt: string
  swap: string
  move: string
  info: string
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
    const cities = dom.querySelector(TableName.cities)
    if (cities !== null) {
      console.log(`Adding: ${TableName.cities}`)
      await this.addCities(cities.children)
    }
    const months = dom.querySelector(TableName.months)
    if (months !== null) {
      console.log(`Adding: ${TableName.months}`)
      await this.addMonths(months.children)
    }
    const openings = dom.querySelector(TableName.openings)
    if (openings !== null) {
      console.log(`Adding: ${TableName.openings}`)
      await this.addOpenings(openings.children)
    }
    const rules = dom.querySelector(TableName.rules)
    if (rules !== null) {
      console.log(`Adding: ${TableName.rules}`)
      await this.addRules(rules.children)
    }
    const players = dom.querySelector(TableName.players)
    if (players !== null) {
      console.log(`Adding: ${TableName.players}`)
      await this.addPlayers(players.children)
    }
    const tournaments = dom.querySelector(TableName.tournaments)
    if (tournaments !== null) {
      console.log(`Adding: ${TableName.tournaments}`)
      await this.addTournaments(tournaments.children)
    }
    const games = dom.querySelector(TableName.games)
    if (games !== null) {
      console.log(`Adding: ${TableName.games}`)
      await this.addGames(games.children)
    }
    console.log('Done')
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
    await this.transaction('rw', this.cities, async () => {
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
    await this.transaction('rw', this.months, async () => {
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
    await this.transaction('rw', this.rules, async () => {
      await this.rules.bulkAdd(items)
    })
  }

  private async addOpenings (elems: HTMLCollection) {
    const items: Opening[] = []
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
    await this.transaction('rw', this.openings, async () => {
      await this.openings.bulkAdd(items)
    })
  }

  private async addPlayers (elems: HTMLCollection) {
    const items: Player[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
        surname: e.getAttribute('surname') ?? '',
        country: parseInt(e.getAttribute('country') ?? ''),
        city: parseInt(e.getAttribute('city') ?? ''),
      })
    }
    await this.transaction('rw', this.players, async () => {
      await this.players.bulkAdd(items)
    })
  }

  private async addTournaments (elems: HTMLCollection) {
    const items: Tournament[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
        country: parseInt(e.getAttribute('country') ?? ''),
        city: parseInt(e.getAttribute('city') ?? ''),
        year: parseInt(e.getAttribute('year') ?? ''),
        month: parseInt(e.getAttribute('month') ?? ''),
        start: e.getAttribute('start') ?? '',
        end: e.getAttribute('end') ?? '',
        rule: parseInt(e.getAttribute('rule') ?? ''),
        rated: (e.getAttribute('rated') ?? '') === '1',
      })
    }
    await this.transaction('rw', this.tournaments, async () => {
      await this.tournaments.bulkAdd(items)
    })
  }

  private async addGames (elems: HTMLCollection) {
    const items: Game[] = []
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i]
      const id = parseInt(e.id)
      if (isNaN(id) || id < 0) continue
      items.push({
        id: id,
        publisher: parseInt(e.getAttribute('publisher') ?? ''),
        tournament: parseInt(e.getAttribute('tournament') ?? ''),
        round: e.getAttribute('round') ?? '',
        rule: parseInt(e.getAttribute('rule') ?? ''),
        black: parseInt(e.getAttribute('black') ?? ''),
        white: parseInt(e.getAttribute('white') ?? ''),
        bresult: parseFloat(e.getAttribute('bresult') ?? ''),
        btime: parseInt(e.getAttribute('btime') ?? ''),
        wtime: parseInt(e.getAttribute('wtime') ?? ''),
        opening: parseInt(e.getAttribute('opening') ?? ''),
        alt: e.getAttribute('alt') ?? '',
        swap: e.getAttribute('swap') ?? '',
        move: e.getElementsByTagName('move').item(0)?.innerHTML ?? '',
        info: e.getElementsByTagName('info').item(0)?.innerHTML ?? '',
      })
    }
    await this.transaction('rw', this.games, async () => {
      await this.games.bulkAdd(items)
    })
  }
}
