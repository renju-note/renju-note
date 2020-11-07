import {
  Box,
  Flex,
  Icon, IconButton,
  Menu, MenuButton, MenuItem, MenuList, MenuOptionGroup, MenuItemOption, MenuDivider,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import {
  RiFocus2Fill,
  RiGridLine,
  RiInformationLine,
  RiMenuLine,
  RiQuestionLine,
  RiDatabase2Line,
} from 'react-icons/ri'
import { SystemContext, PreferenceContext, Preference } from '../../../contexts'
import AboutModal from './AboutModal'
import LoadRIFModal from './LoadRIFModal'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [preference, setPreference] = useContext(PreferenceContext)
  const preferenceValues = (() => {
    const values: (keyof Preference)[] = []
    if (preference.showIndices) values.push('showIndices')
    if (preference.emphasizeLastMove) values.push('emphasizeLastMove')
    if (preference.showOrders) values.push('showOrders')
    return values
  })()
  const loadRifDisclosure = useDisclosure()
  const aboutDisclosure = useDisclosure()
  return <>
    <Menu autoSelect={false}>
      <MenuButton as={Box}>
        <IconButton
          icon={RiMenuLine} aria-label="menu"
          size={system.buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Display"
          type="checkbox"
          defaultValue={preferenceValues}
          onChange={
            (value: any) => {
              const values = value as (keyof Preference)[]
              setPreference({
                ...preference,
                showIndices: values.includes('showIndices'),
                emphasizeLastMove: values.includes('emphasizeLastMove'),
                showOrders: values.includes('showOrders'),
              })
            }
          }
        >
          <MenuItemOption value="showIndices">
            <Flex alignItems="center">
              <Icon size="small" as={RiGridLine} />
              <Text ml={2}>Line Indices</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value="showOrders">
            <Flex alignItems="center">
              <Icon size="small" as={RiInformationLine} />
              <Text ml={2}>Move Orders</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value="emphasizeLastMove">
            <Flex alignItems="center">
              <Icon size="small" as={RiFocus2Fill} />
              <Text ml={2}>Last Move</Text>
            </Flex>
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem onClick={loadRifDisclosure.onOpen}>
          <Icon size="small" as={RiDatabase2Line} />
          <Text ml={2}>Load RIF file</Text>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={aboutDisclosure.onOpen}>
          <Icon size="small" as={RiQuestionLine} />
          <Text ml={2}>About Renju Note</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <LoadRIFModal isOpen={loadRifDisclosure.isOpen} onClose={loadRifDisclosure.onClose} />
    <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
  </>
}

export default Default
