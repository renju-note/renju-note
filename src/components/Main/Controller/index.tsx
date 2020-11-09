import { Flex } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { AppStateContext, SystemContext } from '../../contexts'
import EditMenu from './EditMenu'
import LeftMenu from './LeftMenu'
import Navigator from './Navigator'
import PreviewingController from './PreviewingController'
import RightMenu from './RightMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const appState = useContext(AppStateContext)[0]
  if (appState.previewingGame !== 'empty') return <PreviewingController />
  return <Flex width={system.W} justifyContent="space-around" alignItems="center">
    <LeftMenu />
    <EditMenu />
    <Navigator />
    <UndoButton />
    <RightMenu />
  </Flex>
}

export default Default
