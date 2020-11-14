import { IconButton } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import {
  RiCloseCircleLine,
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
  return (
    <IconButton
      onClick={() => setBoardState(boardState.undo())}
      onTouchStart={e => e.preventDefault()}
      icon={<UndoIcon mode={boardState.mode} />}
      aria-label="undo"
      size={system.buttonSize}
      variant="ghost"
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

export default Default
