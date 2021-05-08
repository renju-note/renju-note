import { createContext, FC, useEffect, useState } from 'react'
import { ready } from '../../database'
import { AdvancedState, TabName } from '../../state/advanced'

export type AdvancedStateContext = {
  advancedState: AdvancedState
  setAdvancedState: (s: AdvancedState) => void
}

export const AdvancedStateContext = createContext<AdvancedStateContext>({
  advancedState: new AdvancedState(),
  setAdvancedState: () => {},
})

export const AdvancedStateProvider: FC = ({ children }) => {
  const [advancedState, setAdvancedState] = useState<AdvancedState>(new AdvancedState())
  useEffect(() => {
    ;(async () => {
      if (await ready()) {
        setAdvancedState(
          advancedState
            .setTabs([TabName.search, TabName.detail, TabName.mate, TabName.setup])
            .setTab(TabName.search)
        )
      }
    })()
  }, [])
  return (
    <AdvancedStateContext.Provider value={{ advancedState, setAdvancedState }}>
      {children}
    </AdvancedStateContext.Provider>
  )
}
