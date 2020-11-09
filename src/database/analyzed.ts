import { Game, Point, encodeMoves } from '../rule'
import Dexie, { Table } from 'dexie'
import { RIFDatabase, RIFGame } from './rif'

const DBNAME = 'analyzed'
const CHUNK_SIZE = 1000
const ENCODE_OFFSET = 2
const ENCODE_LIMIT = 10

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

  static reset () {
    indexedDB.deleteDatabase(DBNAME)
  }

  constructor () {
    super(DBNAME)
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
        const boardCodes = encodeMoves(game.moves.slice(0, ENCODE_LIMIT)).slice(ENCODE_OFFSET)
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
    reverse: boolean = false,
  ): Promise<number[]> {
    if (moves.length <= ENCODE_OFFSET || ENCODE_LIMIT < moves.length) return []
    const boardCode = encodeMoves(moves)[moves.length - 1]
    let collection = this.gameCodes.where({ board: boardCode }).distinct()
    if (reverse) collection = collection.reverse()
    // 'sortBy' is not efficient.
    return (await collection.filter(gv => gv.rated).sortBy('date')).slice(offset, offset + limit).map(gv => gv.id)
  }
}
