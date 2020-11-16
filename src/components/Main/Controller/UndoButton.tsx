import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import {
  RiCloseCircleLine,
  RiDeleteBack2Line,
  RiEraserFill,
  RiEraserLine,
  RiIndeterminateCircleFill,
  RiIndeterminateCircleLine,
} from 'react-icons/ri'
import { EditMode } from '../../../state'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  if (!boardState.isForking && !boardState.isLast) {
    return <RestMenu />
  }
  return (
    <IconButton
      onClick={() => setBoardState(boardState.undo())}
      onTouchStart={e => e.preventDefault()}
      icon={<UndoIcon mode={boardState.mode} />}
      aria-label="undo"
      size={system.buttonSize}
      variant="ghost"
      colorScheme={boardState.isForking ? 'purple' : undefined}
      isDisabled={!boardState.canUndo}
    />
  )
}

const UndoIcon: FC<{ mode: EditMode }> = ({ mode }) => {
  switch (mode) {
    case EditMode.mainMoves:
      return <RiCloseCircleLine />
    case EditMode.freeBlacks:
      return <RiIndeterminateCircleFill />
    case EditMode.freeWhites:
      return <RiIndeterminateCircleLine />
    case EditMode.markerPoints:
      return <RiEraserFill />
    case EditMode.markerLines:
      return <RiEraserLine />
    default:
      return <RiCloseCircleLine />
  }
}

const RestMenu: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton
        size={system.buttonSize}
        as={IconButton}
        variant="ghost"
        icon={<RiDeleteBack2Line style={{ transform: 'rotate(180deg)' }} />}
      />
      <MenuList>
        <MenuItem onClick={() => setBoardState(boardState.clearRestMoves())}>
          <Icon boxSize="small" as={RiDeleteBack2Line} style={{ transform: 'rotate(180deg)' }} />
          <Text ml={2} mr={1}>
            Clear Rest of Moves
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Default
