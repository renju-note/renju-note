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
import React, { FC, useContext } from 'react'
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
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <ButtonGroup spacing={1} variant="ghost" size={system.buttonSize}>
      <IconButton
        onClick={() => setBoardState(boardState.toStart())}
        icon={<FiChevronsLeft />}
        aria-label="to start"
        isDisabled={!boardState.canBackward}
      />
      <IconButton
        onClick={() => setBoardState(boardState.backward())}
        icon={<FiChevronLeft />}
        aria-label="backward"
        isDisabled={!boardState.canBackward}
      />
      {boardState.isForking ? (
        <ForkingMenu />
      ) : (
        <Button
          width={6} // do not resize according to text
          fontFamily="Noto Serif"
          fontWeight="normal"
          isDisabled={true}
        >
          {boardState.cursor}
        </Button>
      )}
      <IconButton
        onClick={() => setBoardState(boardState.forward())}
        icon={<FiChevronRight />}
        aria-label="forward"
        isDisabled={!boardState.canForward}
      />
      <IconButton
        onClick={() => setBoardState(boardState.toLast())}
        icon={<FiChevronsRight />}
        aria-label="to last"
        isDisabled={!boardState.canForward}
      />
    </ButtonGroup>
  )
}

const ForkingMenu: FC = () => {
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <Menu autoSelect={false} placement="top">
      <MenuButton as={IconButton} icon={<FiGitBranch />} colorScheme="purple" />
      <MenuList>
        <MenuItem onClick={() => setBoardState(boardState.clearForkingMoves())}>
          <Icon boxSize="small" as={RiDeleteBack2Line} />
          <Text ml={2} mr={1}>
            Clear Branch
          </Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={() => setBoardState(boardState.setGameFromForking())}>
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
