import {
  Box,
  Flex,
  Icon, IconButton,
  Menu, MenuButton, MenuItem, MenuList, MenuOptionGroup, MenuItemOption, MenuDivider,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { FiHelpCircle, FiMenu } from 'react-icons/fi'
import { RiFocus2Fill, RiGridLine, RiInformationLine } from 'react-icons/ri'
import { SystemContext, PreferenceContext, Preference } from '../../../contexts'
import AboutModal from './AboutModal'

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
        <MenuItem onClick={aboutDisclosure.onOpen}>
          <Icon size="small" as={FiHelpCircle} />
          <Text ml={2}>About Renju Note</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <AboutModal isOpen={aboutDisclosure.isOpen} onClose={aboutDisclosure.onClose} />
  </>
}

export default Default
