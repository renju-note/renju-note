import Dexie from 'dexie'
import { AnalyzedDatabase } from './analyzed'
import { RIFDatabase } from './rif'

export * from './analyzed'
export * from './rif'

export const ready = async (): Promise<boolean> => {
  const bs = await Promise.all([Dexie.exists(RIFDatabase.dbname()), Dexie.exists(AnalyzedDatabase.dbname())])
  return bs[0] && bs[1]
}
