import { createContext, FC, useEffect, useState } from 'react'
import { ready } from '../../database'
import { AdvancedState, TabName, TabsState } from '../../state'

export type AdvancedContext = {
  tabsState: TabsState
  advancedState: AdvancedState
  setTabsState: (s: TabsState) => void
  setAdvancedState: (s: AdvancedState) => void
}

export const AdvancedContext = createContext<AdvancedContext>({
  tabsState: new TabsState(),
  advancedState: new AdvancedState(),
  setTabsState: () => {},
  setAdvancedState: () => {},
})

export const AdvancedContextProvider: FC = ({ children }) => {
  const [tabsState, setTabsState] = useState<TabsState>(new TabsState())
  const [advancedState, setAdvancedState] = useState<AdvancedState>(new AdvancedState())
  useEffect(() => {
    ;(async () => {
      if (await ready()) {
        setTabsState(
          tabsState
            .setNames([TabName.search, TabName.detail, TabName.mate, TabName.setup])
            .setCurrent(TabName.search)
        )
      }
    })()
  }, [])
  return (
    <AdvancedContext.Provider value={{ tabsState, advancedState, setTabsState, setAdvancedState }}>
      {children}
    </AdvancedContext.Provider>
  )
}
