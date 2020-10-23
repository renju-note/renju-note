import {
  Button, ButtonProps, Flex, IconButton, Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem,
  Icon,
  Box, useDisclosure
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import {
  FiInfo, FiTrash2,
  FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight,
  FiX, FiMenu, FiCamera, FiToggleRight, FiEdit, FiMoreVertical,
} from 'react-icons/fi'
import { AppStateContext } from '../../appState'
import { SystemContext } from '../../system'
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
        isDisabled={appState.isStart}
      />
      <IconButton
        onClick={() => setAppState(appState.backward())}
        icon={FiChevronLeft} aria-label="backward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isStart}
      />
      <Button
        width={6} // do not resize according to text
        size={system.buttonSize}
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
        isDisabled={true}
      >
        {appState.cursor}
      </Button>
      <IconButton
        onClick={() => setAppState(appState.forward())}
        icon={FiChevronRight} aria-label="forward"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isLast}
      />
      <IconButton
        onClick={() => setAppState(appState.toLast())}
        icon={FiChevronsRight} aria-label="to last"
        size={system.buttonSize}
        variant="ghost"
        isDisabled={appState.isLast}
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
          <Text ml={2}>Preference</Text>
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
    <Menu>
      <MenuButton as={Box}>
        <IconButton
          icon={FiEdit} aria-label="edit"
          size={buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setAppState(appState.reset())}>
          <Icon size="small" as={FiTrash2} color="red.500" />
          <Text ml={2} color="red.500">Reset</Text>
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
          <Text ml={2}>Download picture</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <DownloadHidden id={downloadHiddenId} />
  </>
}

export default Default
