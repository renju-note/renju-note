import { createContext, useState } from 'react'
import { Options } from '../../utils/options'

const preferenceOptions = [
  'showIndices',
  'showOrders',
  'emphasizeLastMove',
  'showForbiddens',
  'showPropertyRows',
  'showPropertyEyes',
  'showTabs',
] as const
export type PreferenceOption = typeof preferenceOptions[number]
export const PreferenceOption: Record<PreferenceOption, PreferenceOption> = {
  showIndices: 'showIndices',
  showOrders: 'showOrders',
  emphasizeLastMove: 'emphasizeLastMove',
  showForbiddens: 'showForbiddens',
  showPropertyRows: 'showPropertyRows',
  showPropertyEyes: 'showPropertyEyes',
  showTabs: 'showTabs',
}

export type Preference = Options<PreferenceOption>

export type SetPreference = (p: Preference) => void

export const usePreference = (): [Preference, SetPreference] => {
  const init = decode(localStorage.getItem('preference') || '{}') ?? new Options<PreferenceOption>()
  const [preference, setPreference] = useState<Preference>(init)
  const setAndSavePreference = (p: Preference) => {
    setPreference(p)
    localStorage.setItem('preference', encode(p))
  }
  return [preference, setAndSavePreference]
}

export const PreferenceContext = createContext<[Preference, SetPreference]>([
  new Options<PreferenceOption>(),
  () => {},
])

const encode = (p: Preference): string => {
  return JSON.stringify(p.map)
}

const decode = (code: string): Preference | undefined => {
  try {
    const init = JSON.parse(code) as Partial<Record<PreferenceOption, boolean>>
    return new Options<PreferenceOption>(init)
  } catch (e) {
    return undefined
  }
}
