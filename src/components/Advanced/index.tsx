import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { TabName } from '../../state'
import { AdvancedContext } from '../contexts'
import DetailTab from './DetailTab'
import MateTab from './MateTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
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
