import { createContext, useState } from 'react'

export class Preference {
  readonly showIndices: boolean
  readonly showOrders: boolean
  readonly emphasizeLastMove: boolean
  readonly showForbiddens: boolean
  readonly showPropertyRows: boolean
  readonly showPropertyEyes: boolean
  readonly showMarkerAlphabets: boolean

  constructor (init: Partial<Preference>) {
    this.showIndices = init.showIndices ?? false
    this.showOrders = init.showOrders ?? false
    this.emphasizeLastMove = init.emphasizeLastMove ?? false
    this.showForbiddens = init.showForbiddens ?? false
    this.showPropertyRows = init.showPropertyRows ?? false
    this.showPropertyEyes = init.showPropertyEyes ?? false
    this.showMarkerAlphabets = init.showMarkerAlphabets ?? false
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
