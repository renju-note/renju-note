import { Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../../contexts'
import EditMenu from './EditMenu'
import LeftMenu from './LeftMenu'
import Navigator from './Navigator'
import PreviewingController from './PreviewingController'
import RightMenu from './RightMenu'
import UndoButton from './UndoButton'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState } = useContext(BoardStateContext)
  if (boardState.previewingGame !== undefined) return <PreviewingController />
  return (
    <Flex width={system.W} justifyContent="space-around" alignItems="center">
      <LeftMenu />
      <EditMenu />
      <Navigator />
      <UndoButton />
      <RightMenu />
    </Flex>
  )
}

export default Default
