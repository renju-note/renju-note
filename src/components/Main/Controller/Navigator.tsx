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
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { gameState, setGameState } = useContext(BoardStateContext)
  return (
    <ButtonGroup spacing={1} variant="ghost" size={system.buttonSize}>
      <IconButton
        onClick={() => setGameState(gameState.toStart())}
        icon={<FiChevronsLeft />}
        aria-label="to start"
        isDisabled={!gameState.canBackward}
      />
      <IconButton
        onClick={() => setGameState(gameState.backward())}
        icon={<FiChevronLeft />}
        aria-label="backward"
        isDisabled={!gameState.canBackward}
      />
      {gameState.isBranching ? (
        <BranchingMenu />
      ) : (
        <Button
          width={6} // do not resize according to text
          fontFamily="Noto Serif"
          fontWeight="normal"
          isDisabled={true}
        >
          {gameState.cursor}
        </Button>
      )}
      <IconButton
        onClick={() => setGameState(gameState.forward())}
        icon={<FiChevronRight />}
        aria-label="forward"
        isDisabled={!gameState.canForward}
      />
      <IconButton
        onClick={() => setGameState(gameState.toLast())}
        icon={<FiChevronsRight />}
        aria-label="to last"
        isDisabled={!gameState.canForward}
      />
    </ButtonGroup>
  )
}

const BranchingMenu: FC = () => {
  const { gameState, setGameState } = useContext(BoardStateContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton as={IconButton} icon={<FiGitBranch />} colorScheme="purple" />
      <MenuList>
        <MenuItem onClick={() => setGameState(gameState.clearBranch())}>
          <Icon boxSize="small" as={RiDeleteBack2Line} />
          <Text ml={2} mr={1}>
            Clear Branch
          </Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => setGameState(gameState.newFromBranch())}>
          <Icon boxSize="small" as={RiRefreshLine} />
          <Text ml={2} mr={1}>
            Set Branch as Main
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Default
