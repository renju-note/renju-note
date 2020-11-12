import {
  Box,
  Flex,
  Icon, IconButton,
  Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup,
  Text
} from '@chakra-ui/core'
import 'firebase/analytics'
import * as firebase from 'firebase/app'
import React, { FC, useContext } from 'react'
import {
  RiCloseLine,
  RiDownload2Line,
  RiGitCommitFill,
  RiMore2Fill,
  RiStopMiniFill
} from 'react-icons/ri'
import { AppStateContext, Preference, PreferenceContext, SystemContext } from '../../../contexts'
import DownloadHidden, { onDownload } from './DownloadHidden'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const downloadHiddenId = 'download-hidden'
  const appState = useContext(AppStateContext)[0]
  const [preference, setPreference] = useContext(PreferenceContext)
  const preferenceValues = (() => {
    const values: (keyof Preference)[] = []
    if (preference.showForbiddens) values.push('showForbiddens')
    if (preference.showPropertyEyes) values.push('showPropertyEyes')
    if (preference.showPropertyRows) values.push('showPropertyRows')
    return values
  })()
  return <>
    <Menu autoSelect={false}>
      <MenuButton as={Box}>
        <IconButton
          icon={RiMore2Fill} aria-label="more"
          size={system.buttonSize}
          variant="ghost"
        />
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          title="Feature"
          type="checkbox"
          defaultValue={preferenceValues}
          onChange={
            (value: any) => {
              const values = value as (keyof Preference)[]
              setPreference({
                ...preference,
                showForbiddens: values.includes('showForbiddens'),
                showPropertyEyes: values.includes('showPropertyEyes'),
                showPropertyRows: values.includes('showPropertyRows'),
              })
            }
          }
        >
          <MenuItemOption value="showForbiddens">
            <Flex alignItems="center">
              <Icon size="small" as={RiCloseLine} />
              <Text ml={2}>Forbidden Points</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value="showPropertyEyes">
            <Flex alignItems="center">
              <Icon size="small" as={() => <RiStopMiniFill style={{ transform: 'rotate(45deg)' }} />} />
              <Text ml={2}>Threes and Fours</Text>
            </Flex>
          </MenuItemOption>
          <MenuItemOption value="showPropertyRows">
            <Flex alignItems="center">
              <Icon size="small" as={RiGitCommitFill} />
              <Text ml={2}>Potential Lines</Text>
            </Flex>
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem onClick={
          () => {
            onDownload(downloadHiddenId)
            firebase.analytics().logEvent('download_picture', { code: appState.encode() })
          }
        }>
          <Icon size="small" as={RiDownload2Line} />
          <Text ml={2}>Download Picture</Text>
        </MenuItem>
      </MenuList>
    </Menu>
    <DownloadHidden id={downloadHiddenId} />
  </>
}

export default Default
