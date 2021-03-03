import { Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { AdvancedStateContext } from '../../contexts'
import EditMenu from './EditMenu'
import MainMenu from './MainMenu'
import Navigator from './Navigator'
import PreviewingController from './PreviewingController'
import SettingsMenu from './SettingsMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const { advancedState } = useContext(AdvancedStateContext)
  if (advancedState.previewingGame !== undefined) return <PreviewingController />
  return (
    <Flex width="100%" justifyContent="space-around" alignItems="center">
      <MainMenu />
      <EditMenu />
      <Navigator />
      <UndoButton />
      <SettingsMenu />
    </Flex>
  )
}

export default Default
