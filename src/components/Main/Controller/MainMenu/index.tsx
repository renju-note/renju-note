import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import 'firebase/analytics'
import * as firebase from 'firebase/app'
import React, { FC, useContext } from 'react'
import {
  RiDatabase2Line,
  RiDownload2Line,
  RiFlaskFill,
  RiMenuLine,
  RiQuestionLine,
} from 'react-icons/ri'
import { BoardStateContext, SystemContext } from '../../../contexts'
import AboutModal from './AboutModal'
import DownloadHidden, { onDownload } from './DownloadHidden'
import LoadRIFModal from './LoadRIFModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const downloadHiddenId = 'download-hidden'
  const { boardState } = useContext(BoardStateContext)
  const loadRifDisclosure = useDisclosure()
  const aboutDisclosure = useDisclosure()
  return (
    <>
      <Menu autoSelect={false} placement="auto">
        <MenuButton
          as={IconButton}
          size={system.buttonSize}
          variant="ghost"
          icon={<RiMenuLine />}
        />
        <MenuList>
          <MenuItem
            onClick={() => {
              onDownload(downloadHiddenId)
              firebase.analytics().logEvent('download_picture', { code: boardState.encode() })
            }}
          >
            <Icon boxSize="small" as={RiDownload2Line} />
            <Text ml={2}>Download Picture</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={loadRifDisclosure.onOpen}>
            <Icon boxSize="small" as={RiDatabase2Line} />
            <Text ml={2} mr={1}>
              Load .rif file{' '}
            </Text>
            <Icon boxSize="small" as={RiFlaskFill} />
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={aboutDisclosure.onOpen}>
            <Icon boxSize="small" as={RiQuestionLine} />
            <Text ml={2}>About Renju Note</Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <LoadRIFModal isOpen={loadRifDisclosure.isOpen} onClose={loadRifDisclosure.onClose} />
      <DownloadHidden id={downloadHiddenId} />
      <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
    </>
  )
}

export default Default
