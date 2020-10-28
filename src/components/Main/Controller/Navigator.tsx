import {
  Button,
  Flex,
  IconButton
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { AppStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <Flex justifyContent="center" alignItems="center">
    <IconButton
      onClick={() => setAppState(appState.toStart())}
      icon={FiChevronsLeft} aria-label="to start"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={appState.isStart}
    />
    <IconButton
      onClick={() => setAppState(appState.backward())}
      icon={FiChevronLeft} aria-label="backward"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={appState.isStart}
    />
    <Button
      width={6} // do not resize according to text
      size={system.buttonSize}
      variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
      isDisabled={true}
    >
      {appState.cursor}
    </Button>
    <IconButton
      onClick={() => setAppState(appState.forward())}
      icon={FiChevronRight} aria-label="forward"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={appState.isLast}
    />
    <IconButton
      onClick={() => setAppState(appState.toLast())}
      icon={FiChevronsRight} aria-label="to last"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={appState.isLast}
    />
  </Flex>
}

export default Default
