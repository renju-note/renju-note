import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { TabName } from '../../../state/advanced'
import { AdvancedStateContext } from '../../contexts'
import DetailTab from './DetailTab'
import MateTab from './MateTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <Tabs
      width="100%"
      index={advancedState.tabIndex}
      onChange={index => setAdvancedState(advancedState.setTabIndex(index))}
    >
      <TabList>
        {advancedState.tabs.map((tab, key) => (
          <Tab key={key}>{upperFirst(tab)}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {advancedState.tabs.map((tab, key) => {
          switch (tab) {
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
          }
        })}
      </TabPanels>
    </Tabs>
  )
}

const upperFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

export default Default
