import { createContext, useState } from 'react'
import { AppState } from '../../state'

export type SetAppState = (s: AppState) => void

export const useAppState = (): [AppState, SetAppState] => {
  const init = AppState.decode(window.location.hash.slice(1)) || new AppState({})
  const [appState, setAppState] = useState<AppState>(init)

  const setAppStateAndHash = (s: AppState) => {
    setAppState(s)
    window.history.replaceState(null, '', `#${s.encode()}`)
  }
  return [appState, setAppStateAndHash]
}

export const AppStateContext = createContext<[AppState, SetAppState]>([new AppState({}), () => {}])
