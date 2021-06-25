import { ButtonGroup } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../../contexts'
import ConfirmBar from './ConfirmBar'
import EditMenu from './EditMenu'
import MainMenu from './MainMenu'
import Navigator from './Navigator'
import SettingsMenu from './SettingsMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const { confirmState } = useContext(BoardStateContext)
  return <>{confirmState !== undefined ? <ConfirmBar /> : <DefaultBar />}</>
}

const DefaultBar: FC = () => {
  const system = useContext(SystemContext)
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
