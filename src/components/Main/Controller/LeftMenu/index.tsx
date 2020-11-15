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
import React, { FC, useContext } from 'react'
import { RiDatabase2Line, RiFlaskFill, RiMenuLine, RiQuestionLine } from 'react-icons/ri'
import { SystemContext } from '../../../contexts'
import AboutModal from './AboutModal'
import LoadRIFModal from './LoadRIFModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const loadRifDisclosure = useDisclosure()
  const aboutDisclosure = useDisclosure()
  return (
    <>
      <Menu autoSelect={false}>
        <MenuButton
          as={IconButton}
          size={system.buttonSize}
          variant="ghost"
          icon={<RiMenuLine />}
        />
        <MenuList>
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
      <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
    </>
  )
}

export default Default
