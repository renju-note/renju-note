import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { TabName } from '../../../state/advanced'
import { AdvancedStateContext } from '../../contexts'
import DetailTab from './DetailTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <Tabs
      index={advancedState.tabIndex}
      onChange={index => setAdvancedState(advancedState.setTabIndex(index))}
    >
      <TabList mx="1rem">
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
                <TabPanel key={key}>
                  <DetailTab />
                </TabPanel>
              )
            case TabName.setup:
              return (
                <TabPanel key={key}>
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
