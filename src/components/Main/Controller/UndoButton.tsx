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
import { EditMode, GameState } from '../../../state'
import { TabName } from '../../../state/advanced'
import { AdvancedContext, BoardStateContext } from '../../contexts'

const Default: FC = () => {
  const { boardState, setBoardState } = useContext(BoardStateContext)
  if (boardState.canClearRestOfMoves) return <ClearRestOfMovesMenu />
  if (boardState.canClearMainGame) return <ClearMainGameMenu />
  return (
    <IconButton
      onClick={() => setBoardState(boardState.undo())}
      onTouchStart={e => e.preventDefault()}
      icon={<UndoIcon mode={boardState.mode} />}
      aria-label="undo"
      colorScheme={boardState.mainGame.isBranching ? 'purple' : undefined}
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

const ClearRestOfMovesMenu: FC = () => {
  const { gameState, setGameState } = useContext(BoardStateContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton
        as={IconButton}
        icon={<RiDeleteBack2Line style={{ transform: 'rotate(180deg)' }} />}
      />
      <MenuList>
        <MenuItem onClick={() => setGameState(gameState.clearRest())}>
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
  const { setGameState } = useContext(BoardStateContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedContext)
  const onClearGame = () => {
    setGameState(new GameState())
    setAdvancedState(advancedState.setTab(TabName.search))
  }
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton as={IconButton} icon={<FiXSquare />} />
      <MenuList>
        <MenuItem onClick={onClearGame}>
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
