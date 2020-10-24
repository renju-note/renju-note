import {
  Button, ButtonProps, Flex, IconButton, Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  Icon,
  Box, useDisclosure,
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import {
  FiLoader,
  FiInfo,
  FiTrash2,
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiX, FiMenu, FiCamera, FiToggleRight, FiEdit, FiMoreVertical, FiCircle, FiPlayCircle, FiEdit2, FiType
} from 'react-icons/fi'
import { AppState, EditMode } from '../../../state'
import { AppStateContext, SystemContext } from '../../contexts'
import AboutModal from './AboutModal'
import PreferenceModal from './PreferenceModal'
import DownloadHidden, { onDownload } from './DownloadHidden'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  return <Flex width={system.W} justifyContent="space-around" alignItems="center">
    <LeftMenu
      buttonSize={system.buttonSize}
    />
    <EditMenu
      buttonSize={system.buttonSize}
    />
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setAppState(appState.toStart())}
        icon={FiChevronsLeft} aria-label="to start"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.gameState.isStart}
      />
      <IconButton
        onClick={() => setAppState(appState.backward())}
        icon={FiChevronLeft} aria-label="backward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.gameState.isStart}
      />
      <Button
        width={6} // do not resize according to text
        size={system.buttonSize}
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
        isDisabled={true}
      >
        {appState.gameState.cursor}
      </Button>
      <IconButton
        onClick={() => setAppState(appState.forward())}
        icon={FiChevronRight} aria-label="forward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.gameState.isLast}
      />
      <IconButton
        onClick={() => setAppState(appState.toLast())}
        icon={FiChevronsRight} aria-label="to last"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.gameState.isLast}
      />
    </Flex>
    <IconButton
      onClick={() => setAppState(appState.undo())}
      icon={FiX} aria-label="undo"
      size={system.buttonSize}
      variant="ghost"
      isDisabled={!appState.canUndo}
    />
    <RightMenu
      buttonSize={system.buttonSize}
    />
  </Flex>
}

type MenuProps = {
  buttonSize: ButtonProps['size']
}

const LeftMenu: FC<MenuProps> = ({
  buttonSize,
}) => {
  const preferenceDisclosure = useDisclosure()
  const aboutDisclosure = useDisclosure()
  return <>
    <Menu>
      <MenuButton as={Box}>
        <IconButton
          icon={FiMenu} aria-label="menu"
          size={buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={preferenceDisclosure.onOpen}>
          <Icon size="small" as={FiToggleRight} />
          <Text ml={2}>Preferences</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={aboutDisclosure.onOpen}>
          <Icon size="small" as={FiInfo} />
          <Text ml={2}>About</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <PreferenceModal isOpen={preferenceDisclosure.isOpen} onClose={preferenceDisclosure.onClose} />
    <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
  </>
}

const EditMenu: FC<MenuProps> = ({
  buttonSize,
}) => {
  const [appState, setAppState] = useContext(AppStateContext)
  return <>
    <Menu closeOnSelect={false}>
      <MenuButton as={Box}>
        <IconButton
          icon={FiEdit} aria-label="edit"
          size={buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup defaultValue={appState.mode} title="Mode" type="radio" onChange={
          (value: any) => setAppState(appState.setMode(value as EditMode))
        }>
          <MenuItemOption value={EditMode.mainMoves}>
            <Flex alignItems="center">
              <Icon size="small" as={FiPlayCircle}/>
              <Text ml={2}>Main Moves</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value={EditMode.freeBlacks}>
            <Flex alignItems="center">
              <Icon size="small" as={FiCircle} fill="black" />
              <Text ml={2}>Free Blacks</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value={EditMode.freeWhites}>
            <Flex alignItems="center">
              <Icon size="small" as={FiCircle}/>
              <Text ml={2}>Free Whites</Text>
            </Flex>
          </MenuItemOption>
          <MenuDivider />
          <MenuItemOption value={EditMode.markerAlphabets}>
            <Flex alignItems="center">
              <Icon size="small" as={FiType}/>
              <Text ml={2}>Marker Alphabets</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value={EditMode.markerLines}>
            <Flex alignItems="center">
              <Icon size="small" as={FiEdit2}/>
              <Text ml={2}>Marker Lines</Text>
            </Flex>
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem>
          <Icon size="small" as={FiTrash2} />
          <Text ml={2}>Reset Markers</Text>
        </MenuItem>
        <MenuItem onClick={
          () => {
            if (window.confirm('Going to reset all moves, free stones, and markers. Sure?')) {
              setAppState(new AppState({}))
            }
          }
        }>
          <Icon size="small" as={FiLoader} color="red.500" />
          <Text ml={2} color="red.500">Reset All</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  </>
}

const RightMenu: FC<MenuProps> = ({
  buttonSize,
}) => {
  const downloadHiddenId = 'download-hidden'
  return <>
    <Menu>
      <MenuButton as={Box}>
        <IconButton
          icon={FiMoreVertical} aria-label="more"
          size={buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => onDownload(downloadHiddenId)}>
          <Icon size="small" as={FiCamera} />
          <Text ml={2}>Download Picture</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <DownloadHidden id={downloadHiddenId} />
  </>
}

export default Default
