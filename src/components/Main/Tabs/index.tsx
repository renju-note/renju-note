import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { ready } from '../../../database'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
  const [dbReady, setDBReady] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => setDBReady(await ready()))()
  }, [])
  if (!dbReady) {
    return (
      <Tabs>
        <TabList mx="1rem">
          <Tab>Setup</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SetupTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }
  return (
    <Tabs>
      <TabList mx="1rem">
        <Tab>Search</Tab>
        <Tab>Setup</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <SearchTab />
        </TabPanel>
        <TabPanel>
          <SetupTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Default
