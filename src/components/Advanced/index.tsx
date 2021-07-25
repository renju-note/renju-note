import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo } from 'react'
import { AnalyzedDatabase } from '../../database'
import { SearchResultState, TabName } from '../../state'
import { AdvancedContext, BasicContext } from '../contexts'
import DetailTab from './DetailTab'
import MateTab from './MateTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'
import StatsTab from './StatsTab'

const Default: FC = () => {
  const db = useMemo(() => new AnalyzedDatabase(), [])
  const { boardState } = useContext(BasicContext)
  const { searchQueryState, setSearchQueryState, setSearchResultState } =
    useContext(AdvancedContext)
  const boardMoves = boardState.game.current.moves
  const query = searchQueryState.query
  useEffect(() => {
    // TODO: error when game is inverted
    setSearchQueryState(searchQueryState.setMoves(boardMoves))
  }, [boardMoves.length])
  useEffect(() => {
    ;(async () => {
      const { hit, ids, error } = await db.search(query)
      setSearchResultState(new SearchResultState({ hit, gameIds: ids, error }))
    })()
  }, [query.moves?.toString(), query.playerId])
  return <AdvancedTabs />
}

const AdvancedTabs: FC = () => {
  const { tabsState, setTabsState } = useContext(AdvancedContext)
  return (
    <Tabs
      width="100%"
      index={tabsState.index}
      onChange={index => setTabsState(tabsState.setIndex(index))}
    >
      <TabList>
        {tabsState.names.map((name, key) => (
          <Tab key={key}>{upperFirst(name)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabsState.names.map((name, key) => {
          switch (name) {
            case TabName.search:
              return (
                <TabPanel key={key} px={0}>
                  <SearchTab />
                </TabPanel>
              )
            case TabName.stats:
              return (
                <TabPanel key={key} px={0}>
                  <StatsTab />
                </TabPanel>
              )
            case TabName.detail:
              return (
                <TabPanel key={key} px={0}>
                  <DetailTab />
                </TabPanel>
              )
            case TabName.mate:
              return (
                <TabPanel key={key} px={0}>
                  <MateTab />
                </TabPanel>
              )
            case TabName.setup:
              return (
                <TabPanel key={key} px={0}>
                  <SetupTab />
                </TabPanel>
              )
            default:
              return <></>
          }
        })}
      </TabPanels>
    </Tabs>
  )
}

const upperFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export default Default
