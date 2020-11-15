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
} from '@chakra-ui/react'
import 'firebase/analytics'
import React, { FC, useContext } from 'react'
import {
  RiAddCircleFill,
  RiAddCircleLine,
  RiAtLine,
  RiCloseCircleLine,
  RiContrastFill,
  RiDeleteBinFill,
  RiEditCircleFill,
  RiEditLine,
  RiEraserLine,
  RiIndeterminateCircleLine,
  RiRadioButtonLine,
} from 'react-icons/ri'
import { BoardOption, BoardState, EditMode } from '../../../state'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <>
      <Menu autoSelect={false}>
        <MenuButton
          as={IconButton}
          icon={<ModeIcon mode={boardState.mode} />}
          aria-label="edit"
          size={system.buttonSize}
          variant="ghost"
        />
        <MenuList>
          <MenuOptionGroup
            defaultValue={boardState.mode}
            title="Mode"
            type="radio"
            onChange={(value: any) => setBoardState(boardState.setMode(value as EditMode))}
          >
            <MenuItemOption value={EditMode.mainMoves}>
              <Flex alignItems="center">
                <ModeIcon mode={EditMode.mainMoves} />
                <Text ml={2}>Move (default)</Text>
              </Flex>
            </MenuItemOption>
            <MenuDivider ml="2rem" />
            <MenuItemOption value={EditMode.freeBlacks}>
              <Flex alignItems="center">
                <ModeIcon mode={EditMode.freeBlacks} />
                <Text ml={2}>Add Black Stones</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={EditMode.freeWhites}>
              <Flex alignItems="center">
                <ModeIcon mode={EditMode.freeWhites} />
                <Text ml={2}>Add White Stones</Text>
              </Flex>
            </MenuItemOption>
            <MenuDivider ml="2rem" />
            <MenuItemOption value={EditMode.markerPoints}>
              <Flex alignItems="center">
                <ModeIcon mode={EditMode.markerPoints} />
                <Text ml={2}>Mark Points</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={EditMode.markerLines}>
              <Flex alignItems="center">
                <ModeIcon mode={EditMode.markerLines} />
                <Text ml={2}>Mark Lines</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuOptionGroup
            title="Transform"
            type="checkbox"
            defaultValue={boardState.options.values}
            onChange={(value: any) => setBoardState(boardState.setOptions(value as BoardOption[]))}
          >
            <MenuItemOption value={BoardOption.invertMoves}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiContrastFill} />
                <Text ml={2}>Invert Moves</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={BoardOption.labelMarkers}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiAtLine} />
                <Text ml={2}>Label Markers</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem onClick={() => setBoardState(boardState.clearFollowingMoves())}>
            <Icon boxSize="small" as={RiCloseCircleLine} />
            <Text ml={2}>Clear Following Moves</Text>
          </MenuItem>
          <MenuItem onClick={() => setBoardState(boardState.clearFreeStones())}>
            <Icon boxSize="small" as={RiIndeterminateCircleLine} />
            <Text ml={2}>Clear Added Stones</Text>
          </MenuItem>
          <MenuItem onClick={() => setBoardState(boardState.clearMarkers())}>
            <Icon boxSize="small" as={RiEraserLine} />
            <Text ml={2}>Clear Markers</Text>
          </MenuItem>
          <MenuItem
            onClick={() => {
              const message = 'All moves, added stones and markers will be cleared. Sure?'
              if (window.confirm(message)) setBoardState(new BoardState())
            }}
          >
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

const ModeIcon: FC<{ mode: EditMode }> = ({ mode }) => {
  switch (mode) {
    case EditMode.mainMoves:
      return <Icon boxSize="small" as={RiRadioButtonLine} />
    case EditMode.freeBlacks:
      return <Icon boxSize="small" as={RiAddCircleFill} />
    case EditMode.freeWhites:
      return <Icon boxSize="small" as={RiAddCircleLine} />
    case EditMode.markerPoints:
      return <Icon boxSize="small" as={RiEditCircleFill} />
    case EditMode.markerLines:
      return <Icon boxSize="small" as={RiEditLine} />
    default:
      return <Icon boxSize="small" as={RiRadioButtonLine} />
  }
}

export default Default
