import { createContext, useState } from 'react'

export class Preference {
  readonly showIndices: boolean = false
  readonly showOrders: boolean = false
  readonly emphasizeLastMove: boolean = false
  readonly showForbiddens: boolean = false
  readonly showPropertyRows: boolean = false
  readonly showPropertyEyes: boolean = false

  constructor (init: Partial<Preference>) {
    if (init.showIndices !== undefined) this.showIndices = init.showIndices
    if (init.showOrders !== undefined) this.showOrders = init.showOrders
    if (init.emphasizeLastMove !== undefined) this.emphasizeLastMove = init.emphasizeLastMove
    if (init.showForbiddens !== undefined) this.showForbiddens = init.showForbiddens
    if (init.showPropertyRows !== undefined) this.showPropertyRows = init.showPropertyRows
    if (init.showPropertyEyes !== undefined) this.showPropertyEyes = init.showPropertyEyes
  }
}

export type SetPreference = (p: Preference) => void

export const usePreference = (): [Preference, SetPreference] => {
  const init = loadPreference(localStorage.getItem('preference') || '{}') || new Preference({})
  const [preference, setPreference] = useState<Preference>(init)
  const setAndSavePreference = (p: Preference) => {
    setPreference(p)
    localStorage.setItem('preference', JSON.stringify(p))
  }
  return [preference, setAndSavePreference]
}

export const PreferenceContext = createContext<[Preference, SetPreference]>([new Preference({}), () => {}])

const loadPreference = (localStoragePreference: string): Preference | undefined => {
  try {
    const partial = JSON.parse(localStoragePreference) as Partial<Preference>
    return new Preference(partial)
  } catch (e) {
    console.log(`Invalid preference: '${localStoragePreference}'`)
  }
}
