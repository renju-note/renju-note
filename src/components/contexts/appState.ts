import { createContext, useState } from 'react'

import { AppState } from '../../state'

export type SetAppState = (s: AppState) => void

export const useAppState = (): [AppState, SetAppState] => {
  const init = parseAppState(window.location.hash) || new AppState({})
  const [appState, setAppState] = useState<AppState>(init)

  const setAppStateAndHash = (s: AppState) => {
    setAppState(s)
    window.history.replaceState(null, '', `#${s.code}`)
  }
  return [appState, setAppStateAndHash]
}

export const AppStateContext = createContext<[AppState, SetAppState]>([new AppState({}), () => {}])

const parseAppState = (windowLocationHash: string): AppState | undefined => {
  try {
    return new AppState({ code: windowLocationHash.slice(1) })
  } catch (e) {
    console.log(`Invalid fragment: '${windowLocationHash}'`)
  }
}
