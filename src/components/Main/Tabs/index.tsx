import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core'
import React, { FC } from 'react'
import SearchTabContent from './SearchTabContent'

const Default: FC = () => {
  return <Tabs>
    <TabList mx="1rem">
      <Tab>Search</Tab>
    </TabList>
    <TabPanels>
      <TabPanel pt="1rem">
        <SearchTabContent />
      </TabPanel>
    </TabPanels>
  </Tabs>
}

export default Default
