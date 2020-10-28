import {
  Box,
  Icon, IconButton,
  Menu, MenuButton, MenuDivider, MenuItem, MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import * as firebase from 'firebase/app'
import 'firebase/analytics'
import React, { FC, useContext } from 'react'
import { FiCamera, FiMoreVertical, FiToggleRight } from 'react-icons/fi'
import { AppStateContext, SystemContext } from '../../../contexts'
import DownloadHidden, { onDownload } from './DownloadHidden'
import PreferenceModal from './PreferenceModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const preferenceDisclosure = useDisclosure()
  const downloadHiddenId = 'download-hidden'
  const appState = useContext(AppStateContext)[0]
  return <>
    <Menu>
      <MenuButton as={Box}>
        <IconButton
          icon={FiMoreVertical} aria-label="more"
          size={system.buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={preferenceDisclosure.onOpen}>
          <Icon size="small" as={FiToggleRight} />
          <Text ml={2}>Preferences</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={
          () => {
            onDownload(downloadHiddenId)
            firebase.analytics().logEvent('download_picture', { code: appState.code })
          }
        }>
          <Icon size="small" as={FiCamera} />
          <Text ml={2}>Download Picture</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <PreferenceModal isOpen={preferenceDisclosure.isOpen} onClose={preferenceDisclosure.onClose} />
    <DownloadHidden id={downloadHiddenId} />
  </>
}

export default Default
