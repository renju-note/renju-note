import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { ready } from '../../../database'
import { GameViewProvider } from './contexts'
import DetailTab from './DetailTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
  return (
    <GameViewProvider>
      <MainTabs />
    </GameViewProvider>
  )
}

const MainTabs: FC = () => {
  const [dbReady, setDBReady] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => setDBReady(await ready()))()
  }, [])
  return (
    <Tabs>
      <TabList mx="1rem">
        {dbReady && <Tab>Search</Tab>}
        {dbReady && <Tab>Detail</Tab>}
        <Tab>Setup</Tab>
      </TabList>
      <TabPanels>
        {dbReady && (
          <TabPanel px={0}>
            <SearchTab />
          </TabPanel>
        )}
        {dbReady && (
          <TabPanel>
            <DetailTab />
          </TabPanel>
        )}
        <TabPanel>
          <SetupTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Default
