import Dexie, { Table } from 'dexie'
import { decodePoints, Point } from '../rule'

const CHUNK_SIZE = 1000

const tableNames = [
  'countries',
  'cities',
  'months',
  'rules',
  'openings',
  'players',
  'tournaments',
  'games',
] as const
type TableName = typeof tableNames[number]
const TableName: Record<TableName, TableName> = {
  countries: tableNames[0],
  cities: tableNames[1],
  months: tableNames[2],
  rules: tableNames[3],
  openings: tableNames[4],
  players: tableNames[5],
  tournaments: tableNames[6],
  games: tableNames[7],
} as const

type Base = {
  id: number
}

type Named = Base & {
  name: string
}

export type RIFCountry = Named & {
  abbr: string
}

export type RIFCity = Named & {
  country: RIFCountry['id']
}

export type RIFMonth = Named

export type RIFRule = Named & {
  info: string
}

export type RIFOpening = Named & {
  abbr: string
}

export type RIFPlayer = Named & {
  surname: string
  country: RIFCountry['id']
  city: RIFCity['id']
}

export type RIFTournament = Named & {
  country: RIFCountry['id']
  city: RIFCity['id']
  year: number
  month: RIFMonth['id']
  start: string
  end: string
  rule: RIFRule['id']
  rated: boolean
}

export type RIFGame = Base & {
  publisher: RIFPlayer['id']
  tournament: RIFTournament['id']
  round: string
  rule: RIFRule['id']
  black: RIFPlayer['id']
  white: RIFPlayer['id']
  bresult: number
  btime: number
  wtime: number
  opening: RIFOpening['id']
  alt: string
  swap: string
  move: string
  info: string
}

const indexedFields: Record<TableName, string> = {
  countries: 'id',
  cities: 'id',
  months: 'id',
  rules: 'id',
  openings: 'id',
  players: 'id,name,surname,country',
  tournaments: 'id,name,country,year',
  games: 'id,tournament,black,white,bresult',
}

export type GameView = {
  id: RIFGame['id']
  black: RIFPlayer
  white: RIFPlayer
  blackWon: boolean | null
  whiteWon: boolean | null
  moves: Point[]
  btime: number
  wtime: number
  round: string
  rule: RIFRule
  opening: RIFOpening
  alts: Point[]
  alt: string
  swap: string
  info: string
  tournament: RIFTournament
  publisher: RIFPlayer
}

export class RIFDatabase extends Dexie {
  static readonly DBNAME = 'rif'
  private readonly countries: Table<RIFCountry, number>
  private readonly cities: Table<RIFCity, number>
  private readonly months: Table<RIFMonth, number>
  private readonly rules: Table<RIFRule, number>
  private readonly openings: Table<RIFOpening, number>
  private readonly players: Table<RIFPlayer, number>
  private readonly tournaments: Table<RIFTournament, number>
  private readonly games: Table<RIFGame, number>

  static reset() {
    indexedDB.deleteDatabase(RIFDatabase.DBNAME)
  }

  constructor() {
    super(RIFDatabase.DBNAME)
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

  async getGameViews(gameIds: RIFGame['id'][]): Promise<GameView[]> {
    const games = await this.games.bulkGet(gameIds)
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
        id: game.id,
        black: blacks[i],
        white: whites[i],
        blackWon,
        whiteWon,
        moves: decodePoints(game.move) ?? [],
        btime: game.btime,
        wtime: game.wtime,
        opening: openings[i],
        rule: rules[i],
        alt: game.alt,
        alts: [], // TODO
        swap: game.swap,
        info: game.info,
        publisher: publishers[i],
        tournament: tournaments[i],
        round: game.round,
      }
    })
  }

  async getGamesByIdRange(start: RIFGame['id'], end: RIFGame['id']): Promise<RIFGame[]> {
    return await this.games.where('id').between(start, end).toArray()
  }

  async getMaxGameId(): Promise<RIFGame['id']> {
    const maxGame = await this.games.orderBy('id').last()
    return maxGame?.id ?? 0
  }

  async getTournamentsStartDateNumberMap(): Promise<Map<RIFTournament['id'], number>> {
    const ts = await this.tournaments.toArray()
    const result = new Map<RIFTournament['id'], number>()
    for (let i = 0; i < ts.length; i++) {
      const t = ts[i]
      const m = t.start.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
      if (m) {
        const [yyyy, mm, dd] = [m[1], m[2], m[3]]
        result.set(t.id, parseInt(yyyy + mm + dd))
      } else {
        result.set(t.id, 0)
      }
    }
    return result
  }

  async getTournamentsRatedMap(): Promise<Map<RIFTournament['id'], boolean>> {
    const ts = await this.tournaments.toArray()
    const result = new Map<RIFTournament['id'], boolean>()
    for (let i = 0; i < ts.length; i++) {
      const t = ts[i]
      result.set(t.id, t.rated)
    }
    return result
  }

  async getCountriesMap(): Promise<Map<RIFCountry['id'], RIFCountry>> {
    const arr = await this.countries.toArray()
    const result = new Map<RIFCountry['id'], RIFCountry>()
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i]
      result.set(x.id, x)
    }
    return result
  }

  async getCitiesMap(): Promise<Map<RIFCity['id'], RIFCity>> {
    const arr = await this.cities.toArray()
    const result = new Map<RIFCity['id'], RIFCity>()
    for (let i = 0; i < arr.length; i++) {
      const x = arr[i]
      result.set(x.id, x)
    }
    return result
  }

  async loadFromFile(file: File, progress: (percentile: number) => void = () => {}) {
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

  private async addCountries(elems: HTMLCollection) {
    const items: RIFCountry[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addCities(elems: HTMLCollection) {
    const items: RIFCity[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addMonths(elems: HTMLCollection) {
    const items: RIFMonth[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
      items.push({
        id: id,
        name: e.getAttribute('name') ?? '',
      })
    }
    await this.transaction('rw', this.months, async () => {
      await this.months.bulkAdd(items)
    })
  }

  private async addRules(elems: HTMLCollection) {
    const items: RIFRule[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addOpenings(elems: HTMLCollection) {
    const items: RIFOpening[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addPlayers(elems: HTMLCollection) {
    const items: RIFPlayer[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addTournaments(elems: HTMLCollection) {
    const items: RIFTournament[] = []
    for (let i = 0; i < elems.length; i++) {
      const [e, id] = getElemWithId(elems, i) ?? []
      if (!e || !id) continue
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

  private async addGames(elems: HTMLCollection, progress: (percentile: number) => void = () => {}) {
    for (let c = 0; c < elems.length; c += CHUNK_SIZE) {
      const items: RIFGame[] = []
      for (let i = 0; i < CHUNK_SIZE; i++) {
        const [e, id] = getElemWithId(elems, c + i) ?? []
        if (!e || !id) continue
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
      progress(Math.floor(((c + CHUNK_SIZE) * 100) / elems.length))
    }
    progress(100)
  }
}

const getElemWithId = (elems: HTMLCollection, i: number): [Element, number] | undefined => {
  const e = elems.item(i)
  if (!e) return
  const id = parseInt(e.id)
  if (isNaN(id)) return
  return [e, id]
}
