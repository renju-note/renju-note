import { Button, Flex } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { AppStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <Flex width={system.W} justifyContent="space-evenly" alignItems="center">
    <Button
      width={system.W / 4}
      variantColor="blue"
      onClick={() => setAppState(appState.setGameFromPreviewing())}
    >
      Open
    </Button>
    <Button
      width={system.W / 4}
      onClick={() => setAppState(appState.unsetPreviewingGame())}
    >
      Cancel
    </Button>
  </Flex>
}

export default Default
