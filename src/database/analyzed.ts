import Dexie, { Table } from 'dexie'
import { encodeMoves, Game, Point } from '../rule'
import { RIFDatabase, RIFGame } from './rif'

const DBNAME = 'analyzed'
const CHUNK_SIZE = 1000

const MIN_ENCODE_MOVES = 3
const MAX_ENCODE_MOVES = 10
const MAX_SEARCH_HIT = 1000

const tableNames = ['gameCodes'] as const
type TableName = typeof tableNames[number]
const TableName: Record<TableName, TableName> = {
  gameCodes: tableNames[0],
}

type GameCode = {
  id: RIFGame['id']
  date: number
  board: string[]
  player: number[]
  rated: boolean
}

const indexedFields: Record<TableName, string> = {
  gameCodes: 'id,date,*board,*player',
}

export class AnalyzedDatabase extends Dexie {
  private readonly gameCodes: Table<GameCode, number>

  static dbname (): string {
    return DBNAME
  }

  static reset () {
    indexedDB.deleteDatabase(AnalyzedDatabase.dbname())
  }

  constructor () {
    super(AnalyzedDatabase.dbname())
    this.version(1).stores(indexedFields)
    this.gameCodes = this.table(TableName.gameCodes)
  }

  async loadFromRIFDatabase (progress: (percentile: number) => void = () => {}) {
    const rif = new RIFDatabase()
    const [dateMap, ratedMap, maxId] = await Promise.all([
      rif.getTournamentsStartDateNumberMap(),
      rif.getTournamentsRatedMap(),
      rif.getMaxGameId(),
    ])
    progress(0)
    for (let startId = 0; startId <= maxId; startId += CHUNK_SIZE) {
      const items = await rif.getGamesByIdRange(startId, startId + CHUNK_SIZE)
      const gameCodes = items.map(item => {
        const game = Game.fromCode(item.move) ?? new Game({})
        const boardCodes = encodeMoves(game.moves.slice(0, MAX_ENCODE_MOVES)).slice(MIN_ENCODE_MOVES - 1)
        return {
          id: item.id,
          date: dateMap.get(item.tournament) ?? 0,
          board: boardCodes,
          player: [item.black, item.white],
          rated: ratedMap.get(item.tournament) ?? false,
        }
      })
      await this.gameCodes.bulkAdd(gameCodes)
      progress(Math.floor((startId + CHUNK_SIZE) * 100 / maxId))
    }
    progress(100)
  }

  async search (
    moves: Point[],
    limit: number,
    offset: number = 0,
    desc: boolean = true,
  ): Promise<SearchResult> {
    if (moves.length < MIN_ENCODE_MOVES) {
      return {
        ids: [],
        hit: 0,
        error: `Too few moves (${moves.length} < ${MIN_ENCODE_MOVES})`,
      }
    }
    if (moves.length > MAX_ENCODE_MOVES) {
      return {
        ids: [],
        hit: 0,
        error: `Too many moves (${moves.length} > ${MAX_ENCODE_MOVES})`,
      }
    }

    const boardCode = encodeMoves(moves)[moves.length - 1]
    const condition = { board: boardCode }

    const hit = await this.gameCodes.where(condition).distinct().count()
    if (hit > MAX_SEARCH_HIT) {
      return {
        ids: [],
        hit,
        error: `Too many hits (${hit} > ${MAX_SEARCH_HIT})`,
      }
    }

    let collection = this.gameCodes.where(condition).distinct()
    if (desc) collection = collection.reverse()
    const ids = (await collection.sortBy('date')).slice(offset, offset + limit).map(g => g.id)
    return { ids, hit }
  }
}

export type SearchResult = {
  ids: number[]
  hit: number
  error?: string
}
