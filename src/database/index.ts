import Dexie from 'dexie'
import { AnalyzedDatabase } from './analyzed'
import { RIFDatabase } from './rif'

export * from './analyzed'
export * from './rif'

export const ready = async (): Promise<boolean> => {
  const bs = await Promise.all([
    Dexie.exists(RIFDatabase.DBNAME),
    Dexie.exists(AnalyzedDatabase.DBNAME),
  ])
  return bs[0] && bs[1]
}
