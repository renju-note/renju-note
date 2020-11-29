import { Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { AdvancedStateContext, SystemContext } from '../../contexts'
import EditMenu from './EditMenu'
import MainMenu from './MainMenu'
import Navigator from './Navigator'
import PreviewingController from './PreviewingController'
import SettingsMenu from './SettingsMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { advancedState } = useContext(AdvancedStateContext)
  if (advancedState.preview !== undefined) return <PreviewingController />
  return (
    <Flex width={system.W} justifyContent="space-around" alignItems="center">
      <MainMenu />
      <EditMenu />
      <Navigator />
      <UndoButton />
      <SettingsMenu />
    </Flex>
  )
}

export default Default
