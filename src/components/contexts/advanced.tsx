import { createContext, FC, useEffect, useState } from 'react'
import { ready } from '../../database'
import { AdvancedState, TabName } from '../../state/advanced'

export type AdvancedContext = {
  advancedState: AdvancedState
  setAdvancedState: (s: AdvancedState) => void
}

export const AdvancedContext = createContext<AdvancedContext>({
  advancedState: new AdvancedState(),
  setAdvancedState: () => {},
})

export const AdvancedContextProvider: FC = ({ children }) => {
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
    <AdvancedContext.Provider value={{ advancedState, setAdvancedState }}>
      {children}
    </AdvancedContext.Provider>
  )
}
