import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { FC, useContext } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiGitBranch,
} from 'react-icons/fi'
import { RiDeleteBack2Line, RiRefreshLine } from 'react-icons/ri'
import { GameState } from '../../../state'
import { BasicContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [game, setGame] = useGameContext()
  return (
    <ButtonGroup spacing={1} variant="ghost" size={system.buttonSize}>
      <IconButton
        onClick={() => setGame(game.toStart())}
        icon={<FiChevronsLeft />}
        aria-label="to start"
        isDisabled={!game.canBackward}
      />
      <IconButton
        onClick={() => setGame(game.backward())}
        icon={<FiChevronLeft />}
        aria-label="backward"
        isDisabled={!game.canBackward}
      />
      {game.isBranching ? (
        <BranchingMenu />
      ) : (
        <Button
          width={6} // do not resize according to text
          fontFamily="Noto Serif"
          fontWeight="normal"
          isDisabled={true}
        >
          {game.cursor}
        </Button>
      )}
      <IconButton
        onClick={() => setGame(game.forward())}
        icon={<FiChevronRight />}
        aria-label="forward"
        isDisabled={!game.canForward}
      />
      <IconButton
        onClick={() => setGame(game.toLast())}
        icon={<FiChevronsRight />}
        aria-label="to last"
        isDisabled={!game.canForward}
      />
    </ButtonGroup>
  )
}

const BranchingMenu: FC = () => {
  const [game, setGame] = useGameContext()
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton as={IconButton} icon={<FiGitBranch />} colorScheme="purple" />
      <MenuList>
        <MenuItem onClick={() => setGame(game.clearBranch())}>
          <Icon boxSize="small" as={RiDeleteBack2Line} />
          <Text ml={2} mr={1}>
            Clear Branch
          </Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => setGame(game.newFromBranch())}>
          <Icon boxSize="small" as={RiRefreshLine} />
          <Text ml={2} mr={1}>
            Set Branch as Main
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const useGameContext = (): [GameState, (game: GameState) => void] => {
  const { boardState, setBoardState } = useContext(BasicContext)
  return [boardState.game, game => setBoardState(boardState.setGame(game))]
}

export default Default
