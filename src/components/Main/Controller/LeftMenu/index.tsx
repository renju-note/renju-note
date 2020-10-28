import {
  Box,
  Icon, IconButton,
  Menu, MenuButton, MenuItem, MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiInfo, FiMenu } from 'react-icons/fi'
import { SystemContext } from '../../../contexts'
import AboutModal from './AboutModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const aboutDisclosure = useDisclosure()
  return <>
    <Menu>
      <MenuButton as={Box}>
        <IconButton
          icon={FiMenu} aria-label="menu"
          size={system.buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={aboutDisclosure.onOpen}>
          <Icon size="small" as={FiInfo} />
          <Text ml={2}>About Renju Note</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
  </>
}

export default Default
