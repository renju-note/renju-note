import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import 'firebase/analytics'
import { FC, useContext } from 'react'
import {
  RiAddCircleFill,
  RiAddCircleLine,
  RiContrastFill,
  RiDeleteBinFill,
  RiEditCircleFill,
  RiEditLine,
  RiRadioButtonLine,
} from 'react-icons/ri'
import { BoardMode, BoardState } from '../../../state'
import { BasicContext } from '../../contexts'

const Default: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const { isOpen, onToggle, onClose } = useDisclosure()
  const onSetMode = (value: string | string[]) => {
    setBoardState(boardState.setMode(value as BoardMode))
  }
  const onSetOptions = (value: string | string[]) => {
    const invertMoves = (value as string[]).includes('invertMoves')
    const gameState = boardState.game.invertMoves(invertMoves)
    setBoardState(boardState.setGame(gameState))
  }
  const onResetAll = () => {
    const message = 'All moves, free stones and markers will be cleared. OK?'
    onClose()
    if (!window.confirm(message)) return
    setBoardState(new BoardState())
  }
  return (
    <>
      <Menu autoSelect={false} placement="top" isOpen={isOpen}>
        <MenuButton
          as={IconButton}
          icon={<ModeIcon mode={boardState.mode} />}
          aria-label="edit"
          onClick={onToggle}
        />
        <MenuList>
          <MenuOptionGroup type="radio" title="Mode" value={boardState.mode} onChange={onSetMode}>
            <MenuItemOption value={BoardMode.game}>
              <Flex alignItems="center">
                <ModeIcon mode={BoardMode.game} />
                <Text ml={2}>Move</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={BoardMode.freeBlacks}>
              <Flex alignItems="center">
                <ModeIcon mode={BoardMode.freeBlacks} />
                <Text ml={2}>Add Black Stones</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={BoardMode.freeWhites}>
              <Flex alignItems="center">
                <ModeIcon mode={BoardMode.freeWhites} />
                <Text ml={2}>Add White Stones</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={BoardMode.markerPoints}>
              <Flex alignItems="center">
                <ModeIcon mode={BoardMode.markerPoints} />
                <Text ml={2}>Mark Points</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={BoardMode.markerLines}>
              <Flex alignItems="center">
                <ModeIcon mode={BoardMode.markerLines} />
                <Text ml={2}>Mark Lines</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuOptionGroup
            type="checkbox"
            title="Option"
            value={boardState.game.main.inverted ? ['invertMoves'] : []}
            onChange={onSetOptions}
          >
            <MenuItemOption value="invertMoves">
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiContrastFill} />
                <Text ml={2}>Invert Moves</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem onClick={onResetAll}>
            <Icon boxSize="small" as={RiDeleteBinFill} color="red.500" />
            <Text ml={2} color="red.500">
              Reset All
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

const ModeIcon: FC<{ mode: BoardMode }> = ({ mode }) => {
  switch (mode) {
    case BoardMode.game:
      return <Icon boxSize="small" as={RiRadioButtonLine} />
    case BoardMode.freeBlacks:
      return <Icon boxSize="small" as={RiAddCircleFill} />
    case BoardMode.freeWhites:
      return <Icon boxSize="small" as={RiAddCircleLine} />
    case BoardMode.markerPoints:
      return <Icon boxSize="small" as={RiEditCircleFill} />
    case BoardMode.markerLines:
      return <Icon boxSize="small" as={RiEditLine} />
    default:
      return <Icon boxSize="small" as={RiRadioButtonLine} />
  }
}

export default Default
