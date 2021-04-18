import { ButtonGroup } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { EditMode } from '../../../state'
import { BoardStateContext, SystemContext } from '../../contexts'
import EditMenu from './EditMenu'
import MainMenu from './MainMenu'
import Navigator from './Navigator'
import PreviewingController from './PreviewingController'
import SettingsMenu from './SettingsMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState } = useContext(BoardStateContext)
  if (boardState.mode === EditMode.preview) return <PreviewingController />
  return (
    <ButtonGroup
      width="100%"
      variant="ghost"
      justifyContent="space-around"
      alignItems="center"
      size={system.buttonSize}
    >
      <MainMenu />
      <EditMenu />
      <Navigator />
      <UndoButton />
      <SettingsMenu />
    </ButtonGroup>
  )
}

export default Default
