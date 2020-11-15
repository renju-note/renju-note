import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from '@chakra-ui/react'
import 'firebase/analytics'
import React, { FC, useContext } from 'react'
import {
  RiCloseLine,
  RiFocus2Fill,
  RiGitCommitFill,
  RiGridLine,
  RiInformationLine,
  RiSettings2Line,
  RiStopMiniFill,
} from 'react-icons/ri'
import { PreferenceContext, PreferenceOption, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { preference, setPreference } = useContext(PreferenceContext)
  const boardAndMovesPreferences = [
    PreferenceOption.showIndices,
    PreferenceOption.showOrders,
    PreferenceOption.emphasizeLastMove,
  ]
  const visualizationPreferences = [
    PreferenceOption.showForbiddens,
    PreferenceOption.showPropertyEyes,
    PreferenceOption.showPropertyRows,
  ]
  return (
    <>
      <Menu autoSelect={false} placement="auto">
        <MenuButton
          as={IconButton}
          icon={<RiSettings2Line />}
          aria-label="more"
          size={system.buttonSize}
          variant="ghost"
        />
        <MenuList>
          <MenuOptionGroup
            title="Board and Moves"
            type="checkbox"
            defaultValue={preference.values}
            onChange={(values: any) =>
              setPreference(
                preference.change(boardAndMovesPreferences, values as PreferenceOption[])
              )
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
          <MenuOptionGroup
            title="Visualization"
            type="checkbox"
            defaultValue={preference.values}
            onChange={(values: any) =>
              setPreference(
                preference.change(visualizationPreferences, values as PreferenceOption[])
              )
            }
          >
            <MenuItemOption value={PreferenceOption.showForbiddens}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiCloseLine} />
                <Text ml={2}>Forbidden Points</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value={PreferenceOption.showPropertyEyes}>
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiStopMiniFill} style={{ transform: 'rotate(45deg)' }} />
                <Text ml={2}>Threes and Fours</Text>
              </Flex>
            </MenuItemOption>
            <MenuItemOption value="showPropertyRows">
              <Flex alignItems="center">
                <Icon boxSize="small" as={RiGitCommitFill} />
                <Text ml={2}>Potential Lines</Text>
              </Flex>
            </MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </>
  )
}

export default Default
