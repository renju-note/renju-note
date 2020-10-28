import { IconButton } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiX } from 'react-icons/fi'
import { AppStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <IconButton
    onClick={() => setAppState(appState.undo())}
    icon={FiX} aria-label="undo"
    size={system.buttonSize}
    variant="ghost"
    isDisabled={!appState.canUndo}
  />
}

export default Default
