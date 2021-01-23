import Dexie, { Table } from 'dexie'
import { Game, Point } from '../rule'
import { encodeMoves } from './encoding'
import { RIFDatabase, RIFGame } from './rif'

const VERSION = 2
const EXAMPLE_MOVES: Point[] = [
  [8, 8],
  [9, 9],
  [6, 6],
] // I13

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

type SearchParams = {
  moves?: Point[]
  playerId?: number
  limit?: number
  offset?: number
  desc?: boolean
}

type SearchCondition = {
  board?: string
  player?: number
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
    this.version(VERSION).stores(indexedFields)
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

  async search({
    moves,
    playerId,
    limit = 20,
    offset = 0,
    desc = true,
  }: SearchParams): Promise<SearchResult> {
    const condition: SearchCondition = {}
    if (moves !== undefined) {
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
      condition.board = boardCode
    }

    if (playerId !== undefined) {
      condition.player = playerId
    }

    if (condition.player === undefined && condition.board === undefined) {
      return {
        ids: [],
        hit: 0,
        error: 'Search condition is not set',
      }
    }

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

  async ready(): Promise<boolean> {
    try {
      const example = encodeMoves(EXAMPLE_MOVES)[EXAMPLE_MOVES.length - 1]
      return (await this.games.where({ board: example }).first()) !== undefined
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
