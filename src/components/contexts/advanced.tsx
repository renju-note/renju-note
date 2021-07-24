import { createContext, FC, useEffect, useState } from 'react'
import { ready } from '../../database'
import { SearchQueryState, SearchResultState, TabName, TabsState } from '../../state'

export type AdvancedContext = {
  tabsState: TabsState
  setTabsState: (s: TabsState) => void
  searchQueryState: SearchQueryState
  setSearchQueryState: (s: SearchQueryState) => void
  searchResultState: SearchResultState
  setSearchResultState: (s: SearchResultState) => void
}

export const AdvancedContext = createContext<AdvancedContext>({
  tabsState: new TabsState(),
  setTabsState: () => {},
  searchQueryState: new SearchQueryState(),
  setSearchQueryState: () => {},
  searchResultState: new SearchResultState(),
  setSearchResultState: () => {},
})

export const AdvancedContextProvider: FC = ({ children }) => {
  const [tabsState, setTabsState] = useState<TabsState>(new TabsState())
  const [searchQueryState, setSearchQueryState] = useState<SearchQueryState>(new SearchQueryState())
  const [searchResultState, setSearchResultState] = useState<SearchResultState>(
    new SearchResultState()
  )
  const value = {
    tabsState,
    setTabsState,
    searchQueryState,
    setSearchQueryState,
    searchResultState,
    setSearchResultState,
  }
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
  return <AdvancedContext.Provider value={value}>{children}</AdvancedContext.Provider>
}
