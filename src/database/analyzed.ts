import { Game, Point, encodeMoves, encodeBoard } from '../rule'
import Dexie, { Table } from 'dexie'
import { RIFDatabase } from './rif'

const DBNAME = 'analyzed'
const CHUNK_SIZE = 1000
const ENCODE_OFFSET = 2
const ENCODE_LIMIT = 10

const tableNames = ['gameCodes'] as const
type TableName = typeof tableNames[number]
const TableName: Record<TableName, TableName> = {
  gameCodes: tableNames[0],
}

export type GameCode = {
  id: number
  board: string[]
  rect: string[]
}

const indexedFields: Record<TableName, string> = {
  gameCodes: 'id,*board,*rect',
}

export class AnalyzedDatabase extends Dexie {
  readonly gameCodes: Table<GameCode, number>

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
    const maxGame = await rif.games.orderBy('id').last()
    if (!maxGame) return
    const maxId = maxGame.id
    progress(0)
    for (let startId = 0; startId <= maxId; startId += CHUNK_SIZE) {
      const items = await rif.games.where('id').between(startId, startId + CHUNK_SIZE).toArray()
      const gameCodes = items.map(item => {
        const game = Game.fromCode(item.move) ?? new Game({})
        const boardCodes = encodeMoves(game.moves.slice(0, ENCODE_LIMIT)).slice(ENCODE_OFFSET)
        return {
          id: item.id,
          board: boardCodes,
          rect: [],
        }
      })
      await this.gameCodes.bulkAdd(gameCodes)
      progress(Math.floor((startId + CHUNK_SIZE) * 100 / maxId))
    }
    progress(100)
  }

  async search ([blacks, whites]: [Point[], Point[]], limit: number, offset: number, reverse: boolean = false): Promise<number[]> {
    if (blacks.length + whites.length <= ENCODE_OFFSET) return []
    if (blacks.length + whites.length > ENCODE_LIMIT) return []
    const boardCode = encodeBoard(blacks, whites)
    let collection = this.gameCodes.where({ board: boardCode }).distinct()
    if (reverse) collection = collection.reverse()
    return collection.limit(limit).offset(offset).primaryKeys()
  }
}
