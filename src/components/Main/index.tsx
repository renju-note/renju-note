import {
  Box, Flex, Stack,
  Tab, TabList, TabPanel, TabPanels, Tabs
} from '@chakra-ui/core'
import React, { FC } from 'react'
import Board from './Board'
import Controller from './Controller'
import Searcher from './Searcher'

const Default: FC = () => {
  return <Flex justify="center" align="top" wrap="wrap">
    <Stack width={640} spacing={4}>
      <Box>
        <Board />
      </Box>
      <Box>
        <Controller />
      </Box>
    </Stack>
    <Box width={640} mt="1rem">
      <Tabs>
        <TabList>
          <Tab>Search</Tab>
          <Tab>Info</Tab>
          <Tab>Stats</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Searcher />
          </TabPanel>
          <TabPanel>
            <p>Under construction</p>
          </TabPanel>
          <TabPanel>
            <p>Under construction</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  </Flex>
}

export default Default
