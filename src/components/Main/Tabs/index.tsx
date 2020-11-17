import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ready } from '../../../database'
import { TabsContext } from '../../contexts'
import DetailTab from './DetailTab'
import SearchTab from './SearchTab'
import SetupTab from './SetupTab'

const Default: FC = () => {
  const [dbReady, setDBReady] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => setDBReady(await ready()))()
  }, [])
  const { index, setIndex } = useContext(TabsContext)
  return (
    <Tabs index={index} onChange={setIndex}>
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
