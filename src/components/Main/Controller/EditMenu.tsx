import {
  Box,
  Flex,
  Icon, IconButton,
  Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup,
  Text
} from '@chakra-ui/core'
import 'firebase/analytics'
import React, { FC, useContext } from 'react'
import {
  RiAddCircleFill,
  RiAddCircleLine,
  RiAtLine,
  RiCloseCircleLine,
  RiContrastFill,
  RiDeleteBinFill,
  RiEditCircleLine,
  RiEditLine,
  RiEraserLine,
  RiIndeterminateCircleLine,
  RiRadioButtonLine
} from 'react-icons/ri'
import { AppOption, AppState, EditMode } from '../../../state'
import { AppStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <>
    <Menu autoSelect={false}>
      <MenuButton as={Box}>
        <IconButton
          icon={() => <ModeIcon mode={appState.mode} />}
          aria-label="edit"
          size={system.buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={appState.mode} title="Mode" type="radio" onChange={
          (value: any) => setAppState(appState.setMode(value as EditMode))
        }>
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
          defaultValue={appState.options}
          onChange={
            (value: any) => setAppState(appState.setOptions(value as AppOption[]))
          }
        >
          <MenuItemOption value={AppOption.invertMoves}>
            <Flex alignItems="center">
              <Icon size="small" as={RiContrastFill} />
              <Text ml={2}>Invert Moves</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value={AppOption.labelMarkers}>
            <Flex alignItems="center">
              <Icon size="small" as={RiAtLine} />
              <Text ml={2}>Label Markers</Text>
            </Flex>
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem onClick={() => setAppState(appState.clearMoves())}>
          <Icon size="small" as={RiCloseCircleLine} />
          <Text ml={2}>Clear Moves</Text>
        </MenuItem>
        <MenuItem onClick={() => setAppState(appState.clearFreeStones())}>
          <Icon size="small" as={RiIndeterminateCircleLine} />
          <Text ml={2}>Clear Added Stones</Text>
        </MenuItem>
        <MenuItem onClick={() => setAppState(appState.clearMarkers())}>
          <Icon size="small" as={RiEraserLine} />
          <Text ml={2}>Clear Markers</Text>
        </MenuItem>
        <MenuItem
          onClick={
            () => {
              const message = 'All moves, added stones and markers will be cleared. Sure?'
              if (window.confirm(message)) setAppState(new AppState({}))
            }
          }>
          <Icon size="small" as={RiDeleteBinFill} color="red.500" />
          <Text ml={2} color="red.500">Reset All</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  </>
}

const ModeIcon: FC<{ mode: EditMode }> = ({
  mode,
}) => {
  switch (mode) {
    case EditMode.mainMoves:
      return <Icon size="small" as={RiRadioButtonLine} />
    case EditMode.freeBlacks:
      return <Icon size="small" as={RiAddCircleFill} />
    case EditMode.freeWhites:
      return <Icon size="small" as={RiAddCircleLine} />
    case EditMode.markerPoints:
      return <Icon size="small" as={RiEditCircleLine} />
    case EditMode.markerLines:
      return <Icon size="small" as={RiEditLine} />
    default:
      return <Icon size="small" as={RiRadioButtonLine} />
  }
}

export default Default
