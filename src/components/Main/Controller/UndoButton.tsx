import { IconButton } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { IconType } from 'react-icons'
import {
  RiCloseCircleLine,
  RiEraserFill,
  RiEraserLine,
  RiIndeterminateCircleFill,
  RiIndeterminateCircleLine,
} from 'react-icons/ri'
import { EditMode } from '../../../state'
import { AppStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <IconButton
    onClick={() => setAppState(appState.undo())}
    onTouchStart={(e) => e.preventDefault()}
    icon={undoIcon(appState.mode)} aria-label="undo"
    size={system.buttonSize}
    variant="ghost"
    isDisabled={!appState.canUndo}
  />
}

const undoIcon = (mode: EditMode): IconType => {
  switch (mode) {
    case EditMode.mainMoves:
      return RiCloseCircleLine
    case EditMode.freeBlacks:
      return RiIndeterminateCircleFill
    case EditMode.freeWhites:
      return RiIndeterminateCircleLine
    case EditMode.markerPoints:
      return RiEraserFill
    case EditMode.markerLines:
      return RiEraserLine
    default:
      return RiCloseCircleLine
  }
}

export default Default
