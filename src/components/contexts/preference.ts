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

export type PreferenceContext = {
  preference: Preference
  setPreference: (p: Preference) => void
}

export const PreferenceContext = createContext<PreferenceContext>({
  preference: new Options<PreferenceOption>(),
  setPreference: () => {},
})

export const usePreference = (): PreferenceContext => {
  const [preference, setPreferenceState] = useState<Preference>(
    () => decode(localStorage.getItem('preference') || '{}') ?? new Options<PreferenceOption>()
  )
  const setPreference = (p: Preference) => {
    setPreferenceState(p)
    localStorage.setItem('preference', encode(p))
  }
  return { preference, setPreference }
}

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
