import { Game, magicCodes, magicCodesForPoints, Point, equal, openingCode } from '../rule'
import Dexie, { Table } from 'dexie'
import { RIFDatabase } from './rif'

const DBNAME = 'analyzed'
const CHUNK_SIZE = 1000
const MAGIC_CODE_BETWEEN: [number, number] = [4, 10]
const MIN_BLACKS = 2
const MIN_WHITES = 2

const TableName = {
  gameCodes: 'gameCodes',
} as const
type TableName = typeof TableName[keyof typeof TableName]

export type GameCode = {
  id: number
  opening: number
  black: number[]
  white: number[]
  blackRect: number[]
  whiteRect: number[]
}

const indexedFields: Record<TableName, string> = {
  gameCodes: 'id,opening,*black,*white,*blackRect,*whiteRect',
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

  async loadFromRIFDatabase () {
    const rif = new RIFDatabase()
    const maxGame = await rif.games.orderBy('id').last()
    if (!maxGame) return
    const maxId = maxGame.id
    for (let startId = 0; startId <= maxId; startId += CHUNK_SIZE) {
      const items = await rif.games.where('id').between(startId, startId + CHUNK_SIZE).toArray()
      const gameCodes = items.map(item => {
        const game = Game.fromCode(item.move) ?? new Game({})
        const opening = openingCode(game.moves)
        const [black, white] = magicCodes(game, MAGIC_CODE_BETWEEN)
        return {
          id: item.id,
          opening,
          black,
          white,
          blackRect: [],
          whiteRect: []
        }
      })
      await this.gameCodes.bulkAdd(gameCodes)
      console.log(startId + CHUNK_SIZE)
    }
    console.log('done')
  }

  async search ([blacks, whites]: [Point[], Point[]], limit: number, offset: number): Promise<number[]> {
    if (blacks.length < MIN_BLACKS || whites.length < MIN_WHITES) {
      if (blacks.length === 2 && whites.length === 1) {
        return this.searchByOpening([blacks, whites], limit, offset)
      }
      return []
    }
    const blackCodes = magicCodesForPoints(blacks, blacks.length, blacks.length - 1)
    const whiteCodes = magicCodesForPoints(whites, whites.length, whites.length - 1)
    const black = blackCodes[blackCodes.length - 1]
    const white = whiteCodes[whiteCodes.length - 1]
    if (!black || !white) return []
    return this.gameCodes.where({
      black: blackCodes[blackCodes.length - 1],
      white: whiteCodes[whiteCodes.length - 1],
    }).distinct().limit(limit).offset(offset).primaryKeys()
  }

  async searchByOpening ([blacks, whites]: [Point[], Point[]], limit: number, offset: number): Promise<number[]> {
    if (!(blacks.length === 2 && whites.length === 1)) return []
    const moves = equal(blacks[1], [8, 8]) ? [blacks[1], whites[0], blacks[0]] : [blacks[0], whites[0], blacks[1]]
    const opening = openingCode(moves)
    return this.gameCodes.where({
      opening
    }).distinct().limit(limit).offset(offset).primaryKeys()
  }
}
