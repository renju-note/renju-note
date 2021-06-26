import { createContext, FC, useEffect, useState } from 'react'
import { ready } from '../../database'
import { SearchState, TabName, TabsState } from '../../state'

export type AdvancedContext = {
  tabsState: TabsState
  setTabsState: (s: TabsState) => void
  searchState: SearchState
  setSearchState: (s: SearchState) => void
}

export const AdvancedContext = createContext<AdvancedContext>({
  tabsState: new TabsState(),
  setTabsState: () => {},
  searchState: new SearchState(),
  setSearchState: () => {},
})

export const AdvancedContextProvider: FC = ({ children }) => {
  const [tabsState, setTabsState] = useState<TabsState>(new TabsState())
  const [searchState, setSearchState] = useState<SearchState>(new SearchState())
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
    <AdvancedContext.Provider value={{ tabsState, setTabsState, searchState, setSearchState }}>
      {children}
    </AdvancedContext.Provider>
  )
}
