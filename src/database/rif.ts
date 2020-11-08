import Dexie, { Table } from 'dexie'
import { Point, parsePoints } from '../rule'

const DBNAME = 'rif'
const CHUNK_SIZE = 1000

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

const indexedFields: Record<TableName, string | null> = {
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
indexedFields[TableName.countries] = 'id'

export type City = Named & {
  country: Country['id']
}
indexedFields[TableName.cities] = 'id'

export type Month = Named
indexedFields[TableName.months] = 'id'

export type Rule = Named & {
  info: string
}
indexedFields[TableName.rules] = 'id'

export type Opening = Named & {
  abbr: string
}
indexedFields[TableName.openings] = 'id'

export type Player = Named & {
  surname: string
  country: Country['id']
  city: City['id']
}
indexedFields[TableName.players] = 'id,name,surname,country'

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
indexedFields[TableName.tournaments] = 'id,name,country,year'

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
indexedFields[TableName.games] = 'id,tournament,black,white,bresult'

export type GameView = {
  black: Player,
  white: Player,
  blackWon: boolean | null,
  whiteWon: boolean | null,
  moves: Point[],
  btime: number,
  wtime: number,
  rule: Rule,
  opening: Opening,
  alt: Point[],
  swap: string,
  info: string,
  tournament: Tournament,
  publisher: Player,
}

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
    this.version(1).stores(indexedFields)
    this.countries = this.table(TableName.countries)
    this.cities = this.table(TableName.cities)
    this.months = this.table(TableName.months)
    this.rules = this.table(TableName.rules)
    this.openings = this.table(TableName.openings)
    this.players = this.table(TableName.players)
    this.tournaments = this.table(TableName.tournaments)
    this.games = this.table(TableName.games)
  }

  async getGameViews (ids: Game['id'][]): Promise<GameView[]> {
    const games = await this.games.bulkGet(ids)
    const [blacks, whites, publishers, tournaments, rules, openings] = await Promise.all([
      this.players.bulkGet(games.map(g => g.black)),
      this.players.bulkGet(games.map(g => g.white)),
      this.players.bulkGet(games.map(g => g.publisher)),
      this.tournaments.bulkGet(games.map(g => g.tournament)),
      this.rules.bulkGet(games.map(g => g.rule)),
      this.openings.bulkGet(games.map(g => g.opening)),
    ])
    return games.map((game, i) => {
      const r = game.bresult
      const blackWon = r === 1 ? true : r === 0 ? false : null
      const whiteWon = r === 0 ? true : r === 1 ? false : null
      return {
        black: blacks[i],
        white: whites[i],
        blackWon,
        whiteWon,
        moves: parsePoints(game.move) ?? [],
        btime: game.btime,
        wtime: game.wtime,
        opening: openings[i],
        rule: rules[i],
        alt: [], // TODO
        swap: game.swap,
        info: game.info,
        publisher: publishers[i],
        tournament: tournaments[i],
      }
    })
  }

  async loadFromFile (file: File, progress: (percentile: number) => void = () => {}) {
    const text = await file.text()
    const dom = new DOMParser().parseFromString(text, 'application/xml')

    const countries = dom.querySelector(TableName.countries)
    const promises = []
    if (countries !== null) {
      promises.push(this.addCountries(countries.children))
    }
    const cities = dom.querySelector(TableName.cities)
    if (cities !== null) {
      promises.push(this.addCities(cities.children))
    }
    const months = dom.querySelector(TableName.months)
    if (months !== null) {
      promises.push(this.addMonths(months.children))
    }
    const openings = dom.querySelector(TableName.openings)
    if (openings !== null) {
      promises.push(this.addOpenings(openings.children))
    }
    const rules = dom.querySelector(TableName.rules)
    if (rules !== null) {
      promises.push(this.addRules(rules.children))
    }
    const players = dom.querySelector(TableName.players)
    if (players !== null) {
      promises.push(this.addPlayers(players.children))
    }
    const tournaments = dom.querySelector(TableName.tournaments)
    if (tournaments !== null) {
      promises.push(this.addTournaments(tournaments.children))
    }
    const games = dom.querySelector(TableName.games)
    if (games !== null) {
      promises.push(this.addGames(games.children, progress))
    }
    await Promise.all(promises)
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

  private async addGames (elems: HTMLCollection, progress: (percentile: number) => void = () => {}) {
    for (let c = 0; c < elems.length; c += CHUNK_SIZE) {
      const items: Game[] = []
      for (let i = 0; i < CHUNK_SIZE; i++) {
        const e = elems.item(c + i)
        if (!e) break
        const id = parseInt(e.id)
        if (isNaN(id) || id < 0) continue
        items[i] = {
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
        }
      }
      await this.transaction('rw', this.games, async () => {
        await this.games.bulkAdd(items)
      })
      progress(Math.floor((c + CHUNK_SIZE) * 100 / elems.length))
    }
    progress(100)
  }
}
