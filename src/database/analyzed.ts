import Dexie, { Table } from 'dexie'
import { Game, Point } from '../rule'
import { encodeMoves } from './encoding'
import { RIFDatabase, RIFGame } from './rif'

const CHUNK_SIZE = 2000

const MIN_ENCODE_MOVES = 3
const MAX_ENCODE_MOVES = 20
const MAX_SEARCH_HIT = 1000

const tableNames = ['games'] as const
type TableName = typeof tableNames[number]
const TableName: Record<TableName, TableName> = {
  games: tableNames[0],
}

type AnalyzedGame = {
  id: RIFGame['id']
  date: number
  board: string[]
  player: number[]
  rated: boolean
}

const indexedFields: Record<TableName, string> = {
  games: 'id,date,*board,*player',
}

export type SearchResult = {
  ids: number[]
  hit: number
  error?: string
}

export class AnalyzedDatabase extends Dexie {
  static readonly DBNAME = 'analyzed'
  private readonly games: Table<AnalyzedGame, number>

  static reset() {
    indexedDB.deleteDatabase(AnalyzedDatabase.DBNAME)
  }

  constructor() {
    super(AnalyzedDatabase.DBNAME)
    this.version(1).stores(indexedFields)
    this.games = this.table(TableName.games)
  }

  async loadFromRIFDatabase(progress: (percentile: number) => void = () => {}) {
    const rif = new RIFDatabase()
    const [dateMap, ratedMap, maxId] = await Promise.all([
      rif.getTournamentsStartDateNumberMap(),
      rif.getTournamentsRatedMap(),
      rif.getMaxGameId(),
    ])
    progress(0)
    for (let startId = 0; startId <= maxId; startId += CHUNK_SIZE) {
      const items = await rif.getGamesByIdRange(startId, startId + CHUNK_SIZE)
      const games = items.map(item => {
        const game = Game.decode(item.move) ?? new Game({})
        const boardCodes = encodeMoves(game.moves.slice(0, MAX_ENCODE_MOVES)).slice(
          MIN_ENCODE_MOVES - 1
        )
        return {
          id: item.id,
          date: dateMap.get(item.tournament) ?? 0,
          board: boardCodes,
          player: [item.black, item.white],
          rated: ratedMap.get(item.tournament) ?? false,
        }
      })
      await this.games.bulkAdd(games)
      progress(Math.floor(((startId + CHUNK_SIZE) * 100) / maxId))
    }
    progress(100)
  }

  async search(
    moves: Point[],
    limit: number,
    offset: number = 0,
    desc: boolean = true
  ): Promise<SearchResult> {
    if (moves.length < MIN_ENCODE_MOVES) {
      return {
        ids: [],
        hit: 0,
        error: `Too few moves to search (${moves.length} < ${MIN_ENCODE_MOVES})`,
      }
    }
    if (moves.length > MAX_ENCODE_MOVES) {
      return {
        ids: [],
        hit: 0,
        error: `Too many moves to search (${moves.length} > ${MAX_ENCODE_MOVES})`,
      }
    }

    const boardCode = encodeMoves(moves)[moves.length - 1]
    const condition = { board: boardCode }

    const hit = await this.games.where(condition).distinct().count()
    if (hit <= 0) {
      return {
        ids: [],
        hit,
        error: 'No game found',
      }
    }
    if (hit > MAX_SEARCH_HIT) {
      return {
        ids: [],
        hit,
        error: `Too many games (${hit} > ${MAX_SEARCH_HIT})`,
      }
    }

    let collection = this.games.where(condition).distinct()
    if (desc) collection = collection.reverse()
    const ids = (await collection.sortBy('date')).slice(offset, offset + limit).map(g => g.id)
    return { ids, hit }
  }
}
