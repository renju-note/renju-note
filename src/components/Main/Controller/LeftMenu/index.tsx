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
import React, { FC, useContext } from 'react'
import {
  RiDatabase2Line,
  RiFlaskFill,
  RiFocus2Fill,
  RiGridLine,
  RiInformationLine,
  RiMenuLine,
  RiQuestionLine,
} from 'react-icons/ri'
import { PreferenceContext, PreferenceOption, SystemContext } from '../../../contexts'
import AboutModal from './AboutModal'
import LoadRIFModal from './LoadRIFModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { preference, setPreference } = useContext(PreferenceContext)
  const targetPreferences = [
    PreferenceOption.showIndices,
    PreferenceOption.showOrders,
    PreferenceOption.emphasizeLastMove,
  ]
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
          <MenuOptionGroup
            title="Display"
            type="checkbox"
            defaultValue={preference.values}
            onChange={(values: any) =>
              setPreference(preference.change(targetPreferences, values as PreferenceOption[]))
            }
          >
            <MenuItemOption value={PreferenceOption.showIndices}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiGridLine} />
                <Text ml={2}>Line Indices</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={PreferenceOption.showOrders}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiInformationLine} />
                <Text ml={2}>Move Orders</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={PreferenceOption.emphasizeLastMove}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiFocus2Fill} />
                <Text ml={2}>Last Move</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuItem onClick={loadRifDisclosure.onOpen}>
            <Icon boxSize="small" as={RiDatabase2Line} />
            <Text ml={2} mr={1}>
              Load RIF file{' '}
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
