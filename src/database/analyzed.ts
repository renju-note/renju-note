import { Game, magicCodes, magicCodesForPoints, Point } from '../rule'
import Dexie, { Table } from 'dexie'
import { RIFDatabase } from './rif'

const DBNAME = 'analyzed'
const MAGIC_CODE_UNTIL = 5

const TableName = {
  gameCodes: 'gameCodes',
} as const
type TableName = typeof TableName[keyof typeof TableName]

const indexedFields: Record<TableName, string | null> = {
  gameCodes: null,
}

export type GameCode = {
  id: number
  black: number[]
  white: number[]
  blackRect: number[]
  whiteRect: number[]
}
indexedFields.gameCodes = 'id,*black,*white,*blackRect,*whiteRect'

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
    await rif.games.limit(1000).each(async (item, _) => {
      const game = Game.fromCode(item.move)
      if (!game) return
      const [black, white] = magicCodes(game, MAGIC_CODE_UNTIL)
      await this.gameCodes.add({
        id: item.id,
        black,
        white,
        blackRect: [],
        whiteRect: []
      })
    })
  }

  async search ([blacks, whites]: [Point[], Point[]], limit: number, offset: number): Promise<number[]> {
    const blackCodes = magicCodesForPoints(blacks, blacks.length - 1)
    const whiteCodes = magicCodesForPoints(whites, whites.length - 1)
    const black = blackCodes[blackCodes.length - 1]
    const white = whiteCodes[whiteCodes.length - 1]
    console.log(black, white)
    if (!black || !white) return []
    return this.gameCodes.where({
      black: blackCodes[blackCodes.length - 1],
      white: whiteCodes[whiteCodes.length - 1],
    }).distinct().limit(limit).offset(offset).primaryKeys()
  }
}
