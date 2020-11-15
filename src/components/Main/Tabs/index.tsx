import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC } from 'react'
import SearchTab from './SearchTab'

const Default: FC = () => {
  return (
    <Tabs>
      <TabList mx="1rem">
        <Tab>Search</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <SearchTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Default
