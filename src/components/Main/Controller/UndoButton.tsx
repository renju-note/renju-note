import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { FC, useContext } from 'react'
import { FiXSquare } from 'react-icons/fi'
import {
  RiCloseCircleLine,
  RiDeleteBack2Line,
  RiEraserFill,
  RiEraserLine,
  RiIndeterminateCircleFill,
  RiIndeterminateCircleLine,
} from 'react-icons/ri'
import { BoardMode, GameState } from '../../../state'
import { BasicContext } from '../../contexts'

const Default: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  if (boardState.canClearRestOfMoves) return <ClearRestOfMovesMenu />
  if (boardState.canClearMainGame) return <ClearMainGameMenu />
  return (
    <IconButton
      onClick={() => setBoardState(boardState.undo())}
      onTouchStart={e => e.preventDefault()}
      icon={<UndoIcon mode={boardState.mode} />}
      aria-label="undo"
      colorScheme={boardState.game.isBranching ? 'purple' : undefined}
      isDisabled={!boardState.canUndo}
    />
  )
}

const UndoIcon: FC<{ mode: BoardMode }> = ({ mode }) => {
  switch (mode) {
    case BoardMode.game:
      return <RiCloseCircleLine />
    case BoardMode.freeBlacks:
      return <RiIndeterminateCircleFill />
    case BoardMode.freeWhites:
      return <RiIndeterminateCircleLine />
    case BoardMode.markerPoints:
      return <RiEraserFill />
    case BoardMode.markerLines:
      return <RiEraserLine />
    default:
      return <RiCloseCircleLine />
  }
}

const ClearRestOfMovesMenu: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton
        as={IconButton}
        icon={<RiDeleteBack2Line style={{ transform: 'rotate(180deg)' }} />}
      />
      <MenuList>
        <MenuItem onClick={() => setBoardState(boardState.setGame(boardState.game.clearRest()))}>
          <Icon boxSize="small" as={RiDeleteBack2Line} style={{ transform: 'rotate(180deg)' }} />
          <Text ml={2} mr={1}>
            Clear Rest of Moves
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const ClearMainGameMenu: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton as={IconButton} icon={<FiXSquare />} />
      <MenuList>
        <MenuItem onClick={() => setBoardState(boardState.setGame(new GameState()))}>
          <Icon boxSize="small" as={FiXSquare} />
          <Text ml={2} mr={1}>
            Clear Game
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Default
