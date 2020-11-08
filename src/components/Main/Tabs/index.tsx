import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/core'
import React, { FC } from 'react'
import SearchTabContent from './SearchTabContent'

const Default: FC = () => {
  return <Tabs>
    <TabList>
      <Tab>Search</Tab>
      <Tab>Information</Tab>
    </TabList>
    <TabPanels>
      <TabPanel pt="1rem">
        <SearchTabContent />
      </TabPanel>
      <TabPanel pt="1rem">
        <p>Under construction</p>
      </TabPanel>
    </TabPanels>
  </Tabs>
}

export default Default
